import { showToast } from '/components/toast.js';
import { validateNickname } from '/features/auth/utils/validation.js';
import { updateProfile } from '/features/auth/edit-profile/edit/model.js';

export function initProfileEditPage() {
    loadProfile();
    setupFormValidation();
    setupProfileEditSubmit();
    setupProfileImageHandler();
}

function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/pages/auth/login';
        return;
    }

    document.getElementById('email').value = currentUser.email;
    document.getElementById('nickname').value = currentUser.nickname;
    document.getElementById('profile-preview').innerHTML = `
        <img src="${currentUser.profile}" alt="프로필 이미지">
    `;
}

function setupFormValidation() {
    const nicknameInput = document.getElementById('nickname');
    
    nicknameInput.addEventListener('input', updateEditButtonState);
    nicknameInput.addEventListener('blur', () => {
        validateField('nickname', validateNickname);
        updateEditButtonState();
    });
}

function setupProfileEditSubmit() {
    const editForm = document.getElementById('edit-profile-form');
    
    editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            nickname: document.getElementById('nickname').value,
            profile: document.getElementById('profile-preview').querySelector('img')?.src
        };

        if (!validateProfileImage()) return;

        const result = await updateProfile(formData);
        
        if (result.success) {
            showToast('수정 완료');
            setTimeout(() => window.location.reload(), 2000);
        } else {
            const errorElement = document.getElementById('nickname-error');
            if (errorElement) {
                errorElement.textContent = result.error;
            }
        }
    });
}

function setupProfileImageHandler() {
    const profileInput = document.getElementById('profile');
    profileInput.addEventListener('change', handleProfilePreview);
}

function handleProfilePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profile-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="프로필 미리보기">`;
            clearError('profile-error');
            updateEditButtonState();
        }
        reader.readAsDataURL(file);
    }
}

// 유틸리티 함수들
function validateProfileImage() {
    const profilePreview = document.getElementById('profile-preview');
    const profileImage = profilePreview.querySelector('img');
    
    if (!profileImage || !profileImage.src) {
        showError('profile-error', '*프로필 사진을 추가해주세요.');
        return false;
    }
    clearError('profile-error');
    return true;
}

function validateField(fieldName, validationFn) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const errorMessage = validationFn(field.value);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
        field.classList.toggle('error', !!errorMessage);
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
}

function updateEditButtonState() {
    const nickname = document.getElementById('nickname');
    const submitButton = document.querySelector('.submit-button');
    
    const nicknameValid = !document.getElementById('nickname-error').textContent;
    const profileValid = !!document.getElementById('profile-preview').querySelector('img');
    
    const isValid = nicknameValid && profileValid && nickname.value;
    submitButton.disabled = !isValid;
}