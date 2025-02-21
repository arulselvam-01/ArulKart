const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with API keys
cloudinary.config({
  cloud_name: "dpmb56sx5",
  api_key: "463563378728451",
  api_secret: "V-fm0Us_usXuogUKJI1vg9xhCyM",
});

module.exports = cloudinary; // Export for use in other files
