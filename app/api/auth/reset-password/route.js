import { connectDB } from "@/lib/Connection";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/Otp.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validationSchema = zSchema.pick({
            email: true,
            password: true
        })

        const validationData = validationSchema.safeParse(payload)
        if (!validationData.success) {
            return response(false, 400, 'Invalid or missing input field.',
                validationData.error.errors)
        }

        const { email, password } = validationData.data

        // Verify that OTP was verified (check if OTP still exists)
        const otpRecord = await OTPModel.findOne({ email }).sort({ createdAt: -1 })
        
        if (!otpRecord) {
            return response(false, 401, 'Please verify OTP first.')
        }

        // Check if OTP is still valid
        const now = new Date()
        if (now > otpRecord.expiresAt) {
            await OTPModel.deleteOne({ _id: otpRecord._id })
            return response(false, 401, 'OTP has expired. Please start the process again.')
        }

        // Find user
        const user = await UserModel.findOne({ 
            deletedAt: null, 
            email: email 
        })

        if (!user) {
            return response(false, 404, 'User not found.')
        }

        // Update password (will be hashed by pre-save hook)
        user.password = password
        await user.save()

        // Delete the used OTP
        await OTPModel.deleteMany({ email })

        return response(true, 200, 'Password reset successfully! Redirecting to login...')

    } catch (error) {
        console.error('Reset password error:', error)
        return catchError(error, "Failed to reset password. Please try again.")
    }
}
