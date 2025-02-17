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

export function handleImagePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview');
    const uploadText = document.querySelector('.upload-text');
    
    if (file) {
        uploadText.textContent = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    } else {
        uploadText.textContent = '파일을 선택해주세요.';
        preview.innerHTML = '';
    }
}

export function handleWrite(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const titleError = validateTitle(title);
    const contentError = validateContent(content);

    document.getElementById('title-error').textContent = titleError;
    document.getElementById('content-error').textContent = contentError;

    if (titleError || contentError) {
        return;
    }

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/features/auth/login.html';
        return;
    }

    // 이미지를 Base64로 변환
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            savePost(title, content, e.target.result, currentUser);
        }
        reader.readAsDataURL(imageFile);
    } else {
        savePost(title, content, null, currentUser);
    }
}

function savePost(title, content, image, user) {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const newPost = {
        id: Date.now(),
        title,
        content,
        image,
        author: user.nickname,
        authorId: user.id,
        date: new Date().toISOString(),
        likes: 0,
        views: 0,
        comments: []
    };

    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    window.location.href = '/features/posts/list.html';
}

// 입력 필드 이벤트 리스너
document.getElementById('title').addEventListener('input', function(e) {
    const error = validateTitle(e.target.value);
    document.getElementById('title-error').textContent = error;
    updateSubmitButton();
});

document.getElementById('content').addEventListener('input', function(e) {
    const error = validateContent(e.target.value);
    document.getElementById('content-error').textContent = error;
    updateSubmitButton();
}); 