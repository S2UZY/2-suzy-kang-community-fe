import { API_CONFIG } from '../config/api.js';

async function fetchApi(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
            credentials: "include"
        });

        const data = await response.json();
    
        if (!response.ok) {
            return { 
                success: false, 
                error: data.message || data.error || `API Error: ${response.status}` 
            };
        }

        return { 
            success: true, 
            data : data.data
        };

    } catch (error) {
        console.error('API request failed:', error);
        return { 
            success: false, 
            error: error.message || '요청에 실패했습니다.' 
        };
    }
} 

export async function apiClient(endpoint, options = {}) {
    const response = await fetchApi(endpoint, options);
    return response;
}

