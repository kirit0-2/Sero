// "use client"
// import { useAuth } from '@/hooks/useAuth'
// import { useRouter } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import Loading from '@/components/Application/Loading'

// const ProtectedAdminRoute = ({ children }) => {
//   const { isAuthenticated, userRole, user } = useAuth()
//   const router = useRouter()
//   const [isChecking, setIsChecking] = useState(true)

//   // TEMPORARY: Set to true to bypass admin check for development
//   // const BYPASS_ADMIN_CHECK = true

//   useEffect(() => {
//     // Add a delay to ensure Redux has rehydrated from localStorage
//     const timer = setTimeout(() => {
//       console.log('=== ADMIN ROUTE CHECK ===')
//       console.log('isAuthenticated:', isAuthenticated)
//       console.log('userRole:', userRole)
//       console.log('user:', user)
//       // console.log('BYPASS_ADMIN_CHECK:', BYPASS_ADMIN_CHECK)
//       console.log('========================')
      
//       if (BYPASS_ADMIN_CHECK) {
//         console.log('⚠️ ADMIN CHECK BYPASSED - DEVELOPMENT MODE')
//         setIsChecking(false)
//         return
//       }
      
//       if (!isAuthenticated) {
//         console.log('❌ Not authenticated, redirecting to login')
//         router.push('/auth/login')
//       } else if (userRole !== 'admin') {
//         console.log('❌ Not admin, redirecting to home. Current role:', userRole)
//         router.push('/')
//       } else {
//         console.log('✅ Admin access granted')
//         setIsChecking(false)
//       }
//     }, 500)

//     return () => clearTimeout(timer)
//   }, [isAuthenticated, userRole, user, router, BYPASS_ADMIN_CHECK])

//   if (BYPASS_ADMIN_CHECK) {
//     if (isChecking) {
//       return <Loading />
//     }
//     return <>{children}</>
//   }

//   if (isChecking || !isAuthenticated || userRole !== 'admin') {
//     return <Loading />
//   }

//   return <>{children}</>
// }

// export default ProtectedAdminRoute
