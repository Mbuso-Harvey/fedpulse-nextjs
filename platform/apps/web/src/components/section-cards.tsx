"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon, AlertCircleIcon } from "lucide-react"

export interface DashboardMetrics {
  pipelineValue: number;
  activeContracts: number;
  expiringSoon: number;
  winProbability: number;
}

export function SectionCards({ metrics }: { metrics: DashboardMetrics }) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 1,
      notation: "compact"
    }).format(value);
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pipeline Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatCurrency(metrics.pipelineValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3 mr-1" />
              Active
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Across Capture Pipeline <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Bids & Teaming Opportunities
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Contracts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.activeContracts.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3 mr-1" />
              Tracking
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady contract base <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Top Departments
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expiring Soon</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.expiringSoon}
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/10">
              <AlertCircleIcon className="size-3 mr-1" />
              Watch
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium text-amber-500">
            Action required <AlertCircleIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">High priority renewals</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Avg. Win Probability</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {metrics.winProbability}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon className="size-3 mr-1" />
              High
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Favorable positioning <TrendingUpIcon className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on pWin estimates</div>
        </CardFooter>
      </Card>
    </div>
  )
}
