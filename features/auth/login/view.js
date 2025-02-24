import { loginUser } from '/features/auth/login/model.js';
import { validateEmail, validatePassword } from '/features/auth/utils/validation.js';

export function initLoginPage() {
    setupFormValidation();
    setupLoginSubmit();
}

function setupLoginSubmit() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        const result = await loginUser(formData);
        
        if (result.success) {
            window.location.href = '/pages/posts/list';
        } else {

            const errorElement = document.getElementById('login-error');
            if (errorElement) {
                errorElement.textContent = result.error;
            }
        }
    });
}

function setupFormValidation() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    emailInput.addEventListener('input', updateLoginButtonState);
    passwordInput.addEventListener('input', updateLoginButtonState);
 
    emailInput.addEventListener('blur', () => {
        validateField('email', validateEmail);
        updateLoginButtonState();
    });

    passwordInput.addEventListener('blur', () => {
        validateField('password', validatePassword);
        updateLoginButtonState();
    });
}

function updateLoginButtonState() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const loginButton = document.getElementById('login-button');
    
    const emailValid = !document.getElementById('email-error').textContent;
    const passwordValid = !document.getElementById('password-error').textContent;
    
    const isValid = emailValid && passwordValid && email.value && password.value;
    loginButton.classList.toggle('active', isValid);
    loginButton.disabled = !isValid;
}

function validateField(fieldName, validationFn) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const errorMessage = validationFn(field.value);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
}


