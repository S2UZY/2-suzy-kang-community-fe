export function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const container = document.getElementById('posts-container');

    // 최신 글이 위에 오도록 정렬
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));


    posts.forEach(post => {
        // 작성자 정보 찾기
        const author = users.find(user => user.id === post.authorId);
        const authorProfile = author ? author.profile : '/images/default-profile.png';

        // 날짜 포맷팅
        const date = new Date(post.date);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

        container.innerHTML += `
            <div class="post-item" onclick="location.href='detail.html?id=${post.id}'">
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                <div class="post-stats">
                        <span class="stat-item">
                            <span>좋아요</span>
                            <span>${post.likes || 0}</span>
                        </span>
                        <span class="stat-item">
                            <span>댓글</span>
                            <span>${post.comments?.length || 0}</span>
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
                        <img src="${authorProfile}" alt="작성자 프로필" class="author-image">
                        <span>${post.author}</span>
                    </div>
                </div>
            </div>
        `;
    });

    // 게시글이 없는 경우
    if (posts.length === 0) {
        container.innerHTML += `
            <div style="text-align: center; padding: 40px; color: #666;">
                아직 게시글이 없습니다.
            </div>
        `;
    }
} 