import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TeamSizeFilter } from "@/features/teams/components/teams-list.types";

type TeamsFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  sizeFilter: TeamSizeFilter;
  onSizeFilterChange: (value: TeamSizeFilter) => void;
};

export function TeamsFilters({
  query,
  onQueryChange,
  sizeFilter,
  onSizeFilterChange,
}: TeamsFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search teams by name or description..."
          className="h-11 pl-9"
        />
      </div>
      <select
        value={sizeFilter}
        onChange={(e) => onSizeFilterChange(e.target.value as TeamSizeFilter)}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="All">All team sizes</option>
        <option value="Small">Small (1-2)</option>
        <option value="Medium">Medium (3-4)</option>
        <option value="Large">Large (5+)</option>
      </select>
    </div>
  );
}
