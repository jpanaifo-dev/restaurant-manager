import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { ProtectedLayout } from './protected-layout'
import { useAuth } from '../hooks/useAuth'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userDetails, logout } = useAuth()

  return (
    <>
      <ProtectedLayout>
        <Navbar
          avatarSrc={userDetails?.profile_image || undefined}
          userName={userDetails?.username || 'User'}
          userEmail={userDetails?.email || undefined}
          menuItems={[
            { key: 'profile', label: 'Perfil', href: '/perfil' },
            { key: 'settings', label: 'Configuración', href: '/configuracion' },
            { key: 'logout', label: 'Salir', onClick: () => logout() },
          ]}
        />
        <div className="min-h-screen flex flex-col py-4 bg-gray-100 text-gray-800 w-full md:py-8 lg:pt-12">
          {children}
        </div>
        <Footer />
      </ProtectedLayout>
    </>
  )
}
