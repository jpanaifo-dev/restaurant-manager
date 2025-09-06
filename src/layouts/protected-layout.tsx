import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Cargando...
      </div>
    )
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

export default ProtectedLayout
