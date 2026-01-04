import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { cn } from '../../lib/utils'

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false) // Close mobile sidebar if screen becomes large
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden md:pl-0">
      <Header onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main
          className={cn(
            "flex-1 overflow-y-auto w-full transition-all duration-300 ease-in-out",
            // On Desktop (lg): content sits next to sidebar
            "lg:pl-64",
            // On Mobile: content is full width (sidebar overlays)
            "pl-0"
          )}
        >
          <div className="p-4 md:p-8 pt-[24px] w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
