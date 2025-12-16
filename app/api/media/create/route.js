import { connectDB } from "@/lib/Connection";
import { catchError, isAuthenticated, response } from "@/lib/helper";
import MediaModel from "@/models/Media.model";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
    const paylod = await request.json()
    try {
        const auth = await isAuthenticated('admin')
        if (!auth.isAuth) {
            return response(false, 403, "Unauthorized")
        }

        await connectDB()
        const newMedia = await MediaModel.insertMany(paylod)
        return response(true, 200, "Media Uploded Successfully", newMedia)

    } catch (error) {
        if (paylod && paylod.length > 0) {
            const publicIds = paylod.map(data => data.public_id)
            try {
                await cloudinary.api.delete_resources(publicIds)
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return catchError(error)
    }
}