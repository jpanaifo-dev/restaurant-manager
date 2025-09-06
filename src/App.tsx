// src/App.tsx
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/routes'

const App = () => {
  return (
    <div>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}

export default App
