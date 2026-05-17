'use client'

import { useEffect } from 'react'
import { HERO_VIDEO_CACHE_URLS } from '@/lib/utils'

const STORAGE_KEY = 'wildhaven-hero-videos-warmed-v1'

async function warmVideo(url: string) {
  try {
    const response = await fetch(url, {
      cache: 'force-cache',
      credentials: 'same-origin',
    })

    if (!response.ok) return

    await response.arrayBuffer()
  } catch {
    // Best-effort only.
  }
}

export default function VideoCacheWarmup() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      if (window.localStorage.getItem(STORAGE_KEY) === '1') return
    } catch {
      return
    }

    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean }
    }).connection

    if (connection?.saveData) return

    const run = async () => {
      for (const url of HERO_VIDEO_CACHE_URLS) {
        await warmVideo(url)
      }

      try {
        window.localStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // ignore storage failures
      }
    }

    const schedule = window.requestIdleCallback ?? ((callback: IdleRequestCallback) => window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 } as IdleDeadline), 4000))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout

    const taskId = schedule(() => {
      void run()
    })

    return () => cancel(taskId)
  }, [])

  return null
}