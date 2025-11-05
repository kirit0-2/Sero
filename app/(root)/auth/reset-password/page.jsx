"use client"
import React, { useState } from 'react'
import Image from 'next/image'
import Logo from '@/public/assets/images/logo-black.png'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { zSchema } from '@/lib/ZodSchema'
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ButtonLoading } from '@/components/Application/buttonLoading'
import { z } from 'zod'
import Link from 'next/link'
import { web_Login } from '@/routes/website'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPVerification'
import { useRouter } from 'next/navigation'

const ResetPassword = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [userEmail, setUserEmail] = useState("")

  // Step 1: Email Form
  const emailFormSchema = zSchema.pick({ email: true })
  const emailForm = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "" }
  })

  // Step 3: New Password Form
  const passwordFormSchema = zSchema.pick({ password: true }).extend({
    confirmPassword: z.string().min(1, "Confirm password is required")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  // Step 1: Request OTP
  const handleEmailSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: response } = await axios.post('/api/auth/forgot-password', values)

      if (!response.success) {
        throw new Error(response.message)
      }

      setUserEmail(values.email)
      setStep(2)
      showToast('success', response.message)

    } catch (error) {
      console.error('Forgot password error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Failed to send OTP')
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  const handleOTPSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: response } = await axios.post('/api/auth/verify-reset-otp', values)

      if (!response.success) {
        throw new Error(response.message)
      }

      setStep(3)
      showToast('success', 'OTP verified! Please enter your new password.')

    } catch (error) {
      console.error('OTP verification error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'OTP verification failed')
      }
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
  const handlePasswordSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: response } = await axios.post('/api/auth/reset-password', {
        email: userEmail,
        password: values.password
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      showToast('success', 'Password reset successfully! Redirecting to home...')
      passwordForm.reset()
      
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)

    } catch (error) {
      console.error('Reset password error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Failed to reset password')
      }
    } finally {
      setLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async (email) => {
    try {
      const { data: response } = await axios.post('/api/auth/forgot-password', { email })

      if (!response.success) {
        throw new Error(response.message)
      }

      showToast('success', response.message)

    } catch (error) {
      console.error('Resend OTP error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Failed to resend OTP')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card className="w-[400px]">
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo} width={150} height={150} alt='logo' className='max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>
            {step === 1 && 'Reset Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'New Password'}
          </h1>
          <p>
            {step === 1 && 'Enter your email to receive OTP'}
            {step === 2 && 'Enter the OTP sent to your email'}
            {step === 3 && 'Enter your new password'}
          </p>
        </div>

        <div>
          {/* Step 1: Email Form */}
          {step === 1 && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-8">
                <div className='mb-3 mt-5'>
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                    <ButtonLoading 
                      loading={loading} 
                      type="submit" 
                      className="w-full cursor-pointer" 
                      text="Send OTP" 
                  />
                </div>
                <div className='text-center'>
                  <Link href={web_Login} className='text-primary underline'>
                    Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
              <OTPVerification 
                email={userEmail} 
                onSubmit={handleOTPSubmit} 
              loading={loading}
              onResend={handleResendOTP}
            />
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-8">
                <div className='mb-3 mt-5'>
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-3'>
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm new password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                    <ButtonLoading 
                      loading={loading} 
                      type="submit" 
                      className="w-full cursor-pointer" 
                      text="Reset Password" 
                  />
                </div>
              </form>
            </Form>
          )}
        </div>
      </CardContent>
    </Card>
    </div>
  )
}

export default ResetPassword