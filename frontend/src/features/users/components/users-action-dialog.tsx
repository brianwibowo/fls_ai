'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'
import { useCreateUserMutation, useUpdateUserMutation } from '@/hooks/use-api'
import { Loader2, Info } from 'lucide-react'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().optional().catch(''),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 6
    },
    {
      message: 'Password must be at least 6 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const createUser = useCreateUserMutation()
  const updateUser = useUpdateUserMutation()
  const [roleInfoOpen, setRoleInfoOpen] = useState(false)

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
  })

  const onSubmit = async (values: UserForm) => {
    try {
      const name = `${values.firstName} ${values.lastName}`.trim()
      const roleUpper = values.role.toUpperCase()

      if (isEdit) {
        await updateUser.mutateAsync({
          id: currentRow!.id,
          payload: {
            name,
            role: roleUpper,
            phoneNumber: values.phoneNumber,
          },
        })
        toast.success('Pengguna berhasil diperbarui!')
      } else {
        await createUser.mutateAsync({
          name,
          email: values.email,
          role: roleUpper,
          password: values.password,
          phoneNumber: values.phoneNumber,
        })
        toast.success('Pengguna berhasil ditambahkan!')
      }
      form.reset()
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data pengguna.')
    }
  }

  const isPasswordTouched = !!form.formState.dirtyFields.password
  const isLoading = createUser.isPending || updateUser.isPending

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(state) => {
          form.reset()
          onOpenChange(state)
        }}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader className='text-start'>
            <DialogTitle>{isEdit ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            <DialogDescription>
              {isEdit ? 'Perbarui informasi pengguna di sini. ' : 'Buat pengguna baru untuk akses sistem di sini. '}
              Klik simpan setelah selesai.
            </DialogDescription>
          </DialogHeader>
          <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
            <Form {...form}>
              <form
                id='user-form'
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4 px-0.5'
              >
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Nama Depan
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Budi'
                          className='col-span-4'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Nama Belakang
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Setiawan'
                          className='col-span-4'
                          autoComplete='off'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='username'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isEdit}
                          placeholder='budi_setiawan'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isEdit}
                          placeholder='budi@freashday.com'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>No. Telepon</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='081234567890'
                          className='col-span-4'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='role'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>Role</FormLabel>
                      <div className='col-span-4 flex items-center gap-1.5'>
                        <SelectDropdown
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                          placeholder='Pilih Role'
                          className='flex-1'
                          items={roles.map(({ label, value }) => ({
                            label,
                            value,
                          }))}
                        />
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-9 w-9 rounded-full border hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer shrink-0'
                          onClick={() => setRoleInfoOpen(true)}
                          title='Informasi Peran (Role)'
                        >
                          <Info className='h-4 w-4' />
                        </Button>
                      </div>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
                {!isEdit && (
                  <>
                    <FormField
                      control={form.control}
                      name='password'
                      render={({ field }) => (
                        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-end'>
                            Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              placeholder='Minimal 6 karakter'
                              className='col-span-4'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='col-span-4 col-start-3' />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name='confirmPassword'
                      render={({ field }) => (
                        <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                          <FormLabel className='col-span-2 text-end'>
                            Konfirmasi Password
                          </FormLabel>
                          <FormControl>
                            <PasswordInput
                              disabled={!isPasswordTouched}
                              placeholder='Ulangi password'
                              className='col-span-4'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className='col-span-4 col-start-3' />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </form>
            </Form>
          </div>
          <DialogFooter>
            <Button type='submit' form='user-form' disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={roleInfoOpen} onOpenChange={setRoleInfoOpen}>
        <DialogContent className='sm:max-w-[480px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2 text-lg font-bold text-start'>
              <Info className='h-5 w-5 text-emerald-600' />
              Panduan Peran & Hak Akses (Roles)
            </DialogTitle>
            <DialogDescription className='text-start'>
              Penjelasan peran pengguna dan hak akses operasional di dalam platform <strong>Freashday</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-3'>
            {/* Admin */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs shrink-0'>
                AD
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Administrator
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-red-500/30 text-red-500 bg-red-500/5'>Superuser</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Memiliki akses penuh tanpa batas ke seluruh modul sistem. Mengelola akun pengguna (tambah/edit/hapus user), konfigurasi umum sistem, log nudging, analisis performa, dan inventaris.
                </p>
              </div>
            </div>

            {/* Logistics Manager */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0'>
                LM
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Logistics Manager
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-blue-500/30 text-blue-500 bg-blue-500/5'>Operasional</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Berfokus pada pengelolaan pasokan dan inventaris. Memiliki otorisasi untuk menambah batch stok produk, memantau level risiko kedaluwarsa produk, serta menyetujui rekomendasi reorder otomatis.
                </p>
              </div>
            </div>

            {/* Marketing Manager */}
            <div className='flex gap-3 rounded-lg border p-3.5 bg-card hover:border-primary/30 transition-colors text-start'>
              <div className='h-8 w-8 rounded-full bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xs shrink-0'>
                MM
              </div>
              <div className='space-y-1.5'>
                <h4 className='text-sm font-semibold text-foreground flex items-center gap-1.5'>
                  Marketing Manager
                  <Badge variant='outline' className='text-[10px] py-0 px-1 border-green-500/30 text-green-500 bg-green-500/5'>Strategi</Badge>
                </h4>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Berperan untuk menyelamatkan produk yang mendekati masa expired (food loss mitigation). Mengelola dan mengaktifkan strategi digital nudging seperti penawaran diskon kilat, paket bundling, maupun label urgensi di katalog.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setRoleInfoOpen(false)} className='w-full sm:w-auto'>
              Mengerti
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
