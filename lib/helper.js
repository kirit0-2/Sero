import { NextResponse } from "next/server";

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
    } else {
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
