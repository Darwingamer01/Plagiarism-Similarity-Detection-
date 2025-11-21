import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 pt-[24px]">
          <div className="container max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
