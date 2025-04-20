"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Filter, ChevronDown } from "lucide-react";

interface FilterBarProps {
  onFilterChange: (filters: FilterState) => void;
}

interface FilterState {
  priceRange: [number, number];
  category: string;
  location: string;
  sortBy: string;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    category: "",
    location: "",
    sortBy: "recent"
  });

  const categories = [
    "Tous",
    "Électronique",
    "Vêtements",
    "Maison",
    "Sports",
    "Véhicules",
    "Autres"
  ];

  const locations = [
    "Toute la Guyane",
    "Cayenne",
    "Kourou",
    "Saint-Laurent",
    "Matoury"
  ];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-background/80 border border-border rounded-lg p-4 mb-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full md:w-auto hover:bg-accent"
        >
          <Filter className="h-4 w-4" />
          Filtres
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          className="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {isOpen && (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-sm font-medium">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Localisation</label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange({ location: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-medium">Prix</label>
            <div className="mt-2">
              <Slider
                value={filters.priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) => handleFilterChange({ priceRange: value as [number, number] })}
              />
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{filters.priceRange[0]}€</span>
                <span>{filters.priceRange[1]}€</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}