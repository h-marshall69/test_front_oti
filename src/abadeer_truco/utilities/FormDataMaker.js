import { MakeImage } from "./MakeImageFromString";

export const makeFormData = (data) => {
  const formData = new FormData();

  // Si viene imageString, lo convertimos a Blob
  if (data.imageString) {
    const blob = MakeImage(data.imageString);
    if (blob) formData.append("file", blob, "image.jpg");
  }

  // Recorremos el resto de propiedades
  Object.entries(data).forEach(([key, value]) => {
    if (!value || key === "imageString") return; // ya lo manejamos arriba
    formData.append(key, Array.isArray(value) ? value.toString() : value);
  });

  return formData;
};
