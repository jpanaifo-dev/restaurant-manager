import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col py-4 bg-gray-100 text-gray-800 w-full md:py-8 lg:py-12">
        {children}
      </div>
      <Footer />
    </>
  )
}
