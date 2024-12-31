import { useEffect, useState } from 'react'
import { DataTable } from './data-table'
import type { ColumnDef } from '@tanstack/react-table'
import { getSession } from "@/lib/auth-client"
import type { Session } from 'better-auth/types';

const getUserSession = async (): Promise<Session | null> => {
  const session = await getSession();
  return session?.data?.session ?? null;
};

type Invoice = {
  id: number
  organizationId: string
  status: string
  total: number
  createdAt: string
  updatedAt: string
}

export default function InvoiceTable() {
  const [session, setSession] = useState<Session | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const userSession = await getUserSession()
        console.log('Session data:', userSession) // Debug log
        setSession(userSession)
        if (!userSession?.token) {
          setError('No valid authentication token found')
          setLoading(false)
        }
      } catch (err) {
        setError('Failed to get user session')
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  useEffect(() => {
    if (session?.token) fetchInvoices()
  }, [session])

  const fetchInvoices = async () => {
    try {
      if (!session?.token) {
        throw new Error('No authentication token available');
      }

      console.log('Session details before API call:', session);

      // Assuming the API requires userId
      const userId = session.userId;
      if (!userId) {
        throw new Error('User ID is missing in the session');
      }

      // Include userId as a query parameter
      const response = await fetch(
        `${import.meta.env.PUBLIC_API_URL}/invoices`, 
        {
          headers: {
            'Authorization': `Bearer ${session.token}`,
            'Content-Type': 'application/json',
          },
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API response:', result); // Debug log

      if (result.success) {
        setInvoices(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch invoices');
      }
    } catch (err) {
      console.error('Full error details:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'id',
      header: 'Invoice ID'
    },
    {
      accessorKey: 'organizationId',
      header: 'Organization'
    },
    {
      accessorKey: 'status',
      header: 'Status'
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell({ row }) {
        return <span>{row.original.total}</span>
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell({ row }) {
        return <span>{new Date(row.original.createdAt).toLocaleDateString()}</span>
      }
    }
  ]

  if (!session) return <div className="text-center p-4">Please log in</div>
  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 p-4">{error}</div>

  return <DataTable columns={columns} data={invoices} />
}