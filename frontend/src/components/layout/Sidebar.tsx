import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { LayoutDashboard, Upload, FileText, Search, History, Settings, ChevronLeft, ChevronRight, X, HelpCircle } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { useEffect } from 'react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/similarity-check', label: 'Check Similarity', icon: Search },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
  isMobileOpen?: boolean
  setIsMobileOpen?: (open: boolean) => void
}

export default function Sidebar({ isCollapsed, toggleSidebar, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    if (setIsMobileOpen) {
      setIsMobileOpen(false)
    }
  }, [location.pathname, setIsMobileOpen])

  // Common Nav Content
  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            const linkClass = cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                : 'text-gray-600 hover:text-foreground hover:bg-gray-100',
              isCollapsed && "lg:justify-center lg:px-2", // Only center on desktop collapsed
              isCollapsed && !isActive && "lg:bg-gray-50/50"
            )

            return (
              <div key={item.path}>
                {isCollapsed ? (
                  // Tooltip only for collapsed desktop view
                  <div className="hidden lg:block">
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <Link
                          to={item.path}
                          className={linkClass}
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}

                {/* Regular Link (Mobile or Expanded Desktop) */}
                <Link
                  to={item.path}
                  className={cn(linkClass, isCollapsed && "hidden lg:flex")} // Hide duplicate on collapsed desktop
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate transition-opacity duration-300">
                    {item.label}
                  </span>
                </Link>
                {index === 2 && <Separator className="my-3" />}
              </div>
            )
          })}
        </nav>
      </div>

      <div className="border-t p-4">
        <div
          className={cn(
            "rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted cursor-pointer",
            isCollapsed && "lg:p-2 lg:flex lg:justify-center"
          )}
        >
          <Link to="/dashboard/documentation" className={cn("flex items-center gap-3", isCollapsed && "lg:justify-center")}>
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium">Need Help?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check our documentation
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay & Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden transition-opacity duration-300",
        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileOpen?.(false)}
        />
        {/* Sidebar Panel */}
        <aside className={cn(
          "absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-bold text-lg">Menu</span>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen?.(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <NavContent />
        </aside>
      </div>

      {/* Desktop Sidebar (Persistent) */}
      <aside
        className={cn(
          "hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-white shadow-sm transition-all duration-300 ease-in-out z-40 flex-col",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Desktop Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-8 h-6 w-6 rounded-full border shadow-md bg-white z-50 hover:bg-gray-100 p-0"
          tooltip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <NavContent />
      </aside>
    </>
  )
}
