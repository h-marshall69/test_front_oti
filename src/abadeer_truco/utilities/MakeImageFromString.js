export const MakeImage = (imageSrc) => {
  if (!imageSrc || typeof imageSrc !== "string") return null;

  const [header, data] = imageSrc.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const byteChars = atob(data);

  const array = Uint8Array.from(byteChars, c => c.charCodeAt(0));
  return new Blob([array], { type: mime });
};
