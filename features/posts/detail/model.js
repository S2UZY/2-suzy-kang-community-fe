import { apiClient } from '/lib/api.js';

// API 게시글 상세 조회
async function getPostDetailApi(postId) {
    const result = await apiClient(`/posts/${postId}`, {
        method: 'GET'
    });

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    console.log(result);
    if (result.success) {
        return {
            success: true,
            data: {
                ...result.data,
                authorProfile: result.data.profile,
                isAuthor: currentUser && currentUser.userId === result.data.authorId,
                isLiked: result.data.likedBy?.includes(currentUser?.userId),
                commentLength: result.data.comments?.length || 0,
                author: result.data.nickname,
                createdAt: result.data.date
            }
        };
    } 

    return result;
}

async function toggleLikeApi(postId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const result = await apiClient(`/posts/${postId}/likes?userId=${currentUser.userId}`, {
        method: 'POST',
    });
    return result;
}

async function getPostDetailLocal(postId) {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const post = posts.find(p => p.id == postId);

        if (!post) {
            return {
                success: false,
                error: '존재하지 않는 게시글입니다.'
            };
        }

        post.views = (post.views || 0) + 1;
        localStorage.setItem('posts', JSON.stringify(posts));

        const author = users.find(user => user.id === post.authorId);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        return {
            success: true,
            data: {
                ...post,
                authorProfile: author.profile,
                isAuthor: currentUser && currentUser.id === post.authorId,
                isLiked: post.likedBy?.includes(currentUser?.id)
            }
        };
    } catch (error) {
        return {
            success: false,
            error: '게시글을 불러오는 중 오류가 발생했습니다.'
        };
    }
}

async function toggleLikeLocal(postId) {
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

        if (!post.likedBy) post.likedBy = [];
        const isLiked = post.likedBy.includes(currentUser.id);

        if (isLiked) {
            post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
            post.likes = (post.likes || 1) - 1;
        } else {
            post.likedBy.push(currentUser.id);
            post.likes = (post.likes || 0) + 1;
        }

        localStorage.setItem('posts', JSON.stringify(posts));

        return {
            success: true,
            data: { 
                isLiked: !isLiked,
                likes: post.likes
            }
        };
    } catch (error) {
        return {
            success: false,
            error: '좋아요 처리 중 오류가 발생했습니다.'
        };
    }
}

export const postDetailModel = {
    getPostDetail: async (postId) => await getPostDetailApi(postId),
    toggleLike: async (postId) => await toggleLikeApi(postId)
};