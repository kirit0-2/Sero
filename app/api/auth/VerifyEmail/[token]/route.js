import { connectDB } from "@/lib/Connection";
import { response, catchError } from "@/lib/helper";
import UserModel from "@/models/user.model";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
    try {
        await connectDB()

        // In Next.js 15, params might be a Promise
        const resolvedParams = await params
        const { token } = resolvedParams

        console.log('Received token:', token)
        console.log('Params:', resolvedParams)

        if (!token) {
            return response(false, 400, "Verification token is required")
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY)

        const { payload } = await jwtVerify(token, secret)
        console.log('JWT Payload:', payload)

        let userId = payload.userId

        // Handle malformed userId (buffer object)
        if (typeof userId === 'object' && userId.buffer) {
            console.log('Converting buffer to ObjectId')
            // Convert buffer back to ObjectId string
            const bufferArray = Object.values(userId.buffer)
            userId = Buffer.from(bufferArray).toString('hex')
            // Convert to proper ObjectId format (24 characters)
            if (userId.length === 24) {
                console.log('Converted userId:', userId)
            } else {
                return response(false, 400, "Invalid User ID format")
            }
        }

        if (!isValidObjectId(userId)) {
            console.log('Invalid ObjectId:', userId)
            return response(false, 400, "Invalid User ID")
        }

        const user = await UserModel.findById(userId)

        if (!user) {
            return response(false, 404, "User not found")
        }

        if (user.isEmailVerified) {
            return response(true, 200, "Email already verified")
        }

        user.isEmailVerified = true
        await user.save()

        return response(true, 200, "Email verified successfully")

    } catch (error) {
        console.error('Email verification error:', error)
        if (error.name === 'JWTExpired') {
            return response(false, 400, "Verification link has expired")
        }
        return catchError(error, "Email verification failed")
    }
}