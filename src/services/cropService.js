// services/cropService.js
import { useCameraStore } from '@/stores/camera'
import apiClient from './api';
import { makeFormData } from '@/abadeer_truco/utilities/FormDataMaker';

export class CropService {
    /**
     * Envía una imagen al backend para ser procesada y recortada.
     * @param {string | File | Blob} imageData - La imagen a procesar (preferiblemente como File o Blob).
     * @param {string} dni - El DNI asociado a la imagen.
     * @param {string[]} [codes] - Códigos opcionales para la petición.
     * @returns {Promise<any>} La respuesta de la API.
     */
    static async cropImage(imageData, dni, codes = ["00000000-0000-0000-0000-000000000000"]) {
        const cameraStore = useCameraStore();

        try {
            cameraStore.setLoading(true)
            cameraStore.setError(null)

            const formData = makeFormData({
                imageString: imageData,
                dni: dni,
                codes: codes
            });

            // const response = await apiClient.post('/tomar_photo', formData,);

            // return response.data;

            return {
                success: true,
                imageUrl: `https://picsum.photos/400/300?random=${Math.random()}`,
                message: 'Imagen recortada exitosamente'
            }

        } catch (error) {
            let errorMessage = 'Ocurrió un error inesperado.';
            if (error.response && error.response.data && error.response.data.message) {
                // Si el backend envía un JSON con una propiedad 'message'
                errorMessage = error.response.data.message;
            } else if (error.message) {
                // Si no, usamos el mensaje de error genérico
                errorMessage = error.message;
            }
            cameraStore.setError('Error al procesar la imagen: ' + errorMessage);
            throw error;
        } finally {
            cameraStore.setLoading(false)
        }
    }

}