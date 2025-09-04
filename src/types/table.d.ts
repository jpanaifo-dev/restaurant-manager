export interface Table {
  id: string;
  number: number;
  status: 'available' | 'occupied' | 'reserved';
  seats: number;
}
