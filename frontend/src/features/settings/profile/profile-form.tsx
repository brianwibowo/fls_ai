import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'
import { toast } from 'sonner'

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Nama harus minimal 2 karakter.')
    .max(50, 'Nama tidak boleh lebih dari 50 karakter.'),
  email: z.string().email(),
  role: z.string(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export function ProfileForm() {
  const { auth } = useAuthStore()
  const currentUser = auth.user

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      role: currentUser?.role?.[0]?.toUpperCase() || 'USER',
    },
  })

  function onSubmit(_data: ProfileFormValues) {
    toast.success('Profil berhasil disimpan! (Simulasi Lokal)')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 max-w-md text-start'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder='Nama Anda' {...field} />
              </FormControl>
              <FormDescription>
                Nama ini digunakan sebagai identitas publik Anda di sistem.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormDescription>
                Alamat email Anda terikat pada hak akses login dan tidak dapat diubah secara mandiri.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role / Hak Akses</FormLabel>
              <FormControl>
                <Input disabled {...field} />
              </FormControl>
              <FormDescription>
                Hak akses Anda saat ini ditentukan oleh Administrator.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='mt-2'>Simpan Profil</Button>
      </form>
    </Form>
  )
}
