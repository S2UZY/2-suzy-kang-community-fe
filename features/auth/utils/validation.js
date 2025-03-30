export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
        return '*이메일을 입력해주세요.';
    }
    if (!emailRegex.test(email)) {
        return '*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)';
    }
    return '';
}

export function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!password) {
        return '*비밀번호를 입력해주세요.';
    }
    if (!passwordRegex.test(password)) {
        return '*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.';
    }
    return '';
}

export function validateNickname(nickname) {
    if (!nickname) {
        return '*닉네임을 입력해주세요.';
    }
    if (nickname.includes(' ')) {
        return '*띄어쓰기를 없애주세요';
    }
    if (nickname.length > 10) {
        return '*닉네임은 최대 10자 까지 작성 가능합니다.';
    }
    return '';
}

export function validateProfileImageSize(file) {
    const maxSizeInBytes = 1 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        return '*프로필 사진은 1MB 이하로 업로드해주세요.';
    }
    return '';
} 