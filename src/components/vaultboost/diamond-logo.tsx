import { cn } from "@/lib/utils"

export const DiamondLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-8 h-8", className)}
    >
      <path d="M12.0006 18.26L4.94057 10.29L12.0006 2.40997L19.0606 10.29L12.0006 18.26ZM12.0006 21.59L21.5906 10.82L12.0006 0.0500488L2.41057 10.82L12.0006 21.59Z" />
    </svg>
  );
};
