const resizeImage = (dataUrl, type) => {
  const img = document.createElement("img");
  img.src = dataUrl;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      // console.log(img.height);
      const canvas = document.createElement('canvas');
      const max = img.height > img.width ? img.height : img.width;
      if (max > 1000) {
        canvas.height = (img.height / max) * 1000;
        canvas.width = (img.width / max) * 1000;

        const context = canvas.getContext('2d');
        context.scale(1000 / max, 1000 / max);
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