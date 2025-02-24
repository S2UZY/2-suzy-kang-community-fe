import { apiClient } from '/lib/api.js';

// API 프로필 수정
async function updateProfileApi(formData) {
    const result = await apiClient('/api/users/' + formData.id, {
        method: 'PATCH', 
        body: JSON.stringify(formData)
    });

    if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.data));
    }

    return result;
}

// 로컬 스토리지 프로필 수정
async function updateProfileLocal(formData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const isDuplicate = users.some(user => 
            user.nickname === formData.nickname && user.id !== currentUser.id
        );

        if (isDuplicate) {
            return {
                success: false,
                error: '이미 사용 중인 닉네임입니다.'
            };
        }

        const updatedUser = {
            ...currentUser,
            ...formData
        };

        const userIndex = users.findIndex(user => user.id === currentUser.id);
        users[userIndex] = updatedUser;

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        localStorage.setItem('users', JSON.stringify(users));

        return {
            success: true,
            data: { user: updatedUser }
        };

    } catch (error) {
        return {
            success: false,
            error: '프로필 수정 중 오류가 발생했습니다.'
        };
    }
}

// 통합 프로필 수정 함수 - 현재는 로컬 스토리지만 사용
export async function updateProfile(formData) {
    return await updateProfileLocal(formData);
}