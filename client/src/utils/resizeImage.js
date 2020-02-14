/** 
   * Resize image
   * @param {string} dataUrl
   * @param {string} type
   * @param {number} maxSize
  */
const resizeImage = (dataUrl, type, maxSize = 1000) => {
  const img = document.createElement("img");
  img.src = dataUrl;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // console.log(img.height);
      const canvas = document.createElement('canvas');
      const max = img.height > img.width ? img.height : img.width;
      if (max > maxSize) {
        canvas.height = (img.height / max) * maxSize;
        canvas.width = (img.width / max) * maxSize;

        const context = canvas.getContext('2d');
        context.scale(maxSize / max, maxSize / max);
        context.drawImage(img, 0, 0);
        // return canvas.toDataURL();
        resolve(canvas.toDataURL(type, 0.5));
      } else {
        // return dataUrl;
        resolve(dataUrl);
      }
    }
  });
};

const base64MimeType = (encoded) => {
  var result = null;

  if (typeof encoded !== 'string') {
    return result;
  }

  var mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);

  if (mime && mime.length) {
    result = mime[1];
  }

  return result;
}

module.exports = { resizeImage };