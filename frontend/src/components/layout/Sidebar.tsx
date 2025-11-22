import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { LayoutDashboard, Upload, FileText, Search, History, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

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
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-white shadow-sm transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="relative h-full flex flex-col">
        {/* Toggle Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border shadow-md bg-white z-50 hover:bg-gray-100 p-0"
          tooltip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div className="flex-1 overflow-hidden py-6 px-3">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.path}>
                  {isCollapsed ? (
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                              isActive
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'text-muted-foreground hover:text-foreground',
                              isCollapsed && "justify-center px-2"
                            )
                          }
                        >
                          <Icon className="h-5 w-5 shrink-0" />
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                          isActive
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'text-muted-foreground hover:text-foreground',
                          isCollapsed && "justify-center px-2"
                        )
                      }
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="truncate transition-opacity duration-300">
                        {item.label}
                      </span>
                    </NavLink>
                  )}
                  {index === 2 && <Separator className="my-3" />}
                </div>
              )
            })}
          </nav>
        </div>

        <div className="border-t p-4 overflow-hidden">
          <div
            className={cn(
              "rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted cursor-pointer",
              isCollapsed && "p-2 flex justify-center"
            )}
          >
            <NavLink to="/documentation" className={cn("flex items-center", isCollapsed && "justify-center")}>
              {!isCollapsed ? (
                <div>
                  <p className="text-sm font-medium">Need Help?</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Check our documentation
                  </p>
                </div>
              ) : (
                <span className="text-muted-foreground font-bold text-lg">?</span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  )
}
