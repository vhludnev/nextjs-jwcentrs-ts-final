// import { v2 as cloudinary } from 'cloudinary'

import { generateSHA1, generateSignature } from "./crypto";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// })

// export const uploadImageToCloudinary = async (path, folder) => {
//   return await cloudinary.uploader.upload(path, { folder })
// }

// export const deleteImageFromCloudinary = async public_id => {
//   return await cloudinary.uploader.destroy(public_id)
// }
// const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/

// export const getPublicIdFromUrl = url => {
//   const match = url.match(regex)
//   return match ? match[1] : null
// }

export const handleAddImage = async (image: File) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME;
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", uploadPreset as string);

  try {
    const uploadResponse = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const uploadedImageData = await uploadResponse.json();
    const imageUrl = uploadedImageData.secure_url;
    return imageUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const handleDeleteImage = async (public_id: string) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const timestamp = new Date().getTime();
  const api_key = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;
  const signature = generateSHA1(
    generateSignature(public_id, apiSecret as string)
  );
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  const formData = new FormData();
  formData.append("public_id", public_id);
  formData.append("api_key", api_key as string);
  formData.append("timestamp", timestamp as any);
  formData.append("signature", signature);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const { error } = await response.json();

    if (error) {
      console.log(error);
      return;
    }
  } catch (error) {
    console.error(error);
  }
};
