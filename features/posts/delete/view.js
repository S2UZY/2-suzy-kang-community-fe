import { postDeleteModel } from './model.js';
import { showModal } from '/components/modal.js';
import { showToast } from '/components/toast.js';

export function initDeleteFeature() {
    setupDeleteButton();
}

function setupDeleteButton() {
    document.querySelector('.delete-button')?.addEventListener('click', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('id');
        showDeleteConfirmModal(postId);
    });
}

function showDeleteConfirmModal(postId) {
    showModal({
        title: '삭제하시겠습니까?',
        content: '삭제한 내용은 복구할 수 없습니다.',
        onConfirm: async () => {
            const result = await postDeleteModel.deletePost(postId);
            
            if (result.success) {
                showToast('게시글이 삭제되었습니다.');
                window.location.href = '/pages/posts/list';
            } else {
                showToast(result.error);
            }
        }
    });
}