import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { user, loading } = useAuth()

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-3xl font-medium text-gray-600">
          Cargando...
        </p>
      </div>
    )
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
