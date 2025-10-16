import { Card } from "@/components/ui/card"
import { Brain, Sparkles } from "lucide-react"

export function DashboardActions() {
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-4xl font-bold text-foreground text-balance">원소의 세계에 오신 것을 환영합니다</h2>
        <p className="text-lg text-muted-foreground text-pretty">퀴즈를 풀거나 나만의 원소를 만들어보세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group relative overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
          <button className="w-full p-8 text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary">
              <Brain className="h-8 w-8 text-primary transition-colors group-hover:text-primary-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-card-foreground">퀴즈 시작하기</h3>
            <p className="text-muted-foreground leading-relaxed">
              원소에 대한 지식을 테스트하고 새로운 것을 배워보세요
            </p>
          </button>
        </Card>

        <Card className="group relative overflow-hidden border-2 transition-all hover:border-accent hover:shadow-lg">
          <button className="w-full p-8 text-left">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 transition-colors group-hover:bg-accent">
              <Sparkles className="h-8 w-8 text-accent transition-colors group-hover:text-accent-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-card-foreground">원소 만들기</h3>
            <p className="text-muted-foreground leading-relaxed">상상력을 발휘하여 나만의 독특한 원소를 디자인하세요</p>
          </button>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-secondary p-4 text-center">
          <div className="mb-1 text-3xl font-bold text-secondary-foreground">118</div>
          <div className="text-sm text-secondary-foreground/70">알려진 원소</div>
        </div>
        <div className="rounded-xl bg-secondary p-4 text-center">
          <div className="mb-1 text-3xl font-bold text-secondary-foreground">∞</div>
          <div className="text-sm text-secondary-foreground/70">가능한 조합</div>
        </div>
        <div className="rounded-xl bg-secondary p-4 text-center">
          <div className="mb-1 text-3xl font-bold text-secondary-foreground">🧪</div>
          <div className="text-sm text-secondary-foreground/70">과학의 즐거움</div>
        </div>
      </div>
    </div>
  )
}
