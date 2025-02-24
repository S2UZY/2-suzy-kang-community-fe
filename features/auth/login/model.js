import { apiClient } from '/lib/api.js';

// API 로그인
async function loginUserApi(formData) {
    const result = await apiClient('/api/login', {
        method: 'POST',
        body: JSON.stringify(formData)
    });

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.data.user));
    }

    return result;
} 

// 로컬 스토리지 로그인
async function loginUserLocal(formData) {
    const { email, password } = formData;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', user.id);
        return { 
            success: true, 
            data: { user_id: user.id } 
        };
    }

    return { 
        success: false, 
        error: '아이디 또는 비밀번호를 확인해주세요.' 
    };
}

// 통합 로그인 함수 - 현재는 로컬 스토리지 로그인만 사용
export async function loginUser(formData) {
    return await loginUserLocal(formData)
}