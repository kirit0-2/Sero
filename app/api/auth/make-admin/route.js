import { connectDB } from "@/lib/Connection";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validationSchema = zSchema.pick({
            email: true
        })

        const validationData = validationSchema.safeParse(payload)
        if (!validationData.success) {
            return response(false, 400, 'Invalid or missing email.',
                validationData.error.errors)
        }

        const { email } = validationData.data

        // Find user
        const user = await UserModel.findOne({ 
            deletedAt: null, 
            email: email 
        })

        if (!user) {
            return response(false, 404, 'User not found.')
        }

        // Update role to admin
        user.role = 'admin'
        await user.save()

        return response(true, 200, 'User role updated to admin successfully!', {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.error('Make admin error:', error)
        return catchError(error, "Failed to update user role. Please try again.")
    }
}
