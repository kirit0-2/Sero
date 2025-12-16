"use client"
import React, { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/store/reducer/authReducer'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'

const FixAdminPage = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const authState = useSelector((state) => state.authStore)

  useEffect(() => {
    console.log('Current Redux State:', authState)
  }, [authState])

  const handleFixAdmin = () => {
    // Get current user from Redux
    const currentUser = authState?.auth

    if (!currentUser) {
      showToast('error', 'No user found in Redux. Please login first.')
      router.push('/auth/login')
      return
    }

    // Update user with admin role
    const updatedUser = {
      ...currentUser,
      role: 'admin'
    }

    console.log('Updating Redux with:', updatedUser)
    
    // Dispatch to Redux
    dispatch(login(updatedUser))
    
    showToast('success', 'Admin role set! Redirecting...')
    
    // Force page reload to ensure Redux persist saves
    setTimeout(() => {
      window.location.href = '/admin/dashboard'
    }, 1000)
  }

  const handleCheckState = () => {
    console.log('=== REDUX STATE ===')
    console.log('Full State:', authState)
    console.log('User:', authState?.auth)
    console.log('Role:', authState?.auth?.role)
    console.log('==================')
    
    alert(`Current Role: ${authState?.auth?.role || 'No user logged in'}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Fix Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-bold mb-2">Current User:</h3>
            <pre className="text-xs overflow-auto max-h-40">
              {JSON.stringify(authState?.auth, null, 2)}
            </pre>
          </div>

          <Button 
            onClick={handleFixAdmin} 
            className="w-full"
            size="lg"
          >
            Set Admin Role & Go to Dashboard
          </Button>

          <Button 
            onClick={handleCheckState} 
            variant="outline"
            className="w-full"
          >
            Check Console State
          </Button>

          <div className="bg-yellow-50 p-3 rounded-md text-sm">
            <p className="font-bold mb-1">Instructions:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Make sure you're logged in</li>
              <li>Click "Set Admin Role"</li>
              <li>You'll be redirected to admin dashboard</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FixAdminPage
