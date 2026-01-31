import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  duration: string;
  description?: string;
}

export function ServiceCard({
  icon: Icon,
  title,
  duration,
  description,
}: ServiceCardProps) {
  return (
    <div className="group bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border/50 hover:border-primary/20 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-bold text-card-foreground mb-2">{title}</h3>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-2">
        {duration}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
}
