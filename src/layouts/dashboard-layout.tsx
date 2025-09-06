import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'
import { ProtectedLayout } from './protected-layout'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <ProtectedLayout>
        <Navbar />
        <div className="min-h-screen flex flex-col py-4 bg-gray-100 text-gray-800 w-full md:py-8 lg:pt-12">
          {children}
        </div>
        <Footer />
      </ProtectedLayout>
    </>
  )
}
