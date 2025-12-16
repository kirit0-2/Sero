import { connectDB } from "@/lib/Connection";
import { catchError, response } from "@/lib/helper";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/Otp.model";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

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

        // Get user details
        const getUser = await UserModel.findOne({
            deletedAt: null,
            email: email
        })

        if (!getUser) {
            return response(false, 404, 'User not found.')
        }

        // Delete the used OTP
        await OTPModel.deleteOne({ _id: otpRecord._id })

        // Generate JWT token
        const loggedInUserData = {
            id: getUser._id,
            email: getUser.email,
            role: getUser.role,
            name: getUser.name,
            avatar: getUser.avatar
        }
        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setExpirationTime('24h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)


        // Set cookie
        const cookieStore = await cookies()
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
        })

        // Login successful
        return response(true, 200, 'Login successful!', loggedInUserData)

    } catch (error) {
        console.error('OTP verification error:', error)
        return catchError(error, "OTP verification failed. Please try again.")
    }
}
