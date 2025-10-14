import apiClient from './api';

export class SelectorDates {
    static async uncknow() {
        try {
            const response = await apiClient.post('/api/revision', null);

            console.log(response.data);
            return response.data;

        } catch (error) {
            console.error('Error en la petición:', error);
            return null;
        }
    }
}
