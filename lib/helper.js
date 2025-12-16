import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";


export const response = (success, statusCode, message, data = {}) => {
    return NextResponse.json({
        success, statusCode, message, data
    }, { status: statusCode })
}

export const catchError = (error, customMessage) => {
    if (error.code === 11000) {
        const keys = Object.keys(error.keyPattern).join(',')
        error.message = `Duplicate fields: ${keys}. These fields value must be Unique.`
    }

    let errorObj = {}

    if (process.env.NODE_ENV === "development") {
        errorObj = {
            message: error.message,
            error
        }
    }
    else {
        errorObj = {
            message: customMessage || "Internal server error."
        }
    }
    return response(false, error.statusCode || 500, errorObj.message, errorObj.error)
}

export const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    return otp
}

export const isAuthenticated = async (role) => {
    try {
        const cookieStore = await cookies()
        if (!cookieStore.has('token')) {
            return {
                isAuth: false
            }
        }
        const token = cookieStore.get('token')
        const { payload } = await jwtVerify(token.value, new TextEncoder().encode(process.env.SECRET_KEY))

        if (role && payload.role !== role) {
            return {
                isAuth: false,
            }
        }

        return {
            isAuth: true,
            userId: payload.id
        }
    } catch (error) {
        return {
            isAuth: false,
            error
        }
    }
}