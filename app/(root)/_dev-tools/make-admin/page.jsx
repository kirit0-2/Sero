"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { showToast } from '@/lib/showToast'
import { useAuth } from '@/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { login } from '@/store/reducer/authReducer'

const MakeAdminPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const dispatch = useDispatch()

  const handleMakeAdmin = async (e) => {
    e.preventDefault()
    
    if (!email) {
      showToast('error', 'Please enter an email address')
      return
    }

    try {
      setLoading(true)
      const { data: response } = await axios.post('/api/auth/make-admin', { email })

      if (!response.success) {
        throw new Error(response.message)
      }

      showToast('success', response.message)
      
      // If updating current user, update Redux
      if (user?.email === email) {
        dispatch(login(response.data.user))
        showToast('info', 'Your role has been updated. Redirecting...')
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 2000)
      }

      setEmail('')

    } catch (error) {
      console.error('Make admin error:', error)
      if (error.response?.data?.message) {
        showToast('error', error.response.data.message)
      } else {
        showToast('error', error.message || 'Failed to make admin')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Make User Admin
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMakeAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {user && (
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Current User:</strong> {user.email}
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Current Role:</strong> {user.role || 'user'}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Make Admin'}
            </Button>

            <div className="text-sm text-gray-600 text-center">
              <p>⚠️ Development Tool Only</p>
              <p>This will grant admin access to the specified user.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default MakeAdminPage
