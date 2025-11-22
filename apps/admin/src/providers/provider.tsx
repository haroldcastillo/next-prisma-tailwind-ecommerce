import React from 'react'

import { ModalProvider } from './modal-provider'
import { ThemeProvider } from './theme-provider'
import { ToastProvider } from './toast-provider'

export default function Provider({ children }: { children: React.ReactNode }) {
   return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
         <ToastProvider />
         <ModalProvider />
         {children}
      </ThemeProvider>
   )
}
