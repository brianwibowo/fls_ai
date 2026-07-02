import { type SVGProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='freashday-logo'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      height='24'
      width='24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('size-6', className)}
      {...props}
    >
      <title>Freashday</title>
      {/* Circular arrow (sustainability/cycle) */}
      <path
        d='M21 12a9 9 0 1 1-4.22-7.63'
        stroke='currentColor'
        fill='none'
      />
      <path
        d='M21 3v5h-5'
        stroke='currentColor'
        fill='none'
      />
      {/* Leaf (freshness) */}
      <path
        d='M12 17c-2-4 0-7 4-9-1 4-1 7-2 9'
        stroke='currentColor'
        fill='none'
      />
      <path
        d='M10 15c1.5-2.5 3-4 6-5'
        stroke='currentColor'
        fill='none'
      />
    </svg>
  )
}
