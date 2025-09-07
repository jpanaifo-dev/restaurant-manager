// src/App.tsx
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/routes'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
      <ToastContainer />
    </>
  )
}

export default App
