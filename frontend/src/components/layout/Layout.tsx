import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { cn } from '../../lib/utils'

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false)

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
          <div className="container max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
