import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Button } from "@/components/ui/button"

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold">FinanceTracker</Link>
            <div className="space-x-4">
              <Button asChild variant="ghost">
                <Link to="/">Ingresos</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}