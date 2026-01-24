import api from '@/utils/api';

// Get all addresses
export const getProvinces = async () => {
    const response = await api.get('/api/address/');
    if (Array.isArray(response.data)) {
        return response.data;
    } else if (response.data && Array.isArray(response.data.results)) {
        return response.data.results;
    }
    return [];
};

// Add a new address
export const addAddress = async (addressData) => {
    const response = await api.post('/api/address/', addressData);
    return response.data;
};

// Update an address
export const updateAddress = async (id, addressData) => {
    const response = await api.patch(`/api/address/${id}/`, addressData);
    return response.data;
};

// Delete an address
export const deleteAddress = async (id) => {
    const response = await api.delete(`/api/address/${id}/`);
    return response.data;
};
