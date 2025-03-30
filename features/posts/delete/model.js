import { apiClient } from '/lib/api.js';

// API 게시글 삭제
async function deletePostApi(postId) {
    const result = await apiClient(`/posts/${postId}`, {
        method: 'DELETE'
    });
    return result;
}

// 로컬 스토리지 게시글 삭제
async function deletePostLocal(postId) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return {
                success: false,
                error: '로그인이 필요합니다.'
            };
        }

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id == postId);

        if (!post) {
            return {
                success: false,
                error: '게시글을 찾을 수 없습니다.'
            };
        }

        if (post.authorId !== currentUser.id) {
            return {
                success: false,
                error: '자신의 게시글만 삭제할 수 있습니다.'
            };
        }

        const updatedPosts = posts.filter(p => p.id != postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));

        return {
            success: true,
            data: { message: '게시글이 삭제되었습니다.' }
        };

    } catch (error) {
        console.error('Post deletion error:', error);
        return {
            success: false,
            error: '게시글 삭제 중 오류가 발생했습니다.'
        };
    }
}

// 통합 게시글 삭제 함수 - 현재는 로컬 스토리지만 사용
export const postDeleteModel = {
    deletePost: async (postId) => await deletePostApi(postId)
};