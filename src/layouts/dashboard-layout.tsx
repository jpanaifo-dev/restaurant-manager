import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
        {children}
      </div>
      <Footer />
    </>
  )
}
