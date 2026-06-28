const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "tedbus",
        resource_type: "image",
        width: options.width,
        height: options.height,
        crop: options.crop,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = uploadToCloudinary;