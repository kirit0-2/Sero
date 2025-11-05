import nodemailer from 'nodemailer'

export const sendMail = async (subject, to, body) => {
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS,
        }
    })
    
    const options = {
        from: `"Sero" <${process.env.NODEMAILER_EMAIL}>`,
        to: to,
        subject: subject,
        html: body
    }

    try {
        console.log('Sending email to:', to)
        const result = await transporter.sendMail(options)
        console.log('Email sent successfully:', result.messageId)
        return { success: true, messageId: result.messageId }
    } catch (error) {
        console.error('Email sending failed:', error)
        return { success: false, message: error.message }
    }
}