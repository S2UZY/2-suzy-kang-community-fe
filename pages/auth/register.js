function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return passwordRegex.test(password);
}

function validateNickname(nickname) {
    return nickname.length > 0 && nickname.length <= 10 && !nickname.includes(' ');
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
    if (!email) {
        showError('email-error', '*이메일을 입력해주세요.');
        return false;
    }
    if (!validateEmail(email)) {
        showError('email-error', '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)');
        return false;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        showError('email-error', '*중복된 이메일 입니다.');
        return false;
    }
    clearError('email-error');
    return true;
}

function validatePasswordField() {
    const password = document.getElementById('password').value;
    if (!password) {
        showError('password-error', '*비밀번호를 입력해주세요.');
        return false;
    }
    if (!validatePassword(password)) {
        showError('password-error', '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.');
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
    if (!nickname) {
        showError('nickname-error', '*닉네임을 입력해주세요.');
        return false;
    }
    if (nickname.includes(' ')) {
        showError('nickname-error', '*띄어쓰기를 없애주세요');
        return false;
    }
    if (nickname.length > 10) {
        showError('nickname-error', '*닉네임은 최대 10자 까지 작성 가능합니다.');
        return false;
    }
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.nickname === nickname)) {
        showError('nickname-error', '*중복된 닉네임 입니다.');
        return false;
    }
    clearError('nickname-error');
    return true;
}

function updateRegisterButton() {
    const profileImage = document.getElementById('profile-preview').querySelector('img');
    const isValid = !document.querySelector('.error-message').textContent;
    const allFieldsFilled = ['email', 'password', 'password-confirm', 'nickname']
        .every(id => document.getElementById(id).value)
        && profileImage && profileImage.src;
    
    document.querySelector('.register-button').disabled = !(isValid && allFieldsFilled);
}

// 이벤트 리스너 설정
document.getElementById('profile').addEventListener('change', function() {
    validateProfileImage();
    updateRegisterButton();
});

document.getElementById('email').addEventListener('blur', function() {
    validateEmailField();
    updateRegisterButton();
});

document.getElementById('password').addEventListener('blur', function() {
    validatePasswordField();
    updateRegisterButton();
});

document.getElementById('password-confirm').addEventListener('blur', function() {
    validatePasswordConfirmField();
    updateRegisterButton();
});

document.getElementById('nickname').addEventListener('blur', function() {
    validateNicknameField();
    updateRegisterButton();
});

// input 이벤트에서는 버튼 상태만 업데이트
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', updateRegisterButton);
});

export function handleRegister(event) {
    event.preventDefault();
    
    const isValid = validateProfileImage() &&
        validateEmailField() &&
        validatePasswordField() &&
        validatePasswordConfirmField() &&
        validateNicknameField();
    
    if (!isValid) return;
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const nickname = document.getElementById('nickname').value;
    const profilePreview = document.getElementById('profile-preview').querySelector('img').src;

    // 비밀번호 확인
    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    // 이메일 중복 확인
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        alert('이미 사용 중인 이메일입니다.');
        return;
    }

    // 새 사용자 추가
    const newUser = {
        id: Date.now(),
        email,
        password,
        nickname,
        profile: profilePreview
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('회원가입이 완료되었습니다.');
    window.location.href = '/features/auth/login.html';
}

export function handleProfilePreview(event) {
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
        // 파일 선택을 취소한 경우 항상 이미지를 제거하고 에러 메시지 표시
        preview.innerHTML = `<div id="profile-plus" class="profile-plus">+</div>`;
        showError('profile-error', '*프로필 사진을 추가해주세요.');
    }
    updateRegisterButton();
} 