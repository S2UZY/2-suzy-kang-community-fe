import { validateEmail, validatePassword, validateNickname } from '/features/auth/utils/validation.js';
import { registerUser } from '/features/auth/register/model.js';

export function initRegisterPage() {
    setupFormValidation();
    setupRegisterSubmit();
    setupProfileImageHandler();
}

function setupFormValidation() {
    const inputs = {
        email: { validate: validateEmailField },
        password: { validate: validatePasswordField },
        'password-confirm': { validate: validatePasswordConfirmField },
        nickname: { validate: validateNicknameField }
    };

    Object.keys(inputs).forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('blur', () => {
            inputs[id].validate();
            updateRegisterButton();
        });
    });

    document.querySelectorAll('.input-group input').forEach(input => {
        input.addEventListener('input', updateRegisterButton);
    });
}

function setupRegisterSubmit() {
    const registerForm = document.getElementById('register-form');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isValid = validateProfileImage() &&
            validateEmailField() &&
            validatePasswordField() &&
            validatePasswordConfirmField() &&
            validateNicknameField();
        
        if (!isValid) return;

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            nickname: document.getElementById('nickname').value,
            profile: document.getElementById('profile-preview').querySelector('img').src
        };

        const result = await registerUser(formData);
        
        if (result.success) {
            alert('회원가입이 완료되었습니다.');
            window.location.href = '/pages/auth/login';
        } else {
            alert(result.error);
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
    const profilePlus = document.getElementById('profile-plus');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="프로필 미리보기">`;
            profilePlus.style.display = 'none';
            clearError('profile-error');
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = `<div id="profile-plus" class="profile-plus">+</div>`;
        showError('profile-error', '*프로필 사진을 추가해주세요.');
    }
    updateRegisterButton();
}

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

function validateEmailField() {
    const email = document.getElementById('email').value;
    const error = validateEmail(email);
    if (error) {
        showError('email-error', error);
        return false;
    }
    clearError('email-error');
    return true;
}

function validatePasswordField() {
    const password = document.getElementById('password').value;
    const error = validatePassword(password);
    if (error) {
        showError('password-error', error);
        return false;
    }
    clearError('password-error');
    return true;
}

function validatePasswordConfirmField() {
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    if (!passwordConfirm) {
        showError('password-confirm-error', '*비밀번호를 한번더 입력해주세요.');
        return false;
    }
    if (password !== passwordConfirm) {
        showError('password-confirm-error', '*비밀번호가 다릅니다.');
        return false;
    }
    clearError('password-confirm-error');
    return true;
}

function validateNicknameField() {
    const nickname = document.getElementById('nickname').value;
    const error = validateNickname(nickname);
    if (error) {
        showError('nickname-error', error);
        return false;
    }
    clearError('nickname-error');
    return true;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.parentElement.querySelector('input')?.classList.add('error');
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
    element.parentElement.querySelector('input')?.classList.remove('error');
}

function updateRegisterButton() {
    const profileImage = document.getElementById('profile-preview').querySelector('img');
    const isValid = !document.querySelector('.error-message').textContent;
    const allFieldsFilled = ['email', 'password', 'password-confirm', 'nickname']
        .every(id => document.getElementById(id).value)
        && profileImage && profileImage.src;
    
    document.querySelector('.register-button').disabled = !(isValid && allFieldsFilled);
}