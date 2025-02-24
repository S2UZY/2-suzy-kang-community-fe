import { showToast } from '/components/toast.js';

export function loadProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        window.location.href = '/features/auth/login.html';
        return;
    }

    // 프로필 정보 표시
    document.getElementById('email').value = currentUser.email;
    document.getElementById('nickname').value = currentUser.nickname;
    document.getElementById('profile-preview').innerHTML = `
        <img src="${currentUser.profile}" alt="프로필 이미지">
    `;
}

export function handleProfileEdit(event) {
    event.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const nickname = document.getElementById('nickname').value;
    const profilePreview = document.getElementById('profile-preview').querySelector('img')?.src;
    const nicknameError = document.getElementById('nickname-error');
    const nicknameInput = document.getElementById('nickname');

    // 닉네임 유효성 검사
    if (!nickname) {
        nicknameError.textContent = '*닉네임을 입력해주세요.';
        nicknameInput.classList.add('error');
        return;
    }

    if (nickname.length > 10) {
        nicknameError.textContent = '*닉네임은 최대 10자까지 작성 가능합니다.';
        nicknameInput.classList.add('error');
        return;
    }

    const isDuplicate = users.some(user => 
        user.nickname === nickname && user.id !== currentUser.id
    );

    if (isDuplicate) {
        nicknameError.textContent = '*중복된 닉네임입니다.';
        nicknameInput.classList.add('error');
        return;
    }

    if (!profilePreview) {
        document.getElementById('profile-error').textContent = '*프로필 사진을 추가해주세요.';
        return;
    }

    nicknameError.textContent = '';
    nicknameInput.classList.remove('error');
    document.getElementById('profile-error').textContent = '';

    const updatedUser = {
        ...currentUser,
        nickname,
        profile: profilePreview
    };

    const userIndex = users.findIndex(user => user.id === currentUser.id);
    users[userIndex] = updatedUser;

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('users', JSON.stringify(users));

    // 토스트 메시지 표시 후 페이지 새로고침
    const toast = showToast('수정 완료');
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

export function handleProfilePreview(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('profile-preview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="프로필 미리보기">`;
        }
        reader.readAsDataURL(file);
    }
}

export function handleDeleteAccount() {
    // 모달 생성
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalHTML = `
        <div class="modal">
            <div class="modal-title">회원탈퇴 하시겠습니까?</div>
            <div class="modal-content">작성된 게시글과 댓글은 삭제됩니다.</div>
            <div class="modal-buttons">
                <button class="modal-cancel">취소</button>
                <button class="modal-confirm">확인</button>
            </div>
        </div>
    `;
    
    modalOverlay.innerHTML = modalHTML;
    document.body.appendChild(modalOverlay);

    // 버튼 이벤트 리스너
    const cancelButton = modalOverlay.querySelector('.modal-cancel');
    const confirmButton = modalOverlay.querySelector('.modal-confirm');

    cancelButton.addEventListener('click', () => {
        modalOverlay.remove();
    });

    confirmButton.addEventListener('click', () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const users = JSON.parse(localStorage.getItem('users'));

        const updatedUsers = users.filter(user => user.id !== currentUser.id);
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.removeItem('currentUser');

        // 토스트 메시지 표시 후 페이지 이동
        const toast = showToast('회원탈퇴가 완료되었습니다.');
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 2000);

        modalOverlay.remove();
    });
} 