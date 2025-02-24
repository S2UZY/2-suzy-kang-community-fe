function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return '이메일을 입력해주세요.';
    }
    if (!emailRegex.test(email)) {
        return '올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    }
    return '';
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!password) {
        return '비밀번호를 입력해주세요.';
    }
    if (!passwordRegex.test(password)) {
        return '비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    return '';
}

function validateField(field, validationFn) {
    const errorElement = document.getElementById(`${field}Error`);
    const input = document.getElementById(field);
    const error = validationFn(input.value);
    
    errorElement.textContent = error;
    return !error;
}

function updateLoginButtonState() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    
    const emailValid = !document.getElementById('emailError').textContent;
    const passwordValid = !document.getElementById('passwordError').textContent;
    
    if (emailValid && passwordValid && email.value && password.value) {
        loginButton.style.background = '#7F6AEE';
        loginButton.disabled = false;
    } else {
        loginButton.style.background = '#ACA0EB';
        loginButton.disabled = true;
    }
}

export function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    
    document.getElementById('emailError').textContent = emailError;
    document.getElementById('passwordError').textContent = passwordError;
    
    if (emailError || passwordError) {
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = '/features/posts/list.html';
    } else {
        document.getElementById('passwordError').textContent = '아이디 또는 비밀번호를 확인해주세요.';
    }
}

// 이벤트 리스너 설정
document.getElementById('email').addEventListener('blur', function() {
    validateField('email', validateEmail);
    updateLoginButtonState();
});

document.getElementById('password').addEventListener('blur', function() {
    validateField('password', validatePassword);
    updateLoginButtonState();
});

// input 이벤트에서는 버튼 상태만 업데이트
document.getElementById('email').addEventListener('input', updateLoginButtonState);
document.getElementById('password').addEventListener('input', updateLoginButtonState); 