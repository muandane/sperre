export type Session = {
  id: string;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  userId: string;
  organizationId: string[];
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}