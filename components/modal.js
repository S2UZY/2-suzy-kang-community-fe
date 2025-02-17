export function showModal({ title, content, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }) {
    const modal = document.getElementById('modal');
    const modalTitle = modal.querySelector('.modal-title');
    const modalContent = modal.querySelector('.modal-content');
    const confirmButton = modal.querySelector('.modal-confirm');
    const cancelButton = modal.querySelector('.modal-cancel');

    modalTitle.textContent = title;
    modalContent.textContent = content;
    confirmButton.textContent = confirmText;
    cancelButton.textContent = cancelText;

    confirmButton.onclick = () => {
        if (onConfirm) onConfirm();
        hideModal();
    };

    cancelButton.onclick = () => {
        if (onCancel) onCancel();
        hideModal();
    };

    modal.style.display = 'flex';
}

export function hideModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
} 