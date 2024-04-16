import { ParentProps, onCleanup, onMount } from 'solid-js'
import { Toaster } from 'solid-toast'
import Navbar from './components/navbar'

import { handleAboutBlank } from './lib/settings/aboutblank'
import { handleTabCloak } from './lib/settings/cloak'
import { handlePanicKey } from './lib/settings/panic'
import { handleTheme } from './lib/settings/theme'
import { handleTransport } from './lib/settings/transport'

export default function Layout(props: ParentProps) {
  onMount(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(async (registrations) => {
        for await (let registration of registrations) {
          await registration.unregister()
        }

        navigator.serviceWorker.register('/sw.js').then((registration) => {
          registration.update().then(() => {
            console.log('Service worker registered')
          })
        })

        navigator.serviceWorker.ready.then(async (sw) => {
          console.log('Service worker ready')
          handleTransport()
        })
      })
    }

    handleTabCloak()
    handleTheme()
    handleAboutBlank()
    document.addEventListener('keydown', handlePanicKey)
  })

  onCleanup(() => {
    document.removeEventListener('keydown', handlePanicKey)
  })
  return (
    <div>
      <Navbar />
      <Toaster position="top-center" />
      {props.children}
    </div>
  )
}
