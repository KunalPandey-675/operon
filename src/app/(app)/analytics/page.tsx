import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-6 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Analytics</h1>
        <p className="text-gray-500">High-level insights for your workspace performance.</p>
      </div>

      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" /> Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Analytics widgets are ready for integration with your backend metrics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}