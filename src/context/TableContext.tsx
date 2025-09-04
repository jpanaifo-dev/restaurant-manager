// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { Table } from '../types/table';

// interface TableContextType {
//   tables: Table[];
//   setTables: (tables: Table[]) => void;
// }

// const TableContext = createContext<TableContextType | undefined>(undefined);

// export const TableProvider = ({ children }: { children: ReactNode }) => {
//   const [tables, setTables] = useState<Table[]>([]);

//   return (
//     <TableContext.Provider value={{ tables, setTables }}>
//       {children}
//     </TableContext.Provider>
//   );
// };

// export const useTable = () => {
//   const context = useContext(TableContext);
//   if (!context) throw new Error('useTable must be used within TableProvider');
//   return context;
// };
