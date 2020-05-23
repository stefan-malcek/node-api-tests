export const toQueryString = (queryParams = {}) => {
    const parts = [];
    for (const property of Object.keys(queryParams)) {
        const value = queryParams[property];
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                for (const part of value) {
                    parts.push(`${property}=${encodeURIComponent(part)}`);
                }
            } else {
                parts.push(`${property}=${encodeURIComponent(value)}`);
            }
        }
    }
    return parts.join('&');
};
