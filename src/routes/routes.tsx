// src/Routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
// import TablePage from '../features/tables/TablePage'
import { DashboardLayout } from '../layouts'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el dashboard principal */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />

        {/* Ruta para páginas no encontradas */}
        <Route
          path="*"
          element={
            <div>
              <h2>Página no encontrada</h2>
              <p>La página que buscas no existe.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  )
}

export default AppRoutes
