const cloudinaryEnvTemplate = () => {
  return 'CLOUDINARY_CLOUD_NAME=your_cloud_name\nCLOUDINARY_API_KEY=your_api_key\nCLOUDINARY_API_SECRET=your_api_secret\n';
};

module.exports = {
  cloudinaryEnvTemplate
};
