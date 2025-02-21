const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const error_handler = require("./utills/error_handler");

exports.upload_helper = (req, res, next) => {

  // storage size
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single("image");


  upload(req, res, (err) => {

    // if in sell product edit product image is not updates then this program flow will be skipped
    if(req.body.is_update_image==="no"){
        req.body.is_update_image = undefined
        return next()
    }
    

    // file size exceed max 5mb
    if (err) {
        // Handle file size limit error
        if (err.code === "LIMIT_FILE_SIZE") {
        return next(new error_handler("File size exceeds the maximum limit of 5MB!"));
        }

        // Handle other multer errors
        return next(err);
    }

    // invalid image
    if (!req.file) {
        return next(new error_handler("No file selected, please upload a valid image"));
        }



    // file upload starts from here
    const uploadStream = cloudinary.uploader.upload_stream({ folder: req.storage_folder }, (error, result) => {
      if (error) return next(error);
      req.image_url = result.secure_url;
      req.cloudinary_public_id = result.public_id;
      next();
    });

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  });
};
