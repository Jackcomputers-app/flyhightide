import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <h1 className="text-2xl font-bold text-gray-900">Opps it looks like we got lost.</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Lets get that fixed.
          </p>

          <div className="mt-6 text-center">
            <button
              className="px-4 py-2 bg-ocean-blue text-white rounded hover:bg-blue-600 transition"
              onClick={() => window.location.href = "/"}
            >
              Go Home
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
