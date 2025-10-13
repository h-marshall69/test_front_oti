import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import Aura from '@primeuix/themes/aura';

import PrimeVue from 'primevue/config';

import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice'

// Estilos globales
// import './style.css'
const localeEs = {
    startsWith: 'Empieza con',
    contains: 'Contiene',
    notContains: 'No contiene',
    emptyMessage: "No hay opciones disponibles",
    emptySelectionMessage: "Seleccioanr",
    noFileChosenMessage: "Sin Archivo",
    endsWith: 'Termina con',
    equals: 'Igual',
    notEquals: 'Diferente',
    noFilter: 'Sin filtro',
    lt: 'Menor que',
    lte: 'Menor o igual que',
    gt: 'Mayor que',
    gte: 'Mayor o igual que',
    dateIs: 'Fecha es',
    dateIsNot: 'Fecha no es',
    dateBefore: 'Fecha es anterior',
    dateAfter: 'Fecha es posterior',
    clear: 'Limpiar',
    apply: 'Aplicar',
    matchAll: 'Coincidir con todo',
    matchAny: 'Coincidir con cualquiera',
    selectionMessage: "{0} Elementos seleccionados",
    emptySearchMessage: "Sin resultados",
    addRule: 'Agregar ',
    removeRule: 'Eliminar ',
    accept: 'Aceptar',
    reject: 'Rechazar',
    choose: 'Elegir',
    upload: 'Subir',
    cancel: 'Cancelar',
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    weekHeader: 'Sm',
    firstDayOfWeek: 1, // Lunes como primer día
    dateFormat: 'dd/mm/yy',
    weak: 'Débil',
    medium: 'Medio',
    strong: 'Fuerte',
    passwordPrompt: 'Introduce una contraseña'
};

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
        ripple: true,
        locale: localeEs,
        theme: {
            preset: Aura,
            options: {
                prefix: 'p',
                darkModeSelector: '.p-dark',
                cssLayer: {
                    // name: 'primevue',
                    order: 'theme, base, primevue'
                }
            }
        }
    })
app.use(DialogService)
app.mount('#app')
