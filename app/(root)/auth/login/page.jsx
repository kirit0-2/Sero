"use client"
import React from 'react'
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
import z from 'zod'
import { useState } from 'react'
import Link from 'next/link'
import { web_Register, web_ResetPass } from '@/routes/website'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import OTPVerification from '@/components/Application/OTPVerification'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { useRouter } from 'next/navigation'

// import { FaRegEye } from "react-icons/fa";
// import { FaRegEyeSlash } from "react-icons/fa";


const LoginPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [isTypePassword] = useState(true)
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const formSchema = zSchema.pick({
    email: true
  }).extend({
    password: z.string().min(3, 'Password field is required.')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleLoginSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: loginResponse } = await axios.post('/api/auth/login', values)

      if (!loginResponse.success) {
        throw new Error(loginResponse.message)
      }

      // Check if OTP is required
      if (loginResponse.data?.requiresOTP) {
        setUserEmail(loginResponse.data.email)
        setShowOTPForm(true)
        showToast('info', loginResponse.message)
      } else {
        form.reset()
        showToast('success', loginResponse.message)
      }


    } catch (error) {
      console.error('Login error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: otpResponse } = await axios.post('/api/auth/verifyOtp', values)

      if (!otpResponse.success) {
        throw new Error(otpResponse.message)
      }

      // Store user data in Redux
      dispatch(login(otpResponse.data))

      showToast('success', otpResponse.message)
      form.reset()
      setShowOTPForm(false)
      
      // Redirect to dashboard or home page
      router.push('/')

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

  const handleResendOTP = async (email) => {
    try {
      const { data: resendResponse } = await axios.post('/api/auth/resendOtp', { email })

      if (!resendResponse.success) {
        throw new Error(resendResponse.message)
      }

      showToast('success', resendResponse.message)

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
    <Card className="w-[400px]" >
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo} width={150} height={150} alt='logo' className='max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>{showOTPForm ? 'Verify OTP' : 'Login Into Account'}</h1>
          <p>{showOTPForm ? 'Enter the OTP sent to your email' : 'With the right credentials'}</p>
        </div>
        <div>
          {showOTPForm ? (
            <OTPVerification 
              email={userEmail} 
              onSubmit={handleOTPSubmit} 
              loading={loading}
              onResend={handleResendOTP}
            />
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLoginSubmit)} className="space-y-8">
              <div className='mb-3 mt-5'>
                <FormField
                  control={form.control}
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
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type={isTypePassword ? 'password' : 'text'} placeholder="Enter your password" {...field} />
                      </FormControl>
                      {/* <button type='button'>
                        {isTypePassword ? 
                          <FaRegEyeSlash/>
                          :
                          <FaRegEye/>
                        }
                      </button> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <ButtonLoading loading={loading} type="submit" className="w-full cursor-pointer" text="Login" />
              </div>
              <div className='text-center'>
                <div className='flex justify-center items-center gap-1'>
                  <p> Don't have an account?</p>
                  <Link href={web_Register} className='text-primary underline'>Create account!</Link>
                </div>
                <div>
                  <Link href={web_ResetPass} className='text-primary underline'>Forgot Password?</Link>
                </div>
              </div>
            </form>
          </Form>
          )}
        </div>
      </CardContent>
    </Card >
  )
}

export default LoginPage