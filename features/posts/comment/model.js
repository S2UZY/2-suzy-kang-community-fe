import { apiClient } from '/lib/api.js';

// API 댓글 작성
async function createCommentApi(postId, content) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const result = await apiClient(`/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, userId: currentUser.userId })
    });
    return result;
}

// API 댓글 목록 조회
async function getCommentsApi(postId) {
    const result = await apiClient(`/posts/${postId}/comments`, {
        method: 'GET'
    });
    
    return result;
}

// API 댓글 수정
async function updateCommentApi(postId, commentId, content) {
    const result = await apiClient(`/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content })
    });
    return result;
}

// API 댓글 삭제
async function deleteCommentApi(postId, commentId) {
    const result = await apiClient(`/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE'
    });
    return result;
}

// 로컬 스토리지 댓글 작성
async function createCommentLocal(postId, content) {
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

        if (postIndex === -1) {
            return {
                success: false,
                error: '게시글을 찾을 수 없습니다.'
            };
        }

        const now = new Date();
        const formattedDate = now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/\. /g, '-').replace('.', '');

        const newComment = {
            id: Date.now().toString(),
            authorId: currentUser.id,
            content,
            date: formattedDate
        };

        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }

        posts[postIndex].comments.unshift(newComment);
        localStorage.setItem('posts', JSON.stringify(posts));

        return {
            success: true,
            data: { 
                comment: newComment,
                post: posts[postIndex]
            }
        };
    } catch (error) {
        console.error('Comment creation error:', error);
        if (error.name === 'QuotaExceededError') {
            try {
                const posts = JSON.parse(localStorage.getItem('posts') || '[]');
                posts.forEach(post => {
                    if (post.comments && post.comments.length > 10) {
                        post.comments = post.comments.slice(0, 10);
                    }
                });
                localStorage.setItem('posts', JSON.stringify(posts));
                return {
                    success: false,
                    error: '저장 공간이 부족합니다. 이전 댓글을 정리했습니다. 다시 시도해주세요.'
                };
            } catch (cleanupError) {
                return {
                    success: false,
                    error: '저장 공간이 부족합니다.'
                };
            }
        }
        
        return {
            success: false,
            error: '댓글 작성 중 오류가 발생했습니다.'
        };
    }
}

async function updateCommentLocal(postId, commentId, content) {
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
        
        if (postIndex === -1) {
            return {
                success: false,
                error: '게시글을 찾을 수 없습니다.'
            };
        }
        
        const commentIndex = posts[postIndex].comments.findIndex(c => c.id === commentId);
        if (commentIndex === -1) {
            return {
                success: false,
                error: '댓글을 찾을 수 없습니다.'
            };
        }
        
        const comment = posts[postIndex].comments[commentIndex];
        if (comment.authorId !== currentUser.id) {
            return {
                success: false,
                error: '자신의 댓글만 수정할 수 있습니다.'
            };
        }
        
        posts[postIndex].comments[commentIndex].content = content;
        posts[postIndex].comments[commentIndex].edited = true;
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        return {
            success: true,
            data: { 
                comment: posts[postIndex].comments[commentIndex],
                post: posts[postIndex]
            }
        };
    } catch (error) {
        console.error('Comment update error:', error);
        return {
            success: false,
            error: '댓글 수정 중 오류가 발생했습니다.'
        };
    }
}
    
async function deleteCommentLocal(postId, commentId) {
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
        
        if (postIndex === -1) {
            return {
                success: false,
                error: '게시글을 찾을 수 없습니다.'
            };
        }
        
        const comment = posts[postIndex].comments.find(c => c.id === commentId);
        if (!comment) {
            return {
                success: false,
                error: '댓글을 찾을 수 없습니다.'
            };
        }
        
        if (comment.authorId !== currentUser.id) {
            return {
                success: false,
                error: '자신의 댓글만 삭제할 수 있습니다.'
            };
        }
        
        posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        return {
            success: true,
            data: { post: posts[postIndex] }
        };
    } catch (error) {
        console.error('Comment deletion error:', error);
        return {
            success: false,
            error: '댓글 삭제 중 오류가 발생했습니다.'
        };
    }
}

export const commentModel = {
    createComment: async (postId, content) => await createCommentApi(postId, content),
    getComments: async (postId) => await getCommentsApi(postId),
    updateComment: async (postId, commentId, content) => await updateCommentApi(postId, commentId, content),
    deleteComment: async (postId, commentId) => await deleteCommentApi(postId, commentId),
};