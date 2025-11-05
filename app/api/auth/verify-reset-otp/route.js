import { connectDB } from "@/lib/Connection";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/ZodSchema";
import OTPModel from "@/models/Otp.model";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validationSchema = zSchema.pick({
            email: true,
            otp: true
        })

        const validationData = validationSchema.safeParse(payload)
        if (!validationData.success) {
            return response(false, 400, 'Invalid or missing input field.',
                validationData.error.errors)
        }

        const { email, otp } = validationData.data

        // Find the OTP record
        const otpRecord = await OTPModel.findOne({ 
            email, 
            otp 
        }).sort({ createdAt: -1 })

        if (!otpRecord) {
            return response(false, 401, 'Invalid or expired OTP.')
        }

        // Check if OTP is expired (10 minutes)
        const now = new Date()
        if (now > otpRecord.expiresAt) {
            await OTPModel.deleteOne({ _id: otpRecord._id })
            return response(false, 401, 'OTP has expired. Please request a new one.')
        }

        // Don't delete OTP yet - we'll delete it after password reset
        // This prevents users from verifying OTP but not completing password reset

        return response(true, 200, 'OTP verified successfully.')

    } catch (error) {
        console.error('OTP verification error:', error)
        return catchError(error, "OTP verification failed. Please try again.")
    }
}
