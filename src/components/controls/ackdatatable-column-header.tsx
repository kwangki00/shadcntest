"use client";

import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AckDataTableColumnHeaderProps<
  TData,
  TValue
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function AckDataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: AckDataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "-ml-3 h-8 font-bold hover:bg-muted-foreground/10 group data-[state=open]:bg-accent",
        className
      )}
      onClick={() => column.toggleSorting(isSorted === "asc")}
    >
      <span className="truncate">{title}</span>
      <div className="ml-2 flex-none">
        {isSorted === "desc" ? (
          <ArrowDown className="h-3 w-3 text-primary" />
        ) : isSorted === "asc" ? (
          <ArrowUp className="h-3 w-3 text-primary" />
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
      </div>
    </Button>
  );
}
