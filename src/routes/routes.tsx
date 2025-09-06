// src/Routes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TablesPage, TablesView } from '../pages/tables'
import { CategoriesPage, ProductsPage } from '../pages/products'
import { DashboardLayout } from '../layouts'
import { APP_URL } from '../libs/config.url'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para el dashboard principal */}
        <Route
          path="/"
          element={
            <DashboardLayout>
              <TablesView />
            </DashboardLayout>
          }
        />
        {/* Ruta para la página de tablas */}
        <Route
          path={APP_URL.TABLES.BASE}
          element={
            <DashboardLayout>
              <TablesPage />
            </DashboardLayout>
          }
        />
        {/* Ruta para la página de Productos */}
        <Route
          path={APP_URL.MENUS.BASE}
          element={
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          }
        />

        {/* Ruta para la página de categorías */}
        <Route
          path={APP_URL.MENUS.CATEGORIES}
          element={
            <DashboardLayout>
              <CategoriesPage />
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
