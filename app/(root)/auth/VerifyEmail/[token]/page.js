"use client"
import axios from "axios"
import { use, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { web_Login } from "@/routes/website"

const EmailVerification = ({ params }) => {
    const router = useRouter()
    const [isVerified, setIsVerified] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Handle params which might be a Promise in Next.js 15
    const resolvedParams = use(params)
    const { token } = resolvedParams
    
    useEffect(() => {
        const verify = async () => {
            try {
                setIsLoading(true)
                console.log('Making API call with token:', token)
                console.log('API URL:', `/api/auth/VerifyEmail/${token}`)
                
                const { data: verificationResponse } = await axios.get(`/api/auth/VerifyEmail/${token}`)
                
                console.log('API Response:', verificationResponse)
                
                if (verificationResponse.success) {
                    setIsVerified(true)
                    // Redirect to home page after 2 seconds
                    setTimeout(() => {
                        router.push('/')
                    }, 2000)
                } else {
                    setError(verificationResponse.message)
                }
            } catch (error) {
                console.error('Verification error:', error)
                console.error('Error response:', error.response?.data)
                setError(error.response?.data?.message || 'Verification failed')
            } finally {
                setIsLoading(false)
            }
        }
        
        if (token) {
            console.log('Token received in component:', token)
            verify()
        } else {
            console.log('No token received')
            setError('No verification token provided')
            setIsLoading(false)
        }
    }, [token])
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="max-w-md mx-auto mt-8 p-6 text-center">
                <div className="mb-4">
                    {isLoading ? (
                        <div className="text-blue-600">
                            <svg className="w-16 h-16 mx-auto mb-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <h2 className="text-2xl font-bold mb-2">Verifying Email...</h2>
                            <p className="text-gray-600">Please wait while we verify your email address.</p>
                        </div>
                    ) : isVerified ? (
                        <div className="text-green-600">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                            <p className="text-gray-600 mb-4">Your email has been successfully verified. Redirecting to home page...</p>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                        </div>
                    ) : (
                        <div className="text-red-600">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                            <p className="text-gray-600 mb-4">{error || 'Unable to verify your email address.'}</p>
                            <Link 
                                href={web_Login} 
                                className="inline-block bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default EmailVerification