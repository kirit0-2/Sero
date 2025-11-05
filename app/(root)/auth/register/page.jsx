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
import { web_Login } from '@/routes/website'
import axios from 'axios'
import { showToast } from '@/lib/showToast'

// import { FaRegEye } from "react-icons/fa";
// import { FaRegEyeSlash } from "react-icons/fa";
const Register = () => {

  const [loading, setLoading] = useState(false)
  const [isTypePassword] = useState(true)
  const [otpEmail, setOtpEmail] = useState()

  const formSchema = zSchema.pick({
    name: true, email: true, password: true
  }).extend({
    confirmPassword: z.string().min(1, "Confirm password is required")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  })

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true)
      const { data: registerResponse } = await axios.post('/api/auth/register', values)

      if (!registerResponse.success) {
        throw new Error(registerResponse.message)
      }
      setOtpEmail(values.email)
      form.reset()
      showToast('success', registerResponse.message)

    } catch (error) {
      console.error('Registration error:', error)
      // Handle axios error response
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[400px]" >
      <CardContent>
        <div className='flex justify-center'>
          <Image src={Logo} width={150} height={150} alt='logo' className='max-w-[150px]' />
        </div>
        <div className='text-center'>
          <h1 className='text-3xl font-bold'>Create an Account</h1>
          <p>With the right credentials</p>
        </div>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-8">
              <div className='mb-3 mt-5'>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-3'>
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
              <div className='mb-3'>
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type={isTypePassword ? 'password' : 'text'} placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <ButtonLoading loading={loading} type="submit" className="w-full cursor-pointer" text="Create Account" />
              </div>
              <div className='text-center'>
                <div className='flex justify-center items-center gap-1'>
                  <p>Already have an account?</p>
                  <Link href={web_Login} className='text-primary underline'>Login!</Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card >
  )
}

export default Register