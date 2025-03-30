
export function validateTitle(title) {
    if (!title) {
        return '*제목을 입력해주세요.';
    }
    if (title.trim().length === 0) {
        return '*공백만으로는 제목을 작성할 수 없습니다.';
    }
    if (title.length > 26) {
        return '*제목은 26자 이하로 입력해주세요.';
    }
    return '';
}


export function validateContent(content) {
    if (!content) {
        return '*내용을 입력해주세요.';
    }
    if (content.trim().length === 0) {
        return '*공백만으로는 내용을 작성할 수 없습니다.';
    }
    if (content.length > 1000) {
        return '*내용은 1000자 이하로 입력해주세요.';
    }
    return '';
}


export function validateImage(file) {
    if (!file) {
        return ''; 
    }

    const maxSize = 5 * 1024 * 1024;  // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
        return '*이미지 파일(jpg, png, gif)만 업로드 가능합니다.';
    }

    if (file.size > maxSize) {
        return '*이미지 크기는 5MB 이하여야 합니다.';
    }

    return '';
}