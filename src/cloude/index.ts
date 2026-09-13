import { Cloud_Api_Key, Cloud_Api_Secret, Cloud_Name } from '#/util/variable';
import { v2 as cloudinary } from 'cloudinary'


cloudinary.config({ 
  cloud_name: Cloud_Name, 
  api_key: Cloud_Api_Key, 
  api_secret: Cloud_Api_Secret,
  secure:true
});
export default cloudinary