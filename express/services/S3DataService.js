var AWS = require('aws-sdk');
const s3Storage = new AWS.S3();

const getImageUrl = async function (imageAnswers) {
  for (let n = 0; n < imageAnswers.length; n++) {
    if (imageAnswers[n].imageLocation) {
      const filename = imageAnswers[n].imageLocation;
      var params = {
        Bucket: CONFIG.aws_bucket_name,
        Key: CONFIG.aws_img_dir_name + filename,
        ResponseContentType: 'image/*'
        // Expires: 86400000
      }
    }
    const url = s3Storage.getSignedUrl('getObject', params);

    if (imageAnswers[n].thumnailImage) {
      const thumnailFilename = imageAnswers[n].thumnailImage;
      var params = {
        Bucket: CONFIG.aws_bucket_name,
        Key: CONFIG.aws_img_dir_name + thumnailFilename,
        ResponseContentType: 'image/*',
        // Expires: 86400000
      }
    }
    const thumnailUrl = s3Storage.getSignedUrl('getObject', params);

    imageAnswers[n].thumnailImage = thumnailUrl;

    imageAnswers[n].imageLocation = url;
    if (n === imageAnswers.length - 1) {
      return imageAnswers;
    }
  }
}
module.exports.getImageUrl = getImageUrl;

const getImage = async function (imageAnswers, directoryName) {
  for (let n = 0; n < imageAnswers.length; n++) {
    if (imageAnswers[n].imageLocation) {
      const filename = imageAnswers[n].imageLocation;
      [err, data] = await to(s3Storage.getObject({
        Bucket: CONFIG.aws_bucket_name,
        Key: directoryName + filename,
        ResponseContentType: 'base64'
      }).promise());
      if (err) TE(err);
      const imageCopy = (data.Body).toString('base64');
      const imageData = 'data:image/png;base64,' + imageCopy;
      imageAnswers[n].imageLocation = imageData;
      if (n === imageAnswers.length - 1) {
        return imageAnswers;
      }
    }
  }
}
module.exports.getImage = getImage;

const uploadImage = async function (image) {
  console.log('image data for sign', 'filename0000', image.filename, image.imageData);
  const imgBufferData = new Buffer(image.imageData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  var params = {
    Key: CONFIG.aws_img_dir_name + image.filename,
    Body: imgBufferData,
    ContentEncoding: 'base64',
    Bucket: CONFIG.aws_bucket_name
  };
  // var request = new PutObjectRequest({
  //   BucketName: CONFIG.aws_bucket_name,
  //   Key: CONFIG.aws_img_dir_name + image.filename,
  //   ContentBody: imgBufferData
  // });
  console.log('data in buff', imgBufferData);
  [error, imgData] = await to(s3Storage.uploadImage(params).promise());
  if (error) {
    return error;
  } else {
    return imgData;
  }
}
module.exports.uploadImage = uploadImage;

const uploadPDF = async function (pdfData, filename) {
  var params = {
    Key: CONFIG.aws_pdf_dir_name + filename,
    Body: pdfData,
    Bucket: CONFIG.aws_bucket_name
  };
  [err, data] = await to(s3Storage.upload(params).promise());
  if (err) TE(err);
  var params = {
    Bucket: CONFIG.aws_bucket_name,
    Key: CONFIG.aws_pdf_dir_name + filename,
    ResponseContentType: 'application/pdf'
  }
  const url = s3Storage.getSignedUrl('getObject', params);
  [err, data] = await to(s3Storage.getObject({
    Bucket: CONFIG.aws_bucket_name,
    Key: CONFIG.aws_pdf_dir_name + filename,
    ResponseContentType: 'application/pdf'
  }).promise());
  const pdfDataCopy = { url: url, size: data.ContentLength };
  return pdfDataCopy;
}
module.exports.uploadPDF = uploadPDF;

const deleteImage = async function (filename) {
  var params = { Bucket: CONFIG.aws_bucket_name, Key: CONFIG.aws_img_dir_name + filename };
  s3Storage.deleteObject(params, function (err, data) {
    if (err) logger.error('delete image error' + err + ',' + err.stack);
    else if (data) logger.info('successfully deleted' + data);
  });
}
module.exports.deleteImage = deleteImage;

const getFileSize = async function (filename) {
  var params = {
    Bucket: CONFIG.aws_bucket_name, Key: CONFIG.aws_img_dir_name + filename
  }
  const data = await to(s3Storage.headObject(params).promise());
  if (err) TE(err);
  return data;
}
module.exports.getFileSize = getFileSize;
