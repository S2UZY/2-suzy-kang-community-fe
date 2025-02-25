import { postDetailModel } from './model.js';
import { showToast } from '/components/toast.js';

export function initDetailPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    loadPostDetail(postId);
    setupEventListeners(postId);
}

async function loadPostDetail(postId) {
    const result = await postDetailModel.getPostDetail(postId);

    if (!result.success) {
        showToast(result.error);
        window.location.href = '/pages/posts/list';
        return;
    }

    const post  = result.data;
    renderPostDetail(post);
    renderComments(post.comments);
    updateStats(post);
}

function renderPostDetail(post) {
    document.getElementById('post-title').textContent = post.title;
    document.getElementById('post-author').textContent = post.author;
    document.getElementById('post-author-image').src = post.authorProfile;
    document.getElementById('post-date').textContent = formatDate(post.createdAt);
    document.getElementById('post-content').textContent = post.content;

    if (post.image) {
        document.getElementById('post-image').innerHTML = `
            <img src="${post.image}" alt="게시글 이미지">
        `;
    }

    const actionButtons = document.querySelector('.post-actions');
    actionButtons.style.display = post.isAuthor ? 'flex' : 'none';

    const likeButton = document.querySelector('.like-button');
    likeButton.classList.toggle('active', post.isLiked);
    likeButton.style.background = post.isLiked ? '#ACA0EB' : '#D9D9D9';
}

function renderComments(comments = []) {
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = comments.map(comment => createCommentElement(comment)).join('');
}

function setupEventListeners(postId) {
    setupCommentForm(postId);
    setupLikeButton(postId);
    setupActionButtons(postId);
}

function setupCommentForm(postId) {
    const commentForm = document.getElementById('comment-form');
    commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = e.target.querySelector('textarea').value;
        const result = await postDetailModel.createComment(postId, content);

        if (result.success) {
            loadPostDetail(postId);
            e.target.reset();
        } else {
            showToast(result.error);
        }
    });
}

function setupLikeButton(postId) {
    document.querySelector('.like-button').addEventListener('click', async () => {
        const result = await postDetailModel.toggleLike(postId);
        if (result.success) {
            const { isLiked, likes } = result.data;
            const likeButton = document.querySelector('.like-button');
            likeButton.classList.toggle('active', isLiked);
            likeButton.style.background = isLiked ? '#ACA0EB' : '#D9D9D9';
            document.getElementById('like-count').textContent = formatNumber(likes);
        } else {
            showToast(result.error);
        }
    });
}

function setupActionButtons(postId) {
    document.querySelector('.edit-button')?.addEventListener('click', () => {
        window.location.href = `/pages/posts/edit/?id=${postId}`;
    });
}

// 유틸리티 함수들
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(/\. /g, '-').replace('.', '');
}

function formatNumber(num) {
    if (num >= 1000) return Math.floor(num/1000) + 'k';
    return num;
}

function updateStats(post) {
    document.getElementById('like-count').textContent = formatNumber(post.likes || 0);
    document.getElementById('view-count').textContent = formatNumber(post.views || 0);
    document.getElementById('comment-count').textContent = formatNumber(post.comments?.length || 0);
}

function createCommentElement(comment) {
    return `
        <div class="comment">
            <div class="comment-header">
                <img src="${comment.authorProfile}" alt="댓글 작성자 프로필" class="comment-author-image">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.createdAt)}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>
    `;
}