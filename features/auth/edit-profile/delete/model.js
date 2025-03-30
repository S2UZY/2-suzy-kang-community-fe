import { apiClient } from '/lib/api.js';

// API 계정 삭제
async function deleteAccountApi() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const result = await apiClient('/users/' + currentUser.userId, {
        method: 'DELETE'
    });

    if (result.success) {
        localStorage.removeItem('currentUser');
    }

    return result;
}

// 로컬 스토리지 계정 삭제
async function deleteAccountLocal() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const updatedUsers = users.filter(user => user.id !== currentUser.id);
        
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const updatedPosts = posts.filter(post => post.userId !== currentUser.id);
        
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        const updatedComments = comments.filter(comment => comment.userId !== currentUser.id);

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        localStorage.setItem('comments', JSON.stringify(updatedComments));
        localStorage.removeItem('currentUser');

        return {
            success: true,
            message: 'user_delete_success'
        };

    } catch (error) {
        return {
            success: false,
            error: 'user_delete_success'
        };
    }
}

// 통합 계정 삭제 함수 - 현재는 로컬 스토리지만 사용
export async function deleteAccount() {
    return await deleteAccountApi();
}