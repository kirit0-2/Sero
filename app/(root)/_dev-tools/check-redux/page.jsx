"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const CheckReduxPage = () => {
  const auth = useAuth()
  const fullState = useSelector((state) => state)
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Redux State Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="font-bold mb-2">useAuth() Hook:</h3>
            <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded">
              {JSON.stringify(auth, null, 2)}
            </pre>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-bold mb-2">Full Redux State:</h3>
            <pre className="text-xs overflow-auto max-h-60 bg-white p-2 rounded">
              {JSON.stringify(fullState, null, 2)}
            </pre>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h3 className="font-bold mb-2">LocalStorage:</h3>
            <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded">
              {typeof window !== 'undefined' 
                ? localStorage.getItem('persist:root') || 'No data'
                : 'Loading...'}
            </pre>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => router.push('/auth/login')} className="flex-1">
              Go to Login
            </Button>
            <Button onClick={() => router.push('/admin/dashboard')} variant="outline" className="flex-1">
              Go to Dashboard
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-bold mb-1">What to check:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Is <code>isAuthenticated</code> true?</li>
              <li>Does <code>user</code> have data?</li>
              <li>Are <code>userName</code> and <code>userEmail</code> populated?</li>
              <li>If not, you need to login first</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CheckReduxPage
