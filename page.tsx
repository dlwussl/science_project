import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardActions } from "@/components/dashboard-actions"
import { DashboardFooter } from "@/components/dashboard-footer"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <DashboardActions />
      </main>
      <DashboardFooter />
    </div>
  )
}
