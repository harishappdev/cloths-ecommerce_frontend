import api from './api';

export const inventoryService = {
    getProductByBarcode: async (barcode: string) => {
        const response = await api.get(`/products/barcode/${barcode}`);
        return response.data;
    },

    updateStock: async (barcode: string, action: 'add' | 'remove', quantity: number) => {
        const response = await api.post('/inventory/update', {
            barcode,
            action,
            quantity
        });
        return response.data;
    }
};
