import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: 'ddg9b0qik',
    api_key: '514772523888747',
    api_secret: 'AGHjgl-sPBRd2lMmLP569sZwMDA'
});

export default cloudinary;
