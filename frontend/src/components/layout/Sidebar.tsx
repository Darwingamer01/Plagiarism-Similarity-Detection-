import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/utils'
import { LayoutDashboard, Upload, FileText, Search, History, Settings } from 'lucide-react'
import { Separator } from '../ui/separator'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/similarity-check', label: 'Check Similarity', icon: Search },
  { path: '/history', label: 'History', icon: History },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white shadow-sm">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon
              return (
                <div key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent',
                        isActive
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </NavLink>
                  {index === 2 && <Separator className="my-3" />}
                </div>
              )
            })}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="rounded-lg bg-muted/50 p-4 transition-colors hover:bg-muted cursor-pointer">
            <NavLink to="/documentation">
              <p className="text-sm font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check our documentation for guides and tutorials
              </p>
            </NavLink>
          </div>
        </div>
      </div>
    </aside>
  )
}
