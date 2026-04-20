import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

interface UploadResult {
    url: string;
    publicId: string;
}

/**
 * Upload a buffer (from multer memory storage) to Cloudinary
 */
export const uploadToCloudinary = (
    buffer: Buffer,
    folder: string = "memory-vault"
): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                transformation: [
                    { quality: "auto", fetch_format: "auto" },
                ],
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error("Upload failed"));
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        const readable = Readable.from(buffer);
        readable.pipe(stream);
    });
};

/**
 * Delete an image from Cloudinary by public_id
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};
