import axios from 'axios';

// Get all addresses
export const getProvinces = async () => {
    const response = await axios.get('/api/address/');
    return response.data;
};

// Add a new address
export const addAddress = async (addressData) => {
    const response = await axios.post('/api/address/', addressData);
    return response.data;
};

// Update an address
export const updateAddress = async (id, addressData) => {
    const response = await axios.patch(`/api/address/${id}/`, addressData);
    return response.data;
};

// Delete an address
export const deleteAddress = async (id) => {
    const response = await axios.delete(`/api/address/${id}/`);
    return response.data;
};
