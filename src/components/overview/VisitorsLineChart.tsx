"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import type { HourlyViewPoint } from "@/actions/views";

export function VisitorsLineChart({ data }: { data: HourlyViewPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors — Last 6 Hours</CardTitle>
        <CardDescription>Page and post views grouped by hour</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                className="text-zinc-500 dark:text-zinc-400"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12 }}
                className="text-zinc-500 dark:text-zinc-400"
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ stroke: "currentColor", strokeOpacity: 0.1 }}
                contentStyle={{
                  borderRadius: "0.75rem",
                  border: "1px solid rgb(228 228 231)",
                  fontSize: "0.875rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="rgb(124 58 237)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
