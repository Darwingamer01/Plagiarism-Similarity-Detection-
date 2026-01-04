import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { cn } from '../../lib/utils'

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false) // Close mobile sidebar if screen becomes large
      } else {
        // On mobile, we don't care about 'collapsed' state in the same way
        setIsCollapsed(false)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial check
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />
      <div className="flex">
        <Sidebar
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
        <main
          className={cn(
            "flex-1 p-4 md:p-8 pt-[24px] transition-all duration-300 ease-in-out w-full",
            // On Desktop (lg): Apply margin based on collapsed state
            "lg:ml-64",
            isCollapsed && "lg:ml-20",
            // On Mobile: No margin (sidebar is overlay)
            "ml-0"
          )}
        >
          <div className="w-full max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
