import prisma from "../config/prisma.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

// Create album with images
export const createAlbum = async (
    userId: string,
    data: {
        title: string;
        description?: string;
        date?: string;
        songUrl?: string;
        songTitle?: string;
        songArtist?: string;
        songCover?: string;
        templateId?: string;
    },
    files?: Express.Multer.File[]
) => {
    // Upload images to Cloudinary
    const imageUploads = files
        ? await Promise.all(
              files.map((file, index) =>
                  uploadToCloudinary(file.buffer, "memory-vault/albums").then((result) => ({
                      url: result.url,
                      publicId: result.publicId,
                      order: index,
                  }))
              )
          )
        : [];

    const album = await prisma.album.create({
        data: {
            title: data.title,
            description: data.description || null,
            date: data.date ? new Date(data.date) : null,
            songUrl: data.songUrl || null,
            songTitle: data.songTitle || null,
            songArtist: data.songArtist || null,
            songCover: data.songCover || null,
            templateId: data.templateId || null,
            coverUrl: imageUploads.length > 0 ? imageUploads[0].url : null,
            userId,
            images: {
                create: imageUploads.map((img) => ({
                    url: img.url,
                    publicId: img.publicId,
                    order: img.order,
                })),
            },
        },
        include: { images: true },
    });

    return album;
};

// Get all non-deleted albums for a user
export const getAlbums = async (userId: string) => {
    return prisma.album.findMany({
        where: { userId, isDeleted: false },
        include: { images: { orderBy: { order: "asc" }, take: 4 } },
        orderBy: { createdAt: "desc" },
    });
};

// Get single album by ID
export const getAlbumById = async (albumId: string, userId: string) => {
    const album = await prisma.album.findFirst({
        where: { id: albumId, userId },
        include: { images: { orderBy: { order: "asc" } } },
    });

    if (!album) {
        throw { statusCode: 404, message: "Album not found" };
    }

    return album;
};

// Update album metadata
export const updateAlbum = async (
    albumId: string,
    userId: string,
    data: {
        title?: string;
        description?: string;
        date?: string;
        songUrl?: string;
        songTitle?: string;
        songArtist?: string;
        songCover?: string;
        coverUrl?: string;
    }
) => {
    const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
    if (!album) throw { statusCode: 404, message: "Album not found" };

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = data.date ? new Date(data.date) : null;
    if (data.songUrl !== undefined) updateData.songUrl = data.songUrl;
    if (data.songTitle !== undefined) updateData.songTitle = data.songTitle;
    if (data.songArtist !== undefined) updateData.songArtist = data.songArtist;
    if (data.songCover !== undefined) updateData.songCover = data.songCover;
    if (data.coverUrl !== undefined) updateData.coverUrl = data.coverUrl;

    return prisma.album.update({
        where: { id: albumId },
        data: updateData,
        include: { images: { orderBy: { order: "asc" } } },
    });
};

// Toggle favorite
export const toggleFavorite = async (albumId: string, userId: string) => {
    const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
    if (!album) throw { statusCode: 404, message: "Album not found" };

    return prisma.album.update({
        where: { id: albumId },
        data: { isFavorite: !album.isFavorite },
    });
};

// Get favorites
export const getFavorites = async (userId: string) => {
    return prisma.album.findMany({
        where: { userId, isFavorite: true, isDeleted: false },
        include: { images: { orderBy: { order: "asc" }, take: 4 } },
        orderBy: { createdAt: "desc" },
    });
};

// Soft delete (move to trash)
export const softDeleteAlbum = async (albumId: string, userId: string) => {
    const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
    if (!album) throw { statusCode: 404, message: "Album not found" };

    return prisma.album.update({
        where: { id: albumId },
        data: { isDeleted: true, deletedAt: new Date() },
    });
};

// Get trash
export const getTrash = async (userId: string) => {
    return prisma.album.findMany({
        where: { userId, isDeleted: true },
        include: { images: { orderBy: { order: "asc" }, take: 4 } },
        orderBy: { deletedAt: "desc" },
    });
};

// Restore from trash
export const restoreAlbum = async (albumId: string, userId: string) => {
    const album = await prisma.album.findFirst({ where: { id: albumId, userId, isDeleted: true } });
    if (!album) throw { statusCode: 404, message: "Album not found in trash" };

    return prisma.album.update({
        where: { id: albumId },
        data: { isDeleted: false, deletedAt: null },
    });
};

// Permanent delete
export const permanentDeleteAlbum = async (albumId: string, userId: string) => {
    const album = await prisma.album.findFirst({
        where: { id: albumId, userId },
        include: { images: true },
    });
    if (!album) throw { statusCode: 404, message: "Album not found" };

    // Delete all images from Cloudinary
    await Promise.all(
        album.images.map((img) => deleteFromCloudinary(img.publicId).catch(() => {}))
    );

    // Delete album (cascade deletes images in DB)
    await prisma.album.delete({ where: { id: albumId } });

    return { message: "Album permanently deleted" };
};

// Add images to existing album
export const addImages = async (albumId: string, userId: string, files: Express.Multer.File[]) => {
    const album = await prisma.album.findFirst({ where: { id: albumId, userId } });
    if (!album) throw { statusCode: 404, message: "Album not found" };

    // Get current max order
    const maxOrderImage = await prisma.image.findFirst({
        where: { albumId },
        orderBy: { order: "desc" },
    });
    const startOrder = (maxOrderImage?.order ?? -1) + 1;

    const imageUploads = await Promise.all(
        files.map((file, index) =>
            uploadToCloudinary(file.buffer, "memory-vault/albums").then((result) => ({
                url: result.url,
                publicId: result.publicId,
                order: startOrder + index,
                albumId,
            }))
        )
    );

    const createdImages = await prisma.image.createMany({ data: imageUploads });

    // Update cover if album doesn't have one
    if (!album.coverUrl && imageUploads.length > 0) {
        await prisma.album.update({
            where: { id: albumId },
            data: { coverUrl: imageUploads[0].url },
        });
    }

    return prisma.album.findFirst({
        where: { id: albumId },
        include: { images: { orderBy: { order: "asc" } } },
    });
};

// Remove a single image
export const removeImage = async (imageId: string, userId: string) => {
    const image = await prisma.image.findFirst({
        where: { id: imageId },
        include: { album: true },
    });

    if (!image || image.album.userId !== userId) {
        throw { statusCode: 404, message: "Image not found" };
    }

    await deleteFromCloudinary(image.publicId).catch(() => {});
    await prisma.image.delete({ where: { id: imageId } });

    // If this was the cover image, update cover to next available
    if (image.album.coverUrl === image.url) {
        const nextImage = await prisma.image.findFirst({
            where: { albumId: image.albumId },
            orderBy: { order: "asc" },
        });
        await prisma.album.update({
            where: { id: image.albumId },
            data: { coverUrl: nextImage?.url || null },
        });
    }

    return { message: "Image removed" };
};

// Auto-purge: delete albums that have been in trash for 30+ days
export const purgeOldTrash = async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const oldAlbums = await prisma.album.findMany({
        where: {
            isDeleted: true,
            deletedAt: { lte: thirtyDaysAgo },
        },
        include: { images: true },
    });

    for (const album of oldAlbums) {
        await Promise.all(
            album.images.map((img) => deleteFromCloudinary(img.publicId).catch(() => {}))
        );
        await prisma.album.delete({ where: { id: album.id } });
    }

    return { purged: oldAlbums.length };
};
