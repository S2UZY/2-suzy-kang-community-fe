import { apiClient } from '/lib/api.js';

// API 게시글 작성
async function writePostApi(formData) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const newPost = {
        title: formData.title,
        content: formData.content,
        image: formData.image,
        authorId: currentUser.userId
    }

    const result = await apiClient('/posts', {
        method: 'POST',
        body: JSON.stringify(newPost)
    });

    console.log(result);

    return result;
}

// 로컬 스토리지 게시글 작성
async function writePostLocal(formData) {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            return {
                success: false,
                error: '로그인이 필요합니다.'
            };
        }

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        
        const newPost = {
            id: Date.now().toString(),
            title: formData.title,
            content: formData.content,
            image: formData.image,
            author: currentUser.nickname,
            authorId: currentUser.id,
            createdAt: new Date().toISOString(),
            likes: 0,
            views: 0,
            comments: []
        };

        posts.push(newPost);
        localStorage.setItem('posts', JSON.stringify(posts));

        return {
            success: true,
            data: { post: newPost }
        };

    } catch (error) {
        console.error('Post creation error:', error);
        return {
            success: false,
            error: '게시글 작성 중 오류가 발생했습니다.'
        };
    }
}

// 통합 게시글 작성 함수 - 현재는 로컬 스토리지만 사용
export async function writePost(formData) {
    return await writePostApi(formData);
}