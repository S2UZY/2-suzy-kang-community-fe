function validateTitle(title) {
    if (!title) {
        return '*제목을 입력해주세요.';
    }
    if (title.length > 26) {
        return '*제목은 26자 이하로 입력해주세요.';
    }
    return '';
}

function validateContent(content) {
    if (!content) {
        return '*내용을 입력해주세요.';
    }
    return '';
}

function updateSubmitButton() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const submitButton = document.querySelector('.submit-button');

    if (title && content) {
        submitButton.classList.add('active');
        submitButton.disabled = false;
    } else {
        submitButton.classList.remove('active');
        submitButton.disabled = true;
    }
}

export function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const post = posts.find(p => p.id == postId);

    if (!post) {
        alert('존재하지 않는 게시글입니다.');
        window.location.href = '/features/posts/list.html';
        return;
    }

    // 폼에 기존 데이터 채우기
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;

    // 기존 이미지가 있다면 표시
    const currentImage = document.getElementById('current-image');
    if (post.image) {
        document.querySelector('.image-container').innerHTML = `
            <img src="${post.image}" alt="현재 이미지" style="max-width: 200px; max-height: 200px;">
        `;
        currentImage.style.display = 'block';
        currentImage.dataset.removed = 'false';
    } else {
        currentImage.style.display = 'none';
        currentImage.dataset.removed = 'true';
    }

    // 입력 필드 이벤트 리스너 추가
    document.getElementById('title').addEventListener('input', function(e) {
        const error = validateTitle(e.target.value);
        document.getElementById('title-error').textContent = error;
        updateSubmitButton();
    });

    document.getElementById('content').addEventListener('input', function() {
        const error = validateContent(this.value);
        document.getElementById('content-error').textContent = error;
        updateSubmitButton();
    });

    updateSubmitButton();
}

export function handleEdit(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    const titleError = validateTitle(title);
    const contentError = validateContent(content);

    document.getElementById('title-error').textContent = titleError;
    document.getElementById('content-error').textContent = contentError;

    if (titleError || contentError) {
        return;
    }

    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const postIndex = posts.findIndex(p => p.id == postId);

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            updatePost(posts, postIndex, title, content, e.target.result);
        }
        reader.readAsDataURL(imageFile);
    } else {
        const currentImageContainer = document.getElementById('current-image');
        const image = currentImageContainer.style.display !== 'none' 
            ? document.querySelector('.image-container img')?.src 
            : null;
        updatePost(posts, postIndex, title, content, image);
    }
}

function updatePost(posts, postIndex, title, content, image) {
    const post = posts[postIndex];
    post.title = title;
    post.content = content;
    post.image = image;
    post.lastModified = new Date().toISOString();

    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = `/features/posts/detail.html?id=${post.id}`;
}

export function handleImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    const uploadText = document.querySelector('.upload-text');
    const currentImage = document.getElementById('current-image');
    
    if (file) {
        // 파일 크기 체크 (예: 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            event.target.value = '';
            return;
        }

        // 이미지 파일 타입 체크
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            event.target.value = '';
            return;
        }

        uploadText.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 200px;">`;
            currentImage.style.display = 'none';
        }
        reader.readAsDataURL(file);
    } else {
        uploadText.textContent = '파일을 선택해주세요.';
        preview.innerHTML = '';
        // 기존 이미지가 있다면 다시 표시
        if (document.querySelector('.image-container img')) {
            currentImage.style.display = 'block';
        }
    }
}

export function handleImageRemove() {
    const currentImage = document.getElementById('current-image');
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('preview');
    const uploadText = document.querySelector('.upload-text');

    currentImage.style.display = 'none';
    imageInput.value = '';
    preview.innerHTML = '';
    uploadText.textContent = '파일을 선택해주세요.';

    // 이미지가 삭제되었음을 표시하는 플래그 설정
    currentImage.dataset.removed = 'true';
} 