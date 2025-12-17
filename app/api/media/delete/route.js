import { connectDB } from "@/lib/Connection";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";

export async function PUT(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized");
        }

        const { ids } = await request.json();
        if (!ids || ids.length === 0) {
            return response(false, 400, "No media selected");
        }

        await connectDB();

        await MediaModel.updateMany(
            { _id: { $in: ids } },
            { $set: { deletedAt: new Date() } }
        );

        return response(true, 200, "Media moved to trash successfully");
    } catch (error) {
        return catchError(error);
    }
}

export async function DELETE(request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized");
        }

        const { ids } = await request.json();
        if (!ids || ids.length === 0) {
            return response(false, 400, "No media selected");
        }

        await connectDB();

        // Find media to get public_ids for Cloudinary deletion
        const mediaToDelete = await MediaModel.find({ _id: { $in: ids } });
        const publicIds = mediaToDelete.map(media => media.public_id);

        if (publicIds.length > 0) {
            try {
                // Determine which are images and which are videos (if you have videos)
                // For now assuming all are treated as resources.
                // cloudinary.api.delete_resources accepts an array of public_ids.
                await cloudinary.api.delete_resources(publicIds);
            } catch (cloudError) {
                console.error("Cloudinary Delete Error:", cloudError);
                // Continue to delete from DB even if Cloudinary fails, 
                // or you might want to return an error. 
                // Usually better to clean up DB and maybe log the orphan images.
            }
        }

        await MediaModel.deleteMany({ _id: { $in: ids } });

        return response(true, 200, "Media deleted permanently");
    } catch (error) {
        return catchError(error);
    }
}
