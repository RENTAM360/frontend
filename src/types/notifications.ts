export interface Notification {
  _id: string;
  user: string;
  title: string;
  isRead: boolean;
  details: string;
  type?: string;
  createdAt?: string; 
  updatedAt?: string; 
  image?: string;
  meta?: {
    bookingId?: string;
    [key: string]: any;
  };
}
