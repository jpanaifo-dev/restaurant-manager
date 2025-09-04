export interface User {
  id: string;
  name: string;
  role: 'admin' | 'waiter' | 'chef';
  email: string;
}
