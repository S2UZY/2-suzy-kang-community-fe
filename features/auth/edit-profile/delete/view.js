import { showToast } from '/components/toast.js';
import { deleteAccount } from '/features/auth/edit-profile/delete/model.js';

export function initDeleteAccount() {
    setupDeleteAccountHandler();
}

function setupDeleteAccountHandler() {
    const deleteButton = document.getElementById('delete-account-button');
    deleteButton.addEventListener('click', showDeleteConfirmModal);
}

function showDeleteConfirmModal() {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    modalOverlay.innerHTML = `
        <div class="modal">
            <div class="modal-title">회원탈퇴 하시겠습니까?</div>
            <div class="modal-content">작성된 게시글과 댓글은 삭제됩니다.</div>
            <div class="modal-buttons">
                <button class="modal-cancel">취소</button>
                <button class="modal-confirm">확인</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);

    modalOverlay.querySelector('.modal-cancel').addEventListener('click', () => 
        modalOverlay.remove()
    );

    modalOverlay.querySelector('.modal-confirm').addEventListener('click', async () => {
        const result = await deleteAccount();
        if (result.success) {
            showToast('회원탈퇴가 완료되었습니다.');
            setTimeout(() => window.location.href = '/index.html', 2000);
        }
        modalOverlay.remove();
    });
}