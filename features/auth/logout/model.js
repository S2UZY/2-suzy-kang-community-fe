import { apiClient } from '/lib/api.js';

async function logoutUserApi() {
    const result = await apiClient('/sessions', {
        method: 'DELETE',
    });

    if (result.success) {
        localStorage.removeItem('currentUser');
    }

    return result;
}

async function logoutUserLocal() {
    localStorage.removeItem('currentUser');
}

export async function logoutUser() {
    return await logoutUserApi();
}