import { useSelector } from 'react-redux'

export const useAuth = () => {
    const auth = useSelector((state) => state.authStore.auth)
    
    return {
        user: auth,
        isAuthenticated: !!auth,
        userId: auth?.id,
        userName: auth?.name,
        userEmail: auth?.email,
        userRole: auth?.role
    }
}
