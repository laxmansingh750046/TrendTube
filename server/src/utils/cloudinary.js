import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const extractPublicIdFromUrl = (url)=>{
    const regex = /\/upload\/v\d+\/([^\.]+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if(!localFilePath)return null;
        //uploading file's
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        }); 
        console.log("File uploaded on cloudinary ");
        fs.unlinkSync(localFilePath);
        return response;
    }
    catch(error){
        fs.unlinkSync(localFilePath);//remove locally saved temporary file
        // as uploaded operation got failed
        console.log("file not uploaded beccause of following errors ",error);
        return null;
    }
}

const deleteFromCloudinary = async(url, type="image")=>{
    try{
        if(!url)return null;
        const publicId = extractPublicIdFromUrl(url);
        const response = await cloudinary.uploader.destroy(publicId,{
            resource_type: type
        });
        console.log("File deleted successfully ",response);
        return response;
    }
    catch(err){
        console.log("File not deleted due to following reason :",err);
        return null;
    }
}

export { 
    uploadOnCloudinary,
    deleteFromCloudinary 
};
