"use client";

import { motion } from "framer-motion";
import { Category } from "../../communaute/page";

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategoryTabsProps) {
  
  return (
    <div className="mb-6 overflow-hidden">
      <div className="flex overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex space-x-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1">{category.icon}</span> {category.name}
              {category.topic_count > 0 && category.id !== "all" && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  selectedCategory === category.id 
                    ? "bg-white/25 text-white" 
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {category.topic_count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Selected category description */}
      {selectedCategory && (
        <div className="mt-4 text-sm text-gray-600">
          {categories.find(c => c.id === selectedCategory)?.description}
        </div>
      )}
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
