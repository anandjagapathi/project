export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'owner';
}
