import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
      <Activity className="w-10 h-10 opacity-30" />
      <div className="text-center">
        <div className="text-lg font-semibold text-foreground">404 — Page Not Found</div>
        <div className="text-sm mt-1">This route doesn't exist</div>
      </div>
      <Link href="/">
        <Button variant="outline" size="sm">Back to Scanner</Button>
      </Link>
    </div>
  );
}
