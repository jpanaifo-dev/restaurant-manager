// src/Routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardPage from '../pages/DashboardPage'
import TablePage from '../features/tables/TablePage'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/about" element={<TablePage />} />
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
