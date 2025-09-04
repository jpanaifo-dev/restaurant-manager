export interface Order {
  id: string;
  tableId: string;
  products: Product[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}
