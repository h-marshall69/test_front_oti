import { defineStore } from 'pinia'

export const useAdmisionStore = defineStore('admision', {
    state: () => ({
        imageTaken: "",
        urlImage: "",
        accuracyPhoto: "",
        statusUser: "0",
        urlImageLast: "",
        msgAPI: "",
        urlsSearched: [],
        coordinatesFace: { x: 0, y: 0, width: 0, height: 0 },
        selectedValues: [],
        notFoundVal: false,
        dniall: ""
    }),

    actions: {
        setImageTaken(val) { this.imageTaken = val },
        setUrlImage(val) { this.urlImage = val },
        setAccuracyPhoto(val) { this.accuracyPhoto = val },
        setStatusUser(val) { this.statusUser = val },
        setUrlImageLast(val) { this.urlImageLast = val },
        setMsgAPI(val) { this.msgAPI = val },
        setUrlsSearched(val) { this.urlsSearched = val },
        setCoordinatesFace(val) { this.coordinatesFace = val },
        setSelectedValues(val) { this.selectedValues = val },
        setNotFoundVal(val) { this.notFoundVal = val },
        setDniall(val) { this.dniall = val }
    }
})