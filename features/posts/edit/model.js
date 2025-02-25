import { apiClient } from '/lib/api.js';

// API 게시글 수정
async function editPostApi(postId, formData) {
    const result = await apiClient(`/api/posts/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
    });
    return result;
}

// 로컬 스토리지 게시글 수정
async function editPostLocal(postId, formData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return {
                success: false,
                error: '로그인이 필요합니다.'
            };
        }

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id == postId);
        const post = posts[postIndex];

        if (!post) {
            return {
                success: false,
                error: '게시글을 찾을 수 없습니다.'
            };
        }

        if (post.authorId !== currentUser.id) {
            return {
                success: false,
                error: '자신의 게시글만 수정할 수 있습니다.'
            };
        }

        // 게시글 업데이트
        posts[postIndex] = {
            ...post,
            ...formData,
            lastModified: new Date().toISOString()
        };

        localStorage.setItem('posts', JSON.stringify(posts));

        return {
            success: true,
            data: { post: posts[postIndex] }
        };

    } catch (error) {
        console.error('Post edit error:', error);
        return {
            success: false,
            error: '게시글 수정 중 오류가 발생했습니다.'
        };
    }
}

// 게시글 조회
async function getPostLocal(postId) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id == postId);

        if (!post) {
            return {
                success: false,
                error: '존재하지 않는 게시글입니다.'
            };
        }

        return {
            success: true,
            data: { post }
        };

    } catch (error) {
        return {
            success: false,
            error: '게시글을 불러오는 중 오류가 발생했습니다.'
        };
    }
}

export const postEditModel = {
    editPost: async (postId, formData) => await editPostLocal(postId, formData),
    getPost: async (postId) => await getPostLocal(postId)
};