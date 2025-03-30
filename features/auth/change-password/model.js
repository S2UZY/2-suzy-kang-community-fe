import { apiClient } from '/lib/api.js';

// API 비밀번호 변경
async function changePasswordApi(formData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const result = await apiClient('/users/' + currentUser.userId + '/password', {
        method: 'PATCH',
        body: JSON.stringify({
            password: formData.newPassword
        })
    });

    return result;
}

// 로컬 스토리지 비밀번호 변경
async function changePasswordLocal(formData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return {
                success: false,
                error: '로그인이 필요합니다.'
            };
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.id === currentUser.id);

        if (userIndex === -1) {
            return {
                success: false,
                error: '사용자를 찾을 수 없습니다.'
            };
        }

        // 비밀번호 업데이트
        const updatedUser = {
            ...currentUser,
            password: formData.newPassword
        };

        users[userIndex] = updatedUser;
        
        // localStorage 업데이트
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        localStorage.setItem('users', JSON.stringify(users));

        return {
            success: true,
            data: { user: updatedUser }
        };

    } catch (error) {
        console.error('Password change error:', error);
        return {
            success: false,
            error: '비밀번호 변경 중 오류가 발생했습니다.'
        };
    }
}

// 통합 비밀번호 변경 함수 - 현재는 로컬 스토리지만 사용
export async function changePassword(formData) {
    return await changePasswordApi(formData);
}