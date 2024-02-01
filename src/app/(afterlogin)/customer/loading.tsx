import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <div>
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    </div>
  );
}
