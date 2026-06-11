import { NextResponse } from 'next/server'
import { DELIVERY_BASE, DELIVERY_PER_MILE, DELIVERY_MINIMUM, DELIVERY_MAX_MILES } from '@/lib/menu'

const ORIGIN = '16466 Olive Hill Dr, Winter Garden, FL 34787'

export async function POST(req: Request) {
  try {
    const { address } = await req.json()
    if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 })

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Maps not configured' }, { status: 500 })

    const url = new URL('https://maps.googleapis.com/maps/api/distancematrix/json')
    url.searchParams.set('origins', ORIGIN)
    url.searchParams.set('destinations', address)
    url.searchParams.set('units', 'imperial')
    url.searchParams.set('key', apiKey)

    const res = await fetch(url.toString())
    const data = await res.json()

    const element = data?.rows?.[0]?.elements?.[0]
    if (!element || element.status !== 'OK') {
      return NextResponse.json({ error: 'Could not calculate distance to that address.' }, { status: 422 })
    }

    // Distance in miles (value is in meters)
    const meters = element.distance.value as number
    const miles = meters / 1609.344

    if (miles > DELIVERY_MAX_MILES) {
      return NextResponse.json({
        error: `Sorry, we only deliver within ${DELIVERY_MAX_MILES} miles. Your address is ${Math.round(miles)} miles away.`,
        outOfRange: true,
      }, { status: 422 })
    }

    const fee = Math.max(DELIVERY_MINIMUM, DELIVERY_BASE + miles * DELIVERY_PER_MILE)
    const rounded = Math.ceil(fee * 100) / 100 // round up to nearest cent

    return NextResponse.json({
      miles: Math.round(miles * 10) / 10,
      fee: rounded,
      displayFee: `$${rounded.toFixed(2)}`,
      duration: element.duration.text,
    })
  } catch (err) {
    console.error('delivery-fee error:', err)
    return NextResponse.json({ error: 'Failed to calculate delivery fee' }, { status: 500 })
  }
}
