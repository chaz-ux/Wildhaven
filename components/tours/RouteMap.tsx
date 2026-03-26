'use client'

import { useEffect, useRef } from 'react'
import type { ItineraryDay, Destination } from '@/lib/types'

interface RouteMapProps {
  days: ItineraryDay[]
  mainDestination: Destination
}

export default function RouteMap({ days, mainDestination }: RouteMapProps) {
  const mapRef  = useRef<HTMLDivElement>(null)
  const mapInst = useRef<unknown>(null)

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token || !mapRef.current || mapInst.current) return

    // Dynamic import to avoid SSR issues
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = token

      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [mainDestination.lng, mainDestination.lat],
        zoom: 6,
        interactive: true,
        attributionControl: false,
      })

      mapInst.current = map

      map.on('load', () => {
        // Custom map colors to match brand
        map.setPaintProperty('background', 'background-color', '#1A1A18')

        // Collect unique destinations from itinerary
        const points = days
          .filter(d => d.destination?.lat && d.destination?.lng)
          .map(d => ({
            day: d.day_number,
            name: d.destination!.name,
            coords: [d.destination!.lng, d.destination!.lat] as [number, number],
          }))

        // Add Nairobi as starting point if Kenya
        const start = mainDestination.country === 'Kenya'
          ? { day: 0, name: 'Nairobi', coords: [36.8219, -1.2921] as [number, number] }
          : { day: 0, name: 'Arusha', coords: [36.6827, -3.3869] as [number, number] }

        const allPoints = [start, ...points]

        // Route line
        if (allPoints.length > 1) {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: allPoints.map(p => p.coords),
              },
              properties: {},
            },
          })

          // Glow line (wider, dim)
          map.addLayer({
            id: 'route-glow',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#C9A84C',
              'line-width': 6,
              'line-opacity': 0.15,
              'line-blur': 4,
            },
          })

          // Main route line
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            paint: {
              'line-color': '#C9A84C',
              'line-width': 1.5,
              'line-opacity': 0.7,
              'line-dasharray': [4, 3],
            },
          })
        }

        // Add markers for each stop
        allPoints.forEach((point) => {
          const el = document.createElement('div')
          el.className = 'map-marker'
          el.style.cssText = `
            width: ${point.day === 0 ? '10px' : '14px'};
            height: ${point.day === 0 ? '10px' : '14px'};
            background: ${point.day === 0 ? 'rgba(201,168,76,0.4)' : '#C9A84C'};
            border: 1.5px solid #C9A84C;
            border-radius: 50%;
            box-shadow: 0 0 ${point.day === 0 ? '0' : '12px'} rgba(201,168,76,0.4);
            cursor: pointer;
          `

          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'map-popup',
            offset: 12,
          }).setHTML(`
            <div style="background:#2E2E2A;border:1px solid rgba(201,168,76,0.2);padding:8px 12px;border-radius:3px;font-family:system-ui;min-width:120px">
              ${point.day > 0 ? `<p style="font-size:10px;color:rgba(201,168,76,0.7);letter-spacing:0.1em;margin:0 0 2px">Day ${point.day}</p>` : ''}
              <p style="font-size:13px;color:#F5F0E8;margin:0;font-weight:400">${point.name}</p>
            </div>
          `)

          new mapboxgl.Marker({ element: el })
            .setLngLat(point.coords)
            .setPopup(popup)
            .addTo(map)

          el.addEventListener('mouseenter', () => popup.addTo(map))
          el.addEventListener('mouseleave', () => popup.remove())
        })

        // Fit bounds to show all points
        if (allPoints.length > 1) {
          const lngs = allPoints.map(p => p.coords[0])
          const lats = allPoints.map(p => p.coords[1])
          map.fitBounds(
            [[Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5],
             [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5]],
            { padding: 60, duration: 1200 }
          )
        }
      })
    })

    return () => {
      if (mapInst.current) {
        (mapInst.current as { remove: () => void }).remove()
        mapInst.current = null
      }
    }
  }, [days, mainDestination])

  return (
    <div className="relative rounded-sm overflow-hidden" style={{ height: '340px' }}>
      <div ref={mapRef} className="w-full h-full" />
      {/* Map overlay label */}
      <div className="absolute top-3 left-3 glass text-[0.62rem] tracking-[0.15em] uppercase text-ivory/50 px-3 py-1.5 rounded-sm z-10">
        Route Map
      </div>
      {/* No token fallback */}
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 bg-charcoal-mid flex items-center justify-center">
          <p className="text-sm text-ivory/30">Add NEXT_PUBLIC_MAPBOX_TOKEN to enable map</p>
        </div>
      )}
    </div>
  )
}
