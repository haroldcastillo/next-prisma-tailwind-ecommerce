import { ThemeProvider } from 'next-themes'
import * as React from 'react'

import { ModalProvider } from './modal-provider'
import QueryProvider from './query-provider'
import { ToastProvider } from './toast-provider'

export default function Provider({ children }: { children: React.ReactNode }) {
   return (
      <QueryProvider>
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ToastProvider />
            <ModalProvider />
            {children}
         </ThemeProvider>
      </QueryProvider>
   )
}
