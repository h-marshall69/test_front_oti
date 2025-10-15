// services/photoService.js
import apiClient from './api'
import { makeFormData } from '../abadeer_truco/utilities/FormDataMaker'

const BASE_API_UNA_URL = import.meta.env.VITE_API_UNA_URL;

/**
 * Servicio para operaciones relacionadas con fotos y validación facial
 */
export class PhotoService {
    /**
     * Valida una foto y obtiene la precisión facial
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getPhotoAndAccuracy(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/validacion_cara', bodyRequest, {
                signal: controller.signal,
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Sube una foto al servidor
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async uploadPhoto(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/tomar_fotos', bodyRequest, {
                signal: controller.signal,
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Busca una persona por su rostro
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async buscarPersonaPorRostro(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/buscar_cara', bodyRequest, {
                signal: controller.signal,
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene el recuadro de detección facial
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getSquareFromFace(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/buscar_recuadro_en_cara', bodyRequest, {
                signal: controller.signal,
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Envía una foto procesada
     * @param {Object} bodyRequest - Datos de la petición
     * @param {string} endpoint - Endpoint privado para la petición
     * @returns {Promise<any>}
     */
    static async submitPhotoProcessed(bodyRequest, endpoint = 'recovery-account') {
        const controller = new AbortController()

        try {
            const response = await apiClient.post(`/${endpoint}`, bodyRequest, {
                signal: controller.signal,
            })

            return response.data
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene una foto de DNI
     * @param {string} pathPhoto - Ruta de la foto
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getPhotoDNI(pathPhoto) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post(`/${pathPhoto}`, {}, { signal: controller.signal })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene las carpetas disponibles
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getFoldersAvailable() {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/revision', undefined, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene fotos de un bloque de fecha
     * @param {Object} bodyRequest - Datos con la fecha
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getPhotosFromBlockDate(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/getphotos_date', bodyRequest, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene carpetas con cantidades
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getFoldersQ() {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/getFoldersAndQuantity', undefined, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Comprime carpetas por fechas
     * @param {Object} bodyRequest - Datos con las fechas a comprimir
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async zipFoldersApi(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/comprimirfechas', bodyRequest, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Comprime todas las carpetas
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async zipAllFoldersApi(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api/comprimir', bodyRequest, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene el historial de fotos
     * @param {Object} bodyRequest - Datos de la petición
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getHistoryPhotos(bodyRequest) {
        const controller = new AbortController()

        try {
            const response = await apiClient.post('/api_fotos/getUrlPhoto-A', bodyRequest, {
                signal: controller.signal,
            })

            return {
                data: response.data,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }

    /**
     * Obtiene datos de usuario desde API UNA
     * @param {string} dni - DNI del usuario
     * @param {string} baseUrlApiUna - URL base de la API UNA
     * @returns {Promise<{data: any, cancel: Function}>}
     */
    static async getDataUserApiUna(dni) {
        const controller = new AbortController()

        try {
            const response = await apiClient.get(`${BASE_API_UNA_URL}/LABEL2PHOTOS/v1/${dni}/`, {
                signal: controller.signal,
            })

            const nombre = response?.data?.data[0]?.nombre || "Desconocido"

            return {
                nombre: nombre,
                cancel: () => controller.abort(),
            }
        } catch (error) {
            if (error.name === 'CanceledError') {
                console.log('Request canceled')
            }
            throw error
        }
    }
}
