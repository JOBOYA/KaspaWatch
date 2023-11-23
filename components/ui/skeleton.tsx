import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // Utilisez une couleur plus claire qui est visible sur un fond noir.
  // Par exemple, 'bg-gray-300' pour un fond clair ou 'bg-gray-600' pour une teinte grise plus foncée.
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-600", className)}
      {...props}
    />
  )
}

export { Skeleton }
