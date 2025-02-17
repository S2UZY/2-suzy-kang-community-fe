import { showToast } from '/components/toast.js';

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
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

function validateNewPassword() {
    const newPassword = document.getElementById('new-password').value;
    if (!newPassword) {
        showError('new-password-error', '*비밀번호를 입력해주세요.');
        return false;
    }
    if (!validatePassword(newPassword)) {
        showError('new-password-error', '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
        return false;
    }
    clearError('new-password-error');
    return true;
}

function validateConfirmPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!confirmPassword) {
        showError('confirm-password-error', '*비밀번호를 한번 더 입력해주세요.');
        return false;
    }
    if (newPassword !== confirmPassword) {
        showError('confirm-password-error', '*비밀번호와 다릅니다.');
        return false;
    }
    clearError('confirm-password-error');
    return true;
}

function updateSubmitButton() {
    const newPasswordValid = validateNewPassword();
    const confirmPasswordValid = validateConfirmPassword();
    document.querySelector('.submit-button').disabled = !(newPasswordValid && confirmPasswordValid);
}

export function handlePasswordChange(event) {
    event.preventDefault();
    
    const isValid = validateNewPassword() && validateConfirmPassword();
    if (!isValid) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/features/auth/login.html';
        return;
    }

    const newPassword = document.getElementById('new-password').value;

    // 비밀번호 업데이트
    const users = JSON.parse(localStorage.getItem('users'));
    const updatedUser = {
        ...currentUser,
        password: newPassword
    };

    // users 배열에서 현재 사용자 정보 업데이트
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    users[userIndex] = updatedUser;

    // localStorage 업데이트
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(users));

    showToast('수정 완료');
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // input 이벤트에서 유효성 검사 실행
    newPasswordInput.addEventListener('input', () => {
        validateNewPassword();
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        updateSubmitButton();
    });

    confirmPasswordInput.addEventListener('input', () => {
        validateConfirmPassword();
        updateSubmitButton();
    });

    // blur 이벤트에서도 유효성 검사 실행
    newPasswordInput.addEventListener('blur', () => {
        validateNewPassword();
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        updateSubmitButton();
    });

    confirmPasswordInput.addEventListener('blur', () => {
        validateConfirmPassword();
        updateSubmitButton();
    });
}); 