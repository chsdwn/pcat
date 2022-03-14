module.exports.convertImageBufferToBase64 = (image, mimetype = 'image/png') => {
  return `data:${mimetype};base64,${Buffer.from(image).toString('base64')}`
}
