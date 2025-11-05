import { connectDB } from "@/lib/Connection";
import { catchError, generateOTP, response } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/ZodSchema";
import OTPModel from "@/models/Otp.model";
import { otpEmail } from "@/email/otpEmail";

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

        // Generate new OTP
        const otp = generateOTP()
        console.log('Resending OTP:', otp)

        // Delete any existing OTPs for this email
        await OTPModel.deleteMany({ email })

        // Store new OTP in database
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

        return response(true, 200, 'OTP resent successfully to your email.')

    } catch (error) {
        console.error('Resend OTP error:', error)
        return catchError(error, "Failed to resend OTP. Please try again.")
    }
}
