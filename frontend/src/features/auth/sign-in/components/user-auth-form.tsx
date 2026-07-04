import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import { apiClient } from '@/lib/api-client'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'Masukkan email Anda.' : 'Format email tidak valid.',
  }),
  password: z
    .string()
    .min(1, 'Masukkan password Anda.')
    .min(6, 'Password minimal 6 karakter.'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const res = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password,
      })

      const { access_token, user } = res.data

      auth.setAccessToken(access_token)
      auth.setUser({
        accountNo: user.id,
        name: user.name,
        email: user.email,
        role: [user.role.toLowerCase()],
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })

      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`Selamat datang kembali, ${user.name}!`)
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login gagal. Periksa kembali email dan password Anda.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='admin@freashday.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='••••••••' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          Masuk
        </Button>

        {/* Demo Accounts Quick Login */}
        <div className='mt-2 pt-3.5 border-t border-dashed text-start space-y-2'>
          <div className='text-xs font-semibold text-muted-foreground flex items-center gap-1.5'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
            Akun Uji Coba (Demo Mode)
          </div>
          <div className='grid grid-cols-3 gap-1.5'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='text-[10px] h-7 px-1 text-emerald-600 border-emerald-200 hover:bg-emerald-500/5 cursor-pointer font-medium'
              onClick={() => {
                form.setValue('email', 'admin@freashday.com')
                form.setValue('password', 'admin123')
                form.handleSubmit(onSubmit)()
              }}
            >
              Admin
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='text-[10px] h-7 px-1 text-indigo-600 border-indigo-200 hover:bg-indigo-500/5 cursor-pointer font-medium'
              onClick={() => {
                form.setValue('email', 'logistics@freashday.com')
                form.setValue('password', 'logistics123')
                form.handleSubmit(onSubmit)()
              }}
            >
              Logistics
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='text-[10px] h-7 px-1 text-amber-600 border-amber-200 hover:bg-amber-500/5 cursor-pointer font-medium'
              onClick={() => {
                form.setValue('email', 'marketing@freashday.com')
                form.setValue('password', 'marketing123')
                form.handleSubmit(onSubmit)()
              }}
            >
              Marketing
            </Button>
          </div>
          <p className='text-[10px] text-muted-foreground leading-normal italic'>
            *Klik tombol di atas untuk login instan. Info demo ini akan dihapus di kemudian hari.
          </p>
        </div>
      </form>
    </Form>
  )
}
