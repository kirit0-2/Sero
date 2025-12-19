import { connectDB } from "@/lib/Connection";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import MediaModel from "@/models/Media.model";

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
            { $set: { deletedAt: null } }
        );

        return response(true, 200, "Media restored successfully");
    } catch (error) {
        return catchError(error);
    }
}
