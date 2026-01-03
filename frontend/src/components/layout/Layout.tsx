import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { cn } from '../../lib/utils'

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      } else {
        setIsCollapsed(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
        <main
          className={cn(
            "flex-1 p-8 pt-[24px] transition-all duration-300 ease-in-out",
            isCollapsed ? "ml-20" : "ml-64"
          )}
        >
          <div className="w-full px-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
