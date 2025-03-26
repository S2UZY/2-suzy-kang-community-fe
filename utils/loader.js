import { updateNavbar, handleLogout } from '/components/navbar.js';

export function loadComponent(id, path) {
    const element = document.getElementById(id);
    
    if (!element) {
        console.log(`Element with id '${id}' not found in the document`);
        return;
    }

    return fetch(path)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${path}: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
        })
        .catch(error => {
            console.log('Error loading component:', error);
            throw error;  
        });
}

function checkAuthAndRedirect() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const publicPaths = ['/index.html', '/pages/auth/login/', '/pages/auth/register/'];
    const currentPath = window.location.pathname;

    if (currentUser) {
        if (publicPaths.some(path => currentPath.includes(path))) {
            window.location.href = '/pages/posts/list';
        }
    } else {
        if (!publicPaths.some(path => currentPath.includes(path))) {
            window.location.href = '/pages/auth/login';
        }
    }
}


export function initPage() {
    document.addEventListener('DOMContentLoaded', () => {
    // 인증 상태 체크 및 리다이렉트
    checkAuthAndRedirect();
    
    // 네비게이션 바 로드 및 업데이트
    loadComponent('navbar', '/components/navbar.html').then(() => {
        updateNavbar();
        document.getElementById('logout-button')?.addEventListener('click', handleLogout);
    });

    // 모달 로드
    loadComponent('modal', '/components/modal.html');
    });
} 