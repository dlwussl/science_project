import { Button } from "@/components/ui/button"
import { LogOut, Atom } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Atom className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">나만의 원소 만들기</h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </Button>
      </div>
    </header>
  )
}
