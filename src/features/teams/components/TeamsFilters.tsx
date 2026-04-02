"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamSizeFilter } from "@/features/teams/components/teams-list.types";

interface TeamsFiltersProps {
  query: string;
  onQueryChange: (val: string) => void;
  sizeFilter: TeamSizeFilter;
  onSizeFilterChange: (val: TeamSizeFilter) => void;
}

export function TeamsFilters({
  query,
  onQueryChange,
  sizeFilter,
  onSizeFilterChange,
}: TeamsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-card/30 p-2 rounded-2xl border border-border/40 hover:border-border/80 transition-all duration-300">
      <div className="relative flex-1 w-full group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search teams by name or description..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full pl-10 h-11 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-muted-foreground/60 transition-all shadow-none"
        />
      </div>
      
      <div className="h-6 w-px bg-border/60 hidden md:block" />

      <div className="flex items-center gap-2 w-full md:w-auto">
        <Select
          value={sizeFilter}
          onValueChange={(val: string) => onSizeFilterChange(val as TeamSizeFilter)}
        >
          <SelectTrigger className="w-full md:w-[160px] h-11 bg-transparent border-none focus:ring-0 px-4 group">
            <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
              <SlidersHorizontal className="h-4 w-4" />
              <div className="flex-1 text-left">
                <SelectValue placeholder="Size" />
              </div>
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-primary/10 shadow-xl">
            <SelectItem value="All">All Sizes</SelectItem>
            <SelectItem value="Small">Small (1-2)</SelectItem>
            <SelectItem value="Medium">Medium (3-4)</SelectItem>
            <SelectItem value="Large">Large (5+)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


