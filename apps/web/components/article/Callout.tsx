import React from "react";
import { Info, AlertTriangle, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "info" | "tip" | "warning" | "important";
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const configs = {
    info: {
      borderCls: "border-blue-500/30 bg-blue-500/5 text-foreground",
      icon: Info,
      iconCls: "text-blue-500",
      defaultTitle: "Note",
    },
    tip: {
      borderCls: "border-teal-500/30 bg-teal-500/5 text-foreground",
      icon: Sparkles,
      iconCls: "text-teal-500",
      defaultTitle: "Tip",
    },
    warning: {
      borderCls: "border-amber-500/30 bg-amber-500/5 text-foreground",
      icon: AlertTriangle,
      iconCls: "text-amber-500",
      defaultTitle: "Warning",
    },
    important: {
      borderCls: "border-violet-500/30 bg-violet-500/5 text-foreground",
      icon: CheckCircle2,
      iconCls: "text-violet-500",
      defaultTitle: "Important",
    },
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div className={cn("my-6 flex items-start gap-4 rounded-xl border p-5 glass", config.borderCls)}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", config.iconCls)} />
      <div className="flex-1 space-y-1 text-sm leading-relaxed">
        <h4 className="font-bold text-foreground">
          {title || config.defaultTitle}
        </h4>
        <div className="text-muted-foreground/90 font-medium">{children}</div>
      </div>
    </div>
  );
}
