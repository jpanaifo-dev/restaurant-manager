import React from 'react';

const Sidebar: React.FC = () => (
  <aside className="bg-gray-100 w-64 h-full p-4">
    {/* Links de navegación */}
    <ul>
      <li>Mesas</li>
      <li>Pedidos</li>
      <li>Usuarios</li>
      <li>Dashboard</li>
      <li>Menú</li>
    </ul>
  </aside>
);

export default Sidebar;
