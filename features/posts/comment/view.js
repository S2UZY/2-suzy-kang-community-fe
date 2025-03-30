import { commentModel } from './model.js';
import { showToast } from '/components/toast.js';
import { showModal } from '/components/modal.js';

let currentEditingCommentId = null;
let originalFormSubmitHandler = null;

export function initCommentFeature() {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) return;
    
    loadComments(postId);
    initCommentForm(postId);
    setupCommentActions(postId);
}

function setupCommentActions(postId) {
    const commentListElement = document.getElementById('comment-list');
    if (!commentListElement) return;
    
    commentListElement.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.classList.contains('edit-comment-btn')) {
            const commentItem = target.closest('.comment-item');
            if (commentItem) {
                const commentId = commentItem.dataset.id;
                const contentElement = commentItem.querySelector('.comment-content');
                if (contentElement) {
                    editComment(commentId, contentElement.textContent);
                }
            }
        }
        
        if (target.classList.contains('delete-comment-btn')) {
            const commentItem = target.closest('.comment-item');
            if (commentItem) {
                const commentId = commentItem.dataset.id;
                deleteComment(postId, commentId);
            }
        }
    });
}

function initComments() {
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) return;
    
    loadComments(postId);
    initCommentForm(postId);
    setupCommentActions(postId);
}

async function loadComments(postId) {
    try {
        const result = await commentModel.getComments(postId);
        if (result.success) {
            renderComments(result.data);
        } else {
            console.error('댓글 목록 조회 실패:', result.message);
        }
    } catch (error) {
        console.error('댓글 목록 조회 중 오류 발생:', error);
    }
}

function renderComments(comments) {
    const commentListElement = document.getElementById('comment-list');
    if (!commentListElement) return;
    
    commentListElement.innerHTML = '';
    
    if (!comments || comments.length === 0) {
        commentListElement.innerHTML = '<p class="no-comments">댓글이 없습니다.</p>';
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment-item';
        commentElement.dataset.id = comment.id;
        
        const isCommentAuthor = currentUser && currentUser.userId === comment.authorId;
        
        commentElement.innerHTML = `
            <div class="comment-header">
                <div class="comment-author-info">
                    <img src="${comment.profile}" alt="프로필" class="author-image">
                    <span class="comment-author">${comment.nickname}</span>
                </div>
                <div class="comment-date">${comment.date}</div>
                ${isCommentAuthor ? 
                    '<div class="comment-actions">' +
                    '<button class="edit-comment-btn">수정</button>' +
                    '<button class="delete-comment-btn">삭제</button>' +
                    '</div>' : ''}
            </div>
            <div class="comment-content">${comment.content}</div>
        `;
        
        commentListElement.appendChild(commentElement);
    });
    
    updateCommentCount(comments.length);
}

function updateCommentCount(count) {
    const commentCountElement = document.getElementById('comment-count');
    if (commentCountElement) {
        commentCountElement.textContent = count;
    }
}

function initCommentForm(postId) {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const commentInput = commentForm.querySelector('textarea');
    let submitButton = commentForm.querySelector('button[type="submit"]');
    
    let buttonContainer = commentForm.querySelector('.comment-form-buttons');
    if (!buttonContainer) {
        buttonContainer = document.createElement('div');
        buttonContainer.className = 'comment-form-buttons';
        
        const originalButton = submitButton.cloneNode(true);
        submitButton.remove();
        buttonContainer.appendChild(originalButton);
        commentForm.appendChild(buttonContainer);
        
        submitButton = originalButton;
    }
    
    commentForm.removeEventListener('submit', originalFormSubmitHandler);
    
    originalFormSubmitHandler = async (e) => {
        e.preventDefault();
        
        const content = commentInput.value.trim();
        if (!content) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }
        
        try {
            let result;
            
            if (currentEditingCommentId) {
                result = await commentModel.updateComment(postId, currentEditingCommentId, content);
                if (result.success) {
                    resetCommentForm();
                    showToast('댓글이 수정되었습니다.');
                } else {
                    showToast(result.error || '댓글 수정에 실패했습니다.');
                }
            } else {
                result = await commentModel.createComment(postId, content);
                if (result.success) {
                    commentInput.value = '';
                    showToast('댓글이 등록되었습니다.');
                } else {
                    showToast(result.error || '댓글 작성에 실패했습니다.');
                }
            }
            
            loadComments(postId);
            
        } catch (error) {
            console.error('댓글 작성/수정 중 오류 발생:', error);
            showToast('댓글 작성/수정 중 오류가 발생했습니다.');
        }
    };
    
    commentForm.addEventListener('submit', originalFormSubmitHandler);
}

function editComment(commentId, content) {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const commentInput = commentForm.querySelector('textarea');
    const submitButton = commentForm.querySelector('button[type="submit"]');
    
    commentInput.value = content;
    submitButton.textContent = '수정';
    commentInput.focus();
    
    currentEditingCommentId = commentId;
}

function deleteComment(postId, commentId) {
    showModal({
        title: '삭제하시겠습니까?',
        content: '삭제한 댓글은 복구할 수 없습니다.',
        onConfirm: async () => {
            const result = await commentModel.deleteComment(postId, commentId);
            if (result.success) {
                loadComments(postId);
                showToast('댓글이 삭제되었습니다.');
            } else {
                showToast(result.error || '댓글 삭제에 실패했습니다.');
            }
        }
    });
}

function resetCommentForm() {
    const commentForm = document.getElementById('comment-form');
    if (!commentForm) return;
    
    const commentInput = commentForm.querySelector('textarea');
    const submitButton = commentForm.querySelector('button[type="submit"]');
    
    commentInput.value = '';
    submitButton.textContent = '댓글 작성';
    
    currentEditingCommentId = null;
}

export { initComments, loadComments };