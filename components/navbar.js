export function updateNavbar() {
    setNavBackButton();
    setProfileMenu();
}

export function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = '/features/auth/login.html';
}

function setNavBackButton() {
    const navBackButton = document.getElementById('nav-back-button');
    
    const hideBackButtonPaths = [
        '/index.html',
        '/features/auth/login.html',
        '/features/posts/list.html',
        '/features/auth/edit-profile.html',
        '/features/auth/change-password.html'
    ];
    
    if (hideBackButtonPaths.includes(window.location.pathname)) {
        navBackButton.style.display = 'none';
    } else {
        navBackButton.style.display = 'flex';
    }
}

function setProfileMenu() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const profileMenu = document.getElementById('profile-menu');

    if (currentUser) {
        profileMenu.style.display = 'block';
        document.getElementById('profile-image').src = currentUser.profile;
    } else {
        profileMenu.style.display = 'none';
    }
}

