import { connectDB } from "@/lib/Connection";
import { catchError, generateOTP, response } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";
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

        // Check if user exists
        const user = await UserModel.findOne({ 
            deletedAt: null, 
            email: email 
        })
        
        if (!user) {
            return response(false, 404, 'No account found with this email address.')
        }

        if (!user.isEmailVerified) {
            return response(false, 401, 'Email not verified. Please verify your email first.')
        }

        // Generate OTP
        const otp = generateOTP()
        console.log('Password reset OTP:', otp)

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
            'Password Reset Verification Code',
            email, 
            otpEmail(otp)
        )
        
        if (!otpEmailStatus.success) {
            console.error('Failed to send OTP email:', otpEmailStatus.message)
            return response(false, 500, 'Failed to send OTP. Please try again.')
        }

        return response(true, 200, 'OTP sent to your email. Please verify to continue.')

    } catch (error) {
        console.error('Forgot password error:', error)
        return catchError(error, "Failed to process request. Please try again.")
    }
}
