"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useDispatch } from 'react-redux'
import { login, logout } from '@/store/reducer/authReducer'
import { showToast } from '@/lib/showToast'
import { useRouter } from 'next/navigation'

const DebugAuthPage = () => {
  const { user, isAuthenticated, userRole } = useAuth()
  const dispatch = useDispatch()
  const router = useRouter()

  const handleForceAdminRole = () => {
    if (!user) {
      showToast('error', 'No user logged in')
      return
    }

    const updatedUser = {
      ...user,
      role: 'admin'
    }

    dispatch(login(updatedUser))
    showToast('success', 'Role updated to admin in Redux!')
    
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 1000)
  }

  const handleLogout = () => {
    dispatch(logout())
    showToast('success', 'Logged out successfully')
    router.push('/auth/login')
  }

  const handleClearStorage = () => {
    localStorage.clear()
    showToast('success', 'LocalStorage cleared. Please refresh the page.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Auth Debug Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current State */}
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-bold mb-2">Current Auth State:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify({ 
                isAuthenticated, 
                userRole,
                user 
              }, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              onClick={handleForceAdminRole} 
              className="w-full"
              disabled={!isAuthenticated}
            >
              Force Admin Role in Redux
            </Button>

            <Button 
              onClick={handleLogout} 
              variant="destructive"
              className="w-full"
              disabled={!isAuthenticated}
            >
              Logout
            </Button>

            <Button 
              onClick={handleClearStorage} 
              variant="outline"
              className="w-full"
            >
              Clear LocalStorage
            </Button>

            <Button 
              onClick={() => router.push('/admin/dashboard')} 
              variant="secondary"
              className="w-full"
            >
              Try Admin Dashboard
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 p-4 rounded-md text-sm">
            <h4 className="font-bold mb-2">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1">
              <li>Check your current role above</li>
              <li>If role is not 'admin', click "Force Admin Role"</li>
              <li>Then click "Try Admin Dashboard"</li>
              <li>If still issues, logout and login again</li>
            </ol>
          </div>

          {/* LocalStorage Info */}
          <div className="bg-blue-50 p-4 rounded-md text-sm">
            <h4 className="font-bold mb-2">LocalStorage Check:</h4>
            <p>Open browser console and type:</p>
            <code className="block bg-white p-2 rounded mt-2">
              localStorage.getItem('persist:root')
            </code>
            <p className="mt-2">This will show your persisted Redux state.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DebugAuthPage
