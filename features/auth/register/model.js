import { apiClient } from '/lib/api.js';

// API 회원가입
async function registerUserApi(formData) {
    const result = await apiClient('/api/users', {
        method: 'POST',
        body: JSON.stringify(formData)
    });

    if (result.success) {
        return result;
    }

    return result;
}

// 로컬 스토리지 회원가입
async function registerUserLocal(formData) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (users.some(user => user.email === formData.email)) {
            return {
                success: false,
                error: '이미 사용 중인 이메일입니다.'
            };
        }

        if (users.some(user => user.nickname === formData.nickname)) {
            return {
                success: false,
                error: '이미 사용 중인 닉네임입니다.'
            };
        }

        const newUser = {
            id: Date.now().toString(),
            email: formData.email,
            password: formData.password,
            nickname: formData.nickname,
            profile: formData.profile,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const { id } = newUser;
        return {
            success: true,
            data: { user_id: id }
        };

    } catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: '회원가입 처리 중 오류가 발생했습니다.'
        };
    }
}

// 통합 회원가입 함수 - 현재는 로컬 스토리지 회원가입만 사용
export async function registerUser(formData) {
    return await registerUserLocal(formData);
}
