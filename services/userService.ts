import api from './api';

export const userService = {
    updateMe: async (userData: { name?: string; email?: string }) => {
        const response = await api.patch('/users/updateMe', userData);
        return response.data;
    },
    getAddresses: async () => {
        const response = await api.get('/users/addresses');
        return response.data;
    },
    addAddress: async (addressData: any) => {
        const response = await api.post('/users/addresses', addressData);
        return response.data;
    },
    updateAddress: async (id: string, addressData: any) => {
        const response = await api.patch(`/users/addresses/${id}`, addressData);
        return response.data;
    },
    removeAddress: async (id: string) => {
        const response = await api.delete(`/users/addresses/${id}`);
        return response.data;
    }
};
