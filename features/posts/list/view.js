import { getPosts } from '/features/posts/list/model.js';

export function initListPage() {
    loadPosts();
}

async function loadPosts() {
    const container = document.getElementById('posts-container');
    const result = await getPosts();

    if (!result.success) {
        container.innerHTML = `
            <div class="error-message">
                ${result.error}
            </div>
        `;
        return;
    }

    const posts = result.data;

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                아직 게시글이 없습니다.
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => createPostElement(post)).join('');
}

function createPostElement(post) {
    const formattedDate = formatDate(post.createdAt);

    return `
        <div class="post-item" onclick="location.href='/pages/posts/detail/?id=${post.id}'">
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <div class="post-stats">
                    <span class="stat-item">
                        <span>좋아요</span>
                        <span>${post.likes || 0}</span>
                    </span>
                    <span class="stat-item">
                        <span>댓글</span>
                        <span>${post.commentLength || 0}</span>
                    </span>
                    <span class="stat-item">
                        <span>조회</span>
                        <span>${post.views || 0}</span>
                    </span>
                </div>
                <span class="post-date">${formattedDate}</span>
            </div>
            <div class="post-author-container">
                <div class="post-author">
                    <img src="${post.authorProfile}" alt="작성자 프로필" class="author-image">
                    <span>${post.author}</span>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}