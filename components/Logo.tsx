'use client'

import Image from 'next/image'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

const SIZES = {
  sm: { width: 110, height: 118 },
  md: { width: 150, height: 160 },
  lg: { width: 200, height: 214 },
}

export default function Logo({ variant = 'dark', size = 'md' }: LogoProps) {
  const src = variant === 'light' ? '/logo-white.png' : '/logo-dark.png'
  const { width, height } = SIZES[size]

  return (
    <Image
      src={src}
      alt="Karlota Gourmet"
      width={width}
      height={height}
      className="object-contain"
      priority
    />
  )
}
