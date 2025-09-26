export interface Notification {
  _id: string;
  user: string;
  title: string;
  isRead: boolean;
  details: string;
  type: string;
  createdAt?: string; 
  image?: string;
}
