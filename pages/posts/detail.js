import { showModal } from '/components/modal.js';

export function loadPostDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const post = posts.find(p => p.id == postId);

    if (!post) {
        alert('존재하지 않는 게시글입니다.');
        window.location.href = '/features/posts/list.html';
        return;
    }

    const author = users.find(user => user.id === post.authorId);
    
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = author?.nickname || post.author;
    
    const authorImage = document.getElementById('post-author-image');
    if (author && author.profile) {
        authorImage.src = author.profile;
    } else {
        authorImage.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNEOUQ5RDkiLz48cGF0aCBkPSJNMTIgMTJDMTQuNDg1MyAxMiAxNi41IDkuOTg1MjggMTYuNSA3LjVDMTYuNSA1LjAxNDcyIDE0LjQ4NTMgMyAxMiAzQzkuNTE0NzIgMyA3LjUgNS4wMTQ3MiA3LjUgNy41QzcuNSA5Ljk4NTI4IDkuNTE0NzIgMTIgMTIgMTJaIiBmaWxsPSIjOTA5MDkwIi8+PHBhdGggZD0iTTE4LjUgMjFDMTguNSAyMS41NTIzIDE4LjA1MjMgMjIgMTcuNSAyMkg2LjVDNS45NDc3MiAyMiA1LjUgMjEuNTUyMyA1LjUgMjFDNS41IDE3LjY4NjMgOC4xODYyOSAxNSAxMS41IDE1SDEyLjVDMTUuODEzNyAxNSAxOC41IDE3LjY4NjMgMTguNSAyMVoiIGZpbGw9IiM5MDkwOTAiLz48L3N2Zz4=";
    }

    post.views = (post.views || 0) + 1;
    localStorage.setItem('posts', JSON.stringify(posts));

    const date = new Date(post.date);
    const formattedDate = date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace(/\. /g, '-')
     .replace('.', '')
     .replace(/: /g, ':');
    
    document.getElementById('post-date').textContent = formattedDate;

    document.getElementById('post-content').textContent = post.content;
    updateStats(post);

    if (post.image) {
        document.getElementById('post-image').innerHTML = `
            <img src="${post.image}" alt="게시글 이미지">
        `;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isAuthor = currentUser && currentUser.id === post.authorId;

    const actionButtons = document.querySelector('.post-actions');
    actionButtons.style.display = isAuthor ? 'flex' : 'none';

    const likeButton = document.querySelector('.like-button');
    if (post.likedBy && post.likedBy.includes(currentUser?.id)) {
        likeButton.classList.add('active');
        likeButton.style.background = '#ACA0EB';
    }

    loadComments(postId);
}

function loadComments(postId) {
    const commentsList = document.getElementById('comments-list');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const post = posts.find(p => p.id == postId);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    commentsList.innerHTML = '';
    
    if (post.comments) {
        post.comments.forEach(comment => {
            const commentAuthor = users.find(user => user.id === comment.authorId);
            const isCommentAuthor = currentUser && currentUser.id === comment.authorId;
            
            commentsList.innerHTML += `
                <div class="comment-item" data-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-author-info">
                        <div class="author-info">
                            <img src="${commentAuthor?.profile || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNEOUQ5RDkiLz48cGF0aCBkPSJNMTIgMTJDMTQuNDg1MyAxMiAxNi41IDkuOTg1MjggMTYuNSA3LjVDMTYuNSA1LjAxNDcyIDE0LjQ4NTMgMyAxMiAzQzkuNTE0NzIgMyA3LjUgNS4wMTQ3MiA3LjUgNy41QzcuNSA5Ljk4NTI4IDkuNTE0NzIgMTIgMTIgMTJaIiBmaWxsPSIjOTA5MDkwIi8+PHBhdGggZD0iTTE4LjUgMjFDMTguNSAyMS41NTIzIDE4LjA1MjMgMjIgMTcuNSAyMkg2LjVDNS45NDc3MiAyMiA1LjUgMjEuNTUyMyA1LjUgMjFDNS41IDE3LjY4NjMgOC4xODYyOSAxNSAxMS41IDE1SDEyLjVDMTUuODEzNyAxNSAxOC41IDE3LjY4NjMgMTguNSAyMVoiIGZpbGw9IiM5MDkwOTAiLz48L3N2Zz4="}" 
                                 alt="작성자 프로필" 
                                 class="author-image">
                            <span class="comment-author">${commentAuthor?.nickname || comment.author}</span>
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

export function handleComment(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const content = event.target.querySelector('textarea').value;
    if (!content.trim()) {
        alert('댓글 내용을 입력해주세요.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    try {
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id == postId);
        
        if (postIndex === -1) return;

        const now = new Date();
        const formattedDate = now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(/\. /g, '-').replace('.', '');

        // 새 댓글 생성 (최소한의 정보만 저장)
        const newComment = {
            id: Date.now().toString(),
            authorId: currentUser.id,
            content,
            date: formattedDate
        };

        // 댓글 배열 초기화 및 추가
        if (!posts[postIndex].comments) {
            posts[postIndex].comments = [];
        }

        // 댓글이 20개 이상이면 가장 오래된 댓글 삭제
        if (posts[postIndex].comments.length >= 20) {
            posts[postIndex].comments.pop();
        }

        posts[postIndex].comments.unshift(newComment);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // UI 업데이트
        loadComments(postId);
        updateStats(posts[postIndex]);
        event.target.reset();
        updateCommentButton();

    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            alert('저장 공간이 부족합니다. 이전 댓글을 정리한 후 다시 시도해주세요.');
            // 오래된 댓글 정리
            const posts = JSON.parse(localStorage.getItem('posts') || '[]');
            posts.forEach(post => {
                if (post.comments && post.comments.length > 10) {
                    post.comments = post.comments.slice(0, 10);
                }
            });
            localStorage.setItem('posts', JSON.stringify(posts));
        } else {
            console.error('댓글 저장 중 오류 발생:', error);
            alert('댓글 저장에 실패했습니다.');
        }
    }
}

export function handleLike() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id == postId);
    
    if (postIndex === -1) return;

    const post = posts[postIndex];
    if (!post.likedBy) post.likedBy = [];

    const likeButton = document.querySelector('.like-button');
    const isLiked = post.likedBy.includes(currentUser.id);

    if (isLiked) {
        // 좋아요 취소
        post.likedBy = post.likedBy.filter(id => id !== currentUser.id);
        post.likes = (post.likes || 1) - 1;
        likeButton.classList.remove('active');
        likeButton.style.background = '#D9D9D9';
    } else {
        // 좋아요 추가
        post.likedBy.push(currentUser.id);
        post.likes = (post.likes || 0) + 1;
        likeButton.classList.add('active');
        likeButton.style.background = '#ACA0EB';
    }

    localStorage.setItem('posts', JSON.stringify(posts));
    updateStats(post);
}

function handleEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id == postId);

    if (post.authorId !== currentUser.id) {
        alert('자신의 게시글만 수정할 수 있습니다.');
        return;
    }

    window.location.href = `/features/posts/edit.html?id=${postId}`;
}

function handleDelete() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id == postId);

    if (post.authorId !== currentUser.id) {
        alert('자신의 게시글만 삭제할 수 있습니다.');
        return;
    }

    showDeleteModal(() => {
        const updatedPosts = posts.filter(p => p.id != postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        window.location.href = '/features/posts/list.html';
    });
}

function showDeleteModal(onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-title">삭제하시겠습니까?</div>
            <div class="modal-content">삭제한 내용은 복구할 수 없습니다.</div>
            <div class="modal-buttons">
                <button class="modal-cancel">취소</button>
                <button id="post-delete-button" class="modal-confirm">확인</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    modal.querySelector('.modal-cancel').onclick = () => {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.modal-confirm').onclick = () => {
        onConfirm();
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    };
}

window.editComment = function(commentId) {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id == postId);
    const comment = post.comments.find(c => c.id === commentId);

    // 댓글 폼에 내용 채우기
    const textarea = document.querySelector('.comment-form textarea');
    const submitButton = document.querySelector('.comment-form button');
    textarea.value = comment.content;
    submitButton.textContent = '댓글 수정';
    textarea.focus();

    // 폼 제출 이벤트 변경
    const form = document.querySelector('.comment-form');
    const originalSubmitHandler = form.onsubmit;
    
    form.onsubmit = (event) => {
        event.preventDefault();
        
        const newContent = textarea.value.trim();
        if (!newContent) return;

        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id == postId);
        const commentIndex = posts[postIndex].comments.findIndex(c => c.id === commentId);
        
        posts[postIndex].comments[commentIndex].content = newContent;
        posts[postIndex].comments[commentIndex].edited = true;
        
        localStorage.setItem('posts', JSON.stringify(posts));
        
        // UI 초기화
        loadComments(postId);
        form.reset();
        submitButton.textContent = '댓글 등록';
        form.onsubmit = originalSubmitHandler;
        updateCommentButton();
    };
}

window.deleteComment = function(commentId) {
    showDeleteModal(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        const posts = JSON.parse(localStorage.getItem('posts') || '[]');
        const postIndex = posts.findIndex(p => p.id == postId);
        
        posts[postIndex].comments = posts[postIndex].comments.filter(c => c.id !== commentId);
        
        localStorage.setItem('posts', JSON.stringify(posts));
        loadComments(postId);
        updateStats(posts[postIndex]);
    });
}

function formatNumber(num) {
    if (num >= 100000) return Math.floor(num/1000) + 'k';
    if (num >= 10000) return Math.floor(num/1000) + 'k';
    if (num >= 1000) return Math.floor(num/1000) + 'k';
    return num;
}

function updateStats(post) {
    document.getElementById('like-count').textContent = formatNumber(post.likes);
    document.getElementById('view-count').textContent = formatNumber(post.views);
    document.getElementById('comment-count').textContent = formatNumber(post.comments.length);
}

function updateCommentButton() {
    const textarea = document.querySelector('.comment-form textarea');
    const submitButton = document.querySelector('.comment-form button');
    
    if (textarea.value.trim()) {
        submitButton.disabled = false;
        submitButton.style.background = '#7F6AEE';
    } else {
        submitButton.disabled = true;
        submitButton.style.background = '#ACA0EB';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.querySelector('.comment-form');
    const textarea = commentForm.querySelector('textarea');
    
    textarea.addEventListener('input', updateCommentButton);
    updateCommentButton();

    document.querySelector('.delete-button').addEventListener('click', handleDelete);
    document.querySelector('.edit-button').addEventListener('click', handleEdit);
}); 