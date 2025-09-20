"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
    sortBy: "recent",
  });

  const categories = [
    "Tous",
    "Électronique",
    "Vêtements",
    "Maison",
    "Sports",
    "Véhicules",
    "Autres",
  ];

  const locations = [
    "Toute la Guyane",
    "Cayenne",
    "Kourou",
    "Saint-Laurent",
    "Matoury",
  ];

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-background/80 border border-border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full sm:w-auto hover:bg-accent text-sm sm:text-base"
        >
          <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
          Filtres
          <ChevronDown
            className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
          className="w-full sm:w-auto rounded-md border border-input bg-background px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base"
        >
          <option value="recent">Plus récents</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {isOpen && (
        <div className="mt-3 sm:mt-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs sm:text-sm font-medium">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange({ category: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1.5 sm:py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium">
              Localisation
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange({ location: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-2 sm:px-3 py-1.5 sm:py-2 text-sm"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-1 sm:col-span-2">
            <label className="text-xs sm:text-sm font-medium">Prix</label>
            <div className="mt-2">
              <Slider
                value={filters.priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) =>
                  handleFilterChange({ priceRange: value as [number, number] })
                }
              />
              <div className="mt-2 flex justify-between text-xs sm:text-sm text-muted-foreground">
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
