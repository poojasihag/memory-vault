import prisma from "../config/prisma.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

export const getProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            bio: true,
            createdAt: true,
            _count: { select: { albums: { where: { isDeleted: false } } } },
        },
    });

    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }

    return user;
};

export const updateProfile = async (
    userId: string,
    data: { name?: string; bio?: string },
    avatarFile?: Express.Multer.File
) => {
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.bio !== undefined) updateData.bio = data.bio;

    if (avatarFile) {
        // Delete old avatar if exists
        const currentUser = await prisma.user.findUnique({ where: { id: userId } });
        if (currentUser?.avatarUrl) {
            // Extract publicId from Cloudinary URL
            const urlParts = currentUser.avatarUrl.split("/");
            const publicIdWithExt = urlParts.slice(-2).join("/");
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
            try {
                await deleteFromCloudinary(publicId);
            } catch (e) {
                // non-critical if old avatar deletion fails
            }
        }

        const uploaded = await uploadToCloudinary(avatarFile.buffer, "memory-vault/avatars");
        updateData.avatarUrl = uploaded.url;
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            bio: true,
        },
    });

    return updatedUser;
};
