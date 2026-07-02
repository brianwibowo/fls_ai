import { Link, useSearch } from '@tanstack/react-router'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      {/* Left Column: Visual UI / Branding */}
      <div
        className={cn(
          'relative h-full overflow-hidden max-lg:hidden flex flex-col justify-between p-10 text-white border-r border-border/10'
        )}
      >
        {/* Background Image of Agriculture */}
        <div
          className='absolute inset-0 bg-cover bg-center transition-all duration-1000'
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1000')`,
          }}
        />

        {/* Gradient Overlay to ensure text readability */}
        <div className='absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/75 to-emerald-900/60' />

        {/* Brand header */}
        <div className='relative z-20 flex items-center gap-2 text-lg font-medium'>
          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-emerald-950 font-bold'>
            <Leaf className='h-5 w-5' />
          </div>
          <span className='font-bold tracking-tight'>Freashday</span>
        </div>

        {/* Branding content */}
        <div className='relative z-20 my-auto w-full max-w-lg flex flex-col gap-4 text-start'>
          <h1 className='text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight drop-shadow-md text-emerald-50'>
            Fresh Food Supply Chain & Logistics
          </h1>
          <p className='text-emerald-100/90 text-sm leading-relaxed max-w-md drop-shadow-xs'>
            Sistem manajemen rantai pasok berbasis kecerdasan buatan (AI) untuk mengoptimalkan stok, memprediksi permintaan secara presisi, dan memitigasi food waste.
          </p>
        </div>

        {/* Footer info */}
        <div className='relative z-20 text-xs text-emerald-300/80 drop-shadow-xs'>
          © {new Date().getFullYear()} Freashday Food Logistics System. Powered by AI.
        </div>
      </div>

      {/* Right Column: Form Input */}
      <div className='lg:p-8 flex items-center justify-center w-full h-full bg-background'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 max-w-sm p-6 sm:p-8 border rounded-xl shadow-md bg-card'>
          <div className='flex flex-col space-y-2 text-start'>
            <h2 className='text-2xl font-bold tracking-tight text-foreground'>Masuk ke Akun</h2>
            <p className='text-sm text-muted-foreground'>
              Masukkan email dan password untuk mengakses dashboard sistem.
            </p>
          </div>

          <UserAuthForm redirectTo={redirect} />

          <div className='flex flex-col gap-2.5 pt-4 border-t border-border/40 text-xs text-muted-foreground'>
            <div className='flex justify-between items-center'>
              <span>Lupa password?</span>
              <Link
                to='/forgot-password'
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'
              >
                Atur Ulang
              </Link>
            </div>
            <div className='flex justify-between items-center'>
              <span>Belum punya akun?</span>
              <Link
                to='/sign-up'
                className='font-semibold text-primary underline underline-offset-4 hover:text-primary/80'
              >
                Daftar Baru
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
