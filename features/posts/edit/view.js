import { postEditModel } from './model.js';
import { showToast } from '/components/toast.js';
import { validateTitle, validateContent } from '/features/posts/utils/validation.js';

export function initEditPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    loadPost(postId);
    setupFormValidation();
    setupImageHandlers();
}

async function loadPost(postId) {
    const result = await postEditModel.getPost(postId);

    if (!result.success) {
        showToast(result.error);
        window.location.href = '/pages/posts/list';
        return;
    }

    const { post } = result.data;
    fillFormData(post);
}

function fillFormData(post) {
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;

    // 기존 이미지 처리
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
}

function setupFormValidation() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    titleInput.addEventListener('input', () => {
        validateField('title', validateTitle);
        updateSubmitButton();
    });

    contentInput.addEventListener('input', () => {
        validateField('content', validateContent);
        updateSubmitButton();
    });

    document.getElementById('editForm').addEventListener('submit', handleSubmit);
}

function setupImageHandlers() {
    document.getElementById('image').addEventListener('change', handleImagePreview);
    document.querySelector('.remove-image-button').addEventListener('click', handleImageRemove);
}

async function handleSubmit(event) {
    event.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const formData = await getFormData();

    if (!validateForm(formData)) return;

    const result = await postEditModel.editPost(postId, formData);
    
    if (result.success) {
        showToast('게시글이 수정되었습니다.');
        window.location.href = `/pages/posts/detail/?id=${postId}`;
    } else {
        showToast(result.error);
    }
}

async function getFormData() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const imageFile = document.getElementById('image').files[0];
    let image = null;

    if (imageFile) {
        image = await readFileAsDataURL(imageFile);
    } else {
        const currentImageContainer = document.getElementById('current-image');
        if (currentImageContainer.style.display !== 'none') {
            image = document.querySelector('.image-container img')?.src;
        }
    }

    return { title, content, image };
}

function validateForm(formData) {
    const titleError = validateTitle(formData.title);
    const contentError = validateContent(formData.content);

    document.getElementById('title-error').textContent = titleError;
    document.getElementById('content-error').textContent = contentError;

    return !titleError && !contentError;
}

function validateField(fieldName, validationFn) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const errorMessage = validationFn(field.value);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
}

function updateSubmitButton() {
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const submitButton = document.querySelector('.submit-button');
    
    const titleValid = !document.getElementById('title-error').textContent;
    const contentValid = !document.getElementById('content-error').textContent;
    
    const isValid = titleValid && contentValid && title && content;
    submitButton.classList.toggle('active', isValid);
    submitButton.disabled = !isValid;
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
    });
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    if (!validateImageFile(file)) {
        event.target.value = '';
        return;
    }

    updateImagePreview(file);
}

function validateImageFile(file) {
    if (!file) return true;

    if (file.size > 5 * 1024 * 1024) {
        showToast('파일 크기는 5MB 이하여야 합니다.');
        return false;
    }

    if (!file.type.startsWith('image/')) {
        showToast('이미지 파일만 업로드 가능합니다.');
        return false;
    }

    return true;
}

function updateImagePreview(file) {
    const preview = document.getElementById('preview');
    const uploadText = document.querySelector('.upload-text');
    const currentImage = document.getElementById('current-image');
    
    uploadText.textContent = file ? file.name : '파일을 선택해주세요.';
    
    if (file) {
        readFileAsDataURL(file).then(dataUrl => {
            preview.innerHTML = `<img src="${dataUrl}" alt="Preview" style="max-width: 200px; max-height: 200px;">`;
            currentImage.style.display = 'none';
        });
    } else {
        preview.innerHTML = '';
        if (document.querySelector('.image-container img')) {
            currentImage.style.display = 'block';
        }
    }
}

function handleImageRemove() {
    const currentImage = document.getElementById('current-image');
    const imageInput = document.getElementById('image');
    const preview = document.getElementById('preview');
    const uploadText = document.querySelector('.upload-text');

    currentImage.style.display = 'none';
    imageInput.value = '';
    preview.innerHTML = '';
    uploadText.textContent = '파일을 선택해주세요.';
    currentImage.dataset.removed = 'true';
}