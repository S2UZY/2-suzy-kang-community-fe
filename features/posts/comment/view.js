import { commentModel } from './model.js';
import { showToast } from '/components/toast.js';
import { showModal } from '/components/modal.js';

let currentEditingCommentId = null;
let originalFormSubmitHandler = null;

export function initCommentFeature() {
    setupCommentForm();
    
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const post = posts.find(p => p.id == postId);
        if (post) {
            reloadComments(postId, post);
        }
    }
    
    window.editComment = editComment;
    window.deleteComment = deleteComment;
}

function setupCommentForm() {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const textarea = commentForm.querySelector('textarea');
    const submitButton = commentForm.querySelector('button[type="submit"]');
    
    textarea.addEventListener('input', () => {
        updateCommentButton(textarea, submitButton);
    });
    
    originalFormSubmitHandler = async (e) => {
        e.preventDefault();
        
        const content = textarea.value.trim();
        if (!content) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        
        if (currentEditingCommentId) {
            const result = await commentModel.updateComment(postId, currentEditingCommentId, content);
            if (result.success) {
                resetCommentForm();
                reloadComments(postId, result.data.post);
                showToast('댓글이 수정되었습니다.');
            } else {
                showToast(result.error);
            }
        } else {
            const result = await commentModel.createComment(postId, content);
            if (result.success) {
                resetCommentForm();
                reloadComments(postId, result.data.post);
                updateStats(result.data.post);
                showToast('댓글이 등록되었습니다.');
            } else {
                showToast(result.error);
            }
        }
    };
    
    commentForm.addEventListener('submit', originalFormSubmitHandler);
    updateCommentButton(textarea, submitButton);
}

function updateCommentButton(textarea, submitButton) {
    if (textarea.value.trim()) {
        submitButton.disabled = false;
        submitButton.style.background = '#7F6AEE';
    } else {
        submitButton.disabled = true;
        submitButton.style.background = '#ACA0EB';
    }
}

function reloadComments(postId, post) {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    commentsList.innerHTML = '';
    
    if (post.comments && post.comments.length > 0) {
        post.comments.forEach(comment => {
            const commentAuthor = users.find(user => user.id === comment.authorId);
            const isCommentAuthor = currentUser && currentUser.id === comment.authorId;
            
            // 기본 프로필 이미지 URL
            const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNEOUQ5RDkiLz48cGF0aCBkPSJNMTIgMTJDMTQuNDg1MyAxMiAxNi41IDkuOTg1MjggMTYuNSA3LjVDMTYuNSA1LjAxNDcyIDE0LjQ4NTMgMyAxMiAzQzkuNTE0NzIgMyA3LjUgNS4wMTQ3MiA3LjUgNy41QzcuNSA5Ljk4NTI4IDkuNTE0NzIgMTIgMTIgMTJaIiBmaWxsPSIjOTA5MDkwIi8+PHBhdGggZD0iTTE4LjUgMjFDMTguNSAyMS41NTIzIDE4LjA1MjMgMjIgMTcuNSAyMkg2LjVDNS45NDc3MiAyMiA1LjUgMjEuNTUyMyA1LjUgMjFDNS41IDE3LjY4NjMgOC4xODYyOSAxNSAxMS41IDE1SDEyLjVDMTUuODEzNyAxNSAxOC41IDE3LjY4NjMgMTguNSAyMVoiIGZpbGw9IiM5MDkwOTAiLz48L3N2Zz4=";
            
            commentsList.innerHTML += `
                <div class="comment-item" data-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-author-info">
                            <div class="author-info">
                                <img src="${commentAuthor?.profile || defaultProfileImage}" 
                                 alt="작성자 프로필" 
                                 class="author-image">
                                <span class="comment-author">${commentAuthor?.nickname || "알 수 없음"}</span>
                            </div>
                            <span class="comment-date">${comment.date}</span>
                        </div>
                        ${isCommentAuthor ? `
                            <div class="comment-actions">
                                <button onclick="editComment('${comment.id}')">수정</button>
                                <button onclick="deleteComment('${comment.id}')">삭제</button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `;
        });
    }
}

function resetCommentForm() {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const textarea = commentForm.querySelector('textarea');
    const submitButton = commentForm.querySelector('button[type="submit"]');
    
    currentEditingCommentId = null;
    commentForm.reset();
    submitButton.textContent = '댓글 등록';
    
    updateCommentButton(textarea, submitButton);
}

function updateStats(post) {
    const likeCount = document.getElementById('like-count');
    const viewCount = document.getElementById('view-count');
    const commentCount = document.getElementById('comment-count');
    
    if (likeCount) likeCount.textContent = formatNumber(post.likes || 0);
    if (viewCount) viewCount.textContent = formatNumber(post.views || 0);
    if (commentCount) commentCount.textContent = formatNumber(post.comments?.length || 0);
}

function formatNumber(num) {
    if (num >= 100000) return Math.floor(num/1000) + 'k';
    if (num >= 10000) return Math.floor(num/1000) + 'k';
    if (num >= 1000) return Math.floor(num/1000) + 'k';
    return num;
}

async function editComment(commentId) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id == postId);
    
    if (!post || !post.comments) return;
    
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const textarea = commentForm.querySelector('textarea');
    const submitButton = commentForm.querySelector('button[type="submit"]');
    
    textarea.value = comment.content;
    submitButton.textContent = '댓글 수정';
    textarea.focus();
    
    currentEditingCommentId = commentId;
    updateCommentButton(textarea, submitButton);
}

async function deleteComment(commentId) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    showModal({
        title: '삭제하시겠습니까?',
        content: '삭제한 댓글은 복구할 수 없습니다.',
        onConfirm: async () => {
            const result = await commentModel.deleteComment(postId, commentId);
            if (result.success) {
                reloadComments(postId, result.data.post);
                updateStats(result.data.post);
                showToast('댓글이 삭제되었습니다.');
            } else {
                showToast(result.error);
            }
        }
    });
}