import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 pb-6 border-b">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage workspace preferences and defaults.</p>
      </div>

      <Card className="border border-gray-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" /> Workspace Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Settings controls can be connected to your persistence layer in the next step.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}