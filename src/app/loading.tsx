import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-[min(520px,90%)]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-6 w-40" />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-6 w-40" />
        </Card>
        <Card className="p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-2 h-6 w-40" />
        </Card>
      </div>

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      </Card>
    </div>
  );
}

