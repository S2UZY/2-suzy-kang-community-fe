import { logoutUser } from '/features/auth/logout/model.js';

export function updateNavbar() {
    setNavBackButton();
    setProfileMenu();
}

export async function handleLogout() {
    const result = await logoutUser();
    if (result.success) {
        window.location.href = '/pages/auth/login';
    }
}

function setNavBackButton() {
    const navBackButton = document.getElementById('nav-back-button');
    
    const hideBackButtonPaths = [
        '/index.html',
        '/pages/auth/login/',
        '/pages/posts/list/',
        '/pages/auth/edit-profile/',
        '/pages/auth/change-password/'
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

