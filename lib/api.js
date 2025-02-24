async function fetchApi(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const response = await fetch(endpoint, {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return { 
            success: true, 
            data 
        };
    } catch (error) {
        console.error('API request failed:', error);
        return { 
            success: false, 
            error: data.message || error.message || '요청에 실패했습니다.' 
        };
    }
} 

export async function apiClient(endpoint, options = {}) {
    const response = await fetchApi(endpoint, options);
    return response;
}

