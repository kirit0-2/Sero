import { connectDB } from "@/lib/Connection";
import { catchError, generateOTP, response } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";
import OTPModel from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";
import { z } from "zod";

export async function POST(request) {
    try {
        await connectDB()
        const payload = await request.json()

        const validationSchema = zSchema.pick({
            email: true
        }).extend({
            password: z.string().min(1, 'Password is required')
        })

        const validationData = validationSchema.safeParse(payload)
        if (!validationData.success) {
            return response(false, 400, 'Invalid or missing input field.',
                validationData.error.errors)
        }

        const { email, password } = validationData.data

        const getUser = await UserModel.findOne({ 
            deletedAt: null, 
            email: email 
        }).select("+password")
        
        if (!getUser) {
            return response(false, 401, 'Invalid login credentials.')
        }

        if (!getUser.isEmailVerified) {
            return response(false, 401, 'Email not verified. Please check your email and verify your account first.')
        }

        const isPasswordVerified = await getUser.comparePassword(password)
        if (!isPasswordVerified) {
            return response(false, 401, 'Invalid login credentials.')
        }

        // Generate OTP
        const otp = generateOTP()
        console.log('Generated OTP:', otp)

        // Delete any existing OTPs for this email
        await OTPModel.deleteMany({ email })

        // Store OTP in database
        const newOtpData = new OTPModel({
            email,
            otp
        })
        await newOtpData.save()

        // Send OTP email
        const otpEmailStatus = await sendMail(
            'Your login verification code',
            email, 
            otpEmail(otp)
        )
        
        if (!otpEmailStatus.success) {
            console.error('Failed to send OTP email:', otpEmailStatus.message)
            return response(false, 500, 'Failed to send OTP. Please try again.')
        }

        return response(true, 200, 'OTP sent to your email. Please verify to continue.', {
            requiresOTP: true,
            email: email
        })

    } catch (error) {
        console.error('Login error:', error)
        return catchError(error, "Login failed. Please try again.")
    }
}

