'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { MapPin } from 'lucide-react'

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ''

export default function PlacesAutocomplete({
  value,
  onChange,
  placeholder = 'Search for a venue or address...',
  className = '',
}: PlacesAutocompleteProps) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const acRef     = useRef<google.maps.places.Autocomplete | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Initialise autocomplete once the script is loaded
  useEffect(() => {
    if (!loaded || !inputRef.current || acRef.current) return

    acRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types:                ['establishment', 'geocode'],
      componentRestrictions: { country: 'us' },
      fields:               ['name', 'formatted_address'],
    })

    acRef.current.addListener('place_changed', () => {
      const place = acRef.current?.getPlace()
      if (!place) return
      const parts = [place.name, place.formatted_address].filter(Boolean)
      onChange(parts.join(' — '))
    })
  }, [loaded, onChange])

  return (
    <>
      {/* Load Google Maps Places script only once */}
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => setLoaded(true)}
      />

      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/70 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`pl-9 ${className}`}
          autoComplete="off"
        />
      </div>
    </>
  )
}
