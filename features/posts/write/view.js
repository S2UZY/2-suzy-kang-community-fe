import { writePost } from '/features/posts/write/model.js';
import { validateTitle, validateContent } from '/features/posts/utils/validation.js';
import { showToast } from '/components/toast.js';

export function initWritePage() {
    setupFormValidation();
    setupWriteSubmit();
    setupImageHandler();
}

function setupWriteSubmit() {
    const writeForm = document.getElementById('write-form');
    
    writeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            image: document.getElementById('image').files[0]
        };

        const result = await writePost(formData);
        
        if (result.success) {
            showToast('게시글이 작성되었습니다.');
            window.location.href = '/pages/posts/list';
        } else {
            const errorElement = document.getElementById('write-error');
            if (errorElement) {
                errorElement.textContent = result.error;
            }
        }
    });
}

function setupFormValidation() {
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    titleInput.addEventListener('input', updateWriteButtonState);
    contentInput.addEventListener('input', updateWriteButtonState);
 
    titleInput.addEventListener('blur', () => {
        validateField('title', validateTitle);
        updateWriteButtonState();
    });

    contentInput.addEventListener('blur', () => {
        validateField('content', validateContent);
        updateWriteButtonState();
    });
}

function setupImageHandler() {
    const imageInput = document.getElementById('image');
    imageInput.addEventListener('change', handleImagePreview);
}

function handleImagePreview(event) {
    const file = event.target.files[0];
    const uploadText = document.querySelector('.upload-text');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadText.textContent = file.name;
            clearError('image-error');
            updateWriteButtonState();
        }
        reader.readAsDataURL(file);
    } else {
        uploadText.textContent = '파일을 선택해주세요.';
        showError('image-error', '*이미지를 선택해주세요.');
        updateWriteButtonState();
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
}

function clearError(elementId) {
    const element = document.getElementById(elementId);
    element.textContent = '';
}

function updateWriteButtonState() {
    const title = document.getElementById('title');
    const content = document.getElementById('content');
    const submitButton = document.querySelector('.submit-button');
    
    const titleValid = !document.getElementById('title-error').textContent;
    const contentValid = !document.getElementById('content-error').textContent;
    
    const isValid = titleValid && contentValid && title.value && content.value;
    submitButton.classList.toggle('active', isValid);
    submitButton.disabled = !isValid;
}

function validateField(fieldName, validationFn) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`${fieldName}-error`);
    const errorMessage = validationFn(field.value);
    
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }
}