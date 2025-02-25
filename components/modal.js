export function showModal({ title, content, confirmText = '확인', cancelText = '취소', onConfirm, onCancel }) {
    const modal = document.getElementById('modal');
    const modalOverlay = document.querySelector('.modal-overlay');
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
    modalOverlay.style.display = 'flex';
}

export function hideModal() {
    const modal = document.getElementById('modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
} 