import { cn } from "@/lib/utils";

type StatusType = "diterima" | "dicuci" | "dikeringkan" | "dilipat" | "siap" | "diambil";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  diterima: {
    label: "Diterima",
    className: "bg-info/10 text-info border-info/20",
  },
  dicuci: {
    label: "Sedang Dicuci",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  dikeringkan: {
    label: "Dikeringkan",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  dilipat: {
    label: "Dilipat",
    className: "bg-accent/10 text-accent border-accent/20",
  },
  siap: {
    label: "Siap Diambil",
    className: "bg-success/10 text-success border-success/20",
  },
  diambil: {
    label: "Sudah Diambil",
    className: "bg-muted text-muted-foreground border-muted",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
        config.className,
        className
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse-soft" />
      {config.label}
    </span>
  );
}
