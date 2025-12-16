import { emailVerificationLink } from "@/email/emailVerification";
import { connectDB } from "@/lib/Connection";
import { response, catchError } from "@/lib/helper";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/ZodSchema";
import UserModel from "@/models/user.model";
import { SignJWT } from "jose";

export async function POST(request) {
    try {
        await connectDB()
        const validationSchema = zSchema.pick({
            name: true, email: true, password: true
        })

        const payload = await request.json()

        const validatedData = validationSchema.safeParse(payload)

        if (!validatedData.success) {
            return response(false, 400, 'Invalid or missing input field.',
                validatedData.error.errors)
        }

        const { name, email, password } = validatedData.data

        const checkUser = await UserModel.exists({ email })
        if (checkUser) {
            return response(false, 409, "User already exists!")
        }

        const newRegistration = new UserModel({
            name, email, password
        })

        await newRegistration.save()

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const userId = newRegistration._id.toString()
        console.log('Creating JWT with userId:', userId)
        const token = await new SignJWT({ userId })
            .setIssuedAt()
            .setExpirationTime('1h')
            .setProtectedHeader({ alg: 'HS256' })
            .sign(secret)

        const emailResult = await sendMail(
            'Email verification request from Sero',
            email,
            emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/VerifyEmail/${token}`)
        )

        if (!emailResult.success) {
            console.error('Failed to send verification email:', emailResult.message)
            // Still return success but mention email issue
            return response(true, 201, "Registration successful! However, there was an issue sending the verification email. Please contact support.")
        }

        return response(true, 201, "Registration Success! Please check your email to verify your account.")

    } catch (error) {
        console.error('Registration error:', error)
        return catchError(error, "Registration failed. Please try again.")
    }
}