"use client"
import { zSchema } from '@/lib/ZodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { ButtonLoading } from '@/components/Application/buttonLoading'
import { Button } from '@/components/ui/button'

const OTPVerification = ({ email, onSubmit, loading, onResend }) => {
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [resending, setResending] = useState(false)
    const FormSchema = zSchema.pick({
        otp: true
    })

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: ""
        }
    })

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    const handleOtpVerification = async (values) => {
        await onSubmit({ ...values, email })
    }

    const handleResendOTP = async () => {
        try {
            setResending(true)
            await onResend(email)
            setCountdown(60)
            setCanResend(false)
            form.reset()
        } catch (error) {
            console.error('Resend OTP error:', error)
        } finally {
            setResending(false)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8">
                    <div className='mb-3 mt-5'>
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem className='flex flex-col items-center space-y-4'>
                                    <FormLabel className='text-lg font-medium'>Enter OTP</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} className='flex justify-center'>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage className='text-center' />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='space-y-3'>
                        <ButtonLoading
                            loading={loading}
                            type="submit"
                            className="w-full cursor-pointer"
                            text="Verify OTP"
                        />

                        <div className='text-center'>
                            {canResend ? (
                                <Button
                                    type="button"
                                    variant="link"
                                    onClick={handleResendOTP}
                                    disabled={resending}
                                    className="text-primary"
                                >
                                    {resending ? 'Resending...' : 'Resend OTP'}
                                </Button>
                            ) : (
                                <p className='text-sm text-muted-foreground'>
                                    Resend OTP in {countdown}s
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default OTPVerification