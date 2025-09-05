// src/pages/DashboardPage.tsx
import React from 'react'
import { TableCard } from '../../components/app'
import { type TableCardProps } from '../../components/app/TableCard'

export const DashboardPage: React.FC = () => {
  // Datos de prueba
  const data: TableCardProps[] = [
    {
      id: '001',
      status: 'occupied',
      startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 min
      amountPEN: 44.63,
      managerName: 'Akira',
      href: '/tables/001',
    },
    {
      id: '002',
      status: 'free',
      href: '/tables/002',
    },
    {
      id: '003',
      status: 'reserved',
      startTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 min
      managerName: 'Lucía',
      amountPEN: 0,
      href: '/tables/003',
    },
    {
      id: '004',
      status: 'occupied',
      startTime: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // 1h 5m
      amountPEN: 120.5,
      managerName: 'Diego',
      href: '/tables/004',
    },
    {
      id: '005',
      status: 'free',
      href: '/tables/005',
    },
    {
      id: '006',
      status: 'occupied',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h
      amountPEN: 80.0,
      managerName: 'Mara',
      href: '/tables/006',
    },
    {
      id: '007',
      status: 'reserved',
      startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 min
      managerName: 'Bruno',
      href: '/tables/007',
    },
    {
      id: '008',
      status: 'free',
      href: '/tables/008',
    },
    {
      id: '009',
      status: 'occupied',
      startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min
      amountPEN: 35.5,
      managerName: 'Juan',
      href: '/tables/009',
    },
    {
      id: '010',
      status: 'reserved',
      startTime: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min
      managerName: 'Ana',
      href: '/tables/010',
    },
  ]

  return (
    <div className="p-4 w-full max-w-6xl">
      <h1 className="mb-4 text-2xl font-bold">Dashboard de Estadísticas</h1>

      {/* Grid de 5 en pantallas XL, responsive en menores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {data.map((t) => (
          <TableCard key={t.id} {...t} />
        ))}
      </div>
    </div>
  )
}
