'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type User } from '../data/schema'
import { useDeleteUserMutation } from '@/hooks/use-api'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const deleteUser = useDeleteUserMutation()

  const handleDelete = async () => {
    if (value.trim() !== currentRow.username) return

    try {
      await deleteUser.mutateAsync(currentRow.id)
      toast.success('Pengguna berhasil dinonaktifkan!')
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menonaktifkan pengguna.')
    }
  }

  const isLoading = deleteUser.isPending

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      form='users-delete-form'
      disabled={value.trim() !== currentRow.username || isLoading}
      title={
        <span className='text-destructive flex items-center gap-1.5'>
          <AlertTriangle className='stroke-destructive' size={18} />
          Nonaktifkan User
        </span>
      }
      desc={
        <form
          id='users-delete-form'
          onSubmit={(e) => {
            e.preventDefault()
            handleDelete()
          }}
          className='space-y-4 text-start'
        >
          <p className='mb-2'>
            Apakah Anda yakin ingin menonaktifkan user{' '}
            <span className='font-bold'>{currentRow.username}</span>?
            <br />
            Langkah ini akan menonaktifkan akses masuk sistem untuk user dengan role{' '}
            <span className='font-bold'>
              {currentRow.role.toUpperCase()}
            </span>.
          </p>

          <Label className='my-2'>
            Username:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Masukkan username untuk konfirmasi.'
              autoFocus
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Peringatan!</AlertTitle>
            <AlertDescription>
              User yang dinonaktifkan tidak akan dapat masuk kembali ke sistem sebelum diaktifkan ulang oleh Admin.
            </AlertDescription>
          </Alert>
        </form>
      }
      confirmText={
        <div className='flex items-center gap-1.5'>
          {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
          Nonaktifkan
        </div>
      }
      destructive
    />
  )
}
