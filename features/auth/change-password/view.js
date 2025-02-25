import { changePassword } from '/features/auth/change-password/model.js';
import { validatePassword } from '/features/auth/utils/validation.js';
import { showToast } from '/components/toast.js';

export function initChangePasswordPage() {
    setupFormValidation();
    setupPasswordChangeSubmit();
}

function setupPasswordChangeSubmit() {
    const passwordForm = document.getElementById('password-form');
    
    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            newPassword: document.getElementById('new-password').value,
            confirmPassword: document.getElementById('confirm-password').value
        };

        const result = await changePassword(formData);
        
        if (result.success) {
            showToast('비밀번호가 변경되었습니다.');
        } else {
            const errorElement = document.getElementById('password-error');
            if (errorElement) {
                errorElement.textContent = result.error;
            }
        }
    });
}

function setupFormValidation() {
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    newPasswordInput.addEventListener('input', updateSubmitButtonState);
    confirmPasswordInput.addEventListener('input', updateSubmitButtonState);
 
    newPasswordInput.addEventListener('blur', () => {
        validateField('new-password', validatePassword);
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
        updateSubmitButtonState();
    });

    confirmPasswordInput.addEventListener('blur', () => {
        validateConfirmPassword();
        updateSubmitButtonState();
    });
}

function updateSubmitButtonState() {
    const newPassword = document.getElementById('new-password');
    const confirmPassword = document.getElementById('confirm-password');
    const submitButton = document.querySelector('.submit-button');
    
    const newPasswordValid = !document.getElementById('new-password-error').textContent;
    const confirmPasswordValid = !document.getElementById('confirm-password-error').textContent;
    
    const isValid = newPasswordValid && confirmPasswordValid && 
                   newPassword.value && confirmPassword.value;
    
    submitButton.disabled = !isValid;
}

function validateField(fieldName, validationFn) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const errorMessage = validationFn(field.value);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
}

function validateConfirmPassword() {
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorElement = document.getElementById('confirm-password-error');

    if (!confirmPassword) {
        errorElement.textContent = '*비밀번호를 한번 더 입력해주세요.';
        return false;
    }
    if (newPassword !== confirmPassword) {
        errorElement.textContent = '*비밀번호가 일치하지 않습니다.';
        return false;
    }
    errorElement.textContent = '';
    return true;
}