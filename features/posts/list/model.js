import { apiClient } from '/lib/api.js';

// API 게시글 목록 조회
async function getPostsApi() {
    const result = await apiClient('/posts', {
        method: 'GET'
    });

    console.log(result);

    const posts = result.data.map(post => ({
        ...post,
        author: post.nickname,
        authorProfile: post.profile,
        createdAt: post.date
    }));

    return {
        success: result.success,
        data: posts
    };
}

// 로컬 스토리지 게시글 목록 조회
async function getPostsLocal() {
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const postsWithAuthor = sortedPosts.map(post => {
            const author = users.find(user => user.id === post.authorId);
            return {
                ...post,
                authorProfile: author.profile ,
                commentLength: post.comments.length
            };
        });

        return {
            success: true,
            data:  postsWithAuthor
        };

    } catch (error) {
        console.error('Posts loading error:', error);
        return {
            success: false,
            error: '게시글 목록을 불러오는 중 오류가 발생했습니다.'
        };
    }
}

// 통합 게시글 목록 조회 함수 - 현재는 로컬 스토리지만 사용
export async function getPosts() {
    return await getPostsApi();
}