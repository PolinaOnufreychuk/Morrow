import { Link } from "react-router-dom";
import { EmptyState } from "@/components/shared/EmptyState";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you’re looking for doesn’t exist."
        action={
          <Link to="/" className="text-sage-700 underline underline-offset-2">
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
