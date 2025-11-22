import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Shield, LogOut, Settings, Lock, Key } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

export default function Header() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    // Clear all queries from the cache
    queryClient.removeQueries()
    // Clear auth state
    logout()
    // Redirect to login
    navigate('/login')
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-8">
        <Link to="/dashboard" className="flex items-center gap-3 font-bold">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl tracking-tight">Plagiarism Detector</span>
        </Link>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full" tooltip="User Menu">
                <Avatar className="h-10 w-10 border-2">
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getInitials(user?.fullName || 'User')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                {user?.hasPassword ? (
                  <Link to="/change-password" className="cursor-pointer">
                    <Lock className="mr-2 h-4 w-4" />
                    <span>Change Password</span>
                  </Link>
                ) : (
                  <Link to="/set-password" className="cursor-pointer">
                    <Key className="mr-2 h-4 w-4" />
                    <span>Set Password</span>
                  </Link>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
