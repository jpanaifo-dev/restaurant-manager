import React from 'react';
import type { Table } from '../../types/table';

type TableProps = {
  tables: Table[];
};

const TableList: React.FC<TableProps> = ({ tables }) => (
  <table className="w-full border">
    <thead>
      <tr>
        <th>#</th>
        <th>Estado</th>
        <th>Asientos</th>
      </tr>
    </thead>
    <tbody>
      {tables.map((table) => (
        <tr key={table.id}>
          <td>{table.number}</td>
          <td>{table.status}</td>
          <td>{table.seats}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TableList;
