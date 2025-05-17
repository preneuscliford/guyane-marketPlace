"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { ForumHero } from "@/components/communaute/ForumHero";
import { CategoryTabs } from "@/components/communaute/CategoryTabs";
import { TopicList } from "@/components/communaute/TopicList";
import { NewTopicButton } from "@/components/communaute/NewTopicButton";
import { TrendingTopics } from "@/components/communaute/TrendingTopics";
import { CommunityStats } from "@/components/communaute/CommunityStats";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  topic_count: number;
};

export type Topic = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  category_id: string;
  view_count: number;
  like_count: number;
  reply_count: number;
  is_pinned: boolean;
  last_activity_at: string;
  author: {
    username: string;
    avatar_url: string;
    reputation: number;
  };
  category?: Category;
};

export default function CommunautePage() {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "trending">("recent");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  // Load more topics when page changes
  useEffect(() => {
    if (page > 1) {
      fetchTopics(page);
    }
  }, [page]);

  // Initial data loading
  useEffect(() => {
    fetchCategories();
    fetchTopics(1);
  }, [selectedCategory, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("forum_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      
      // Add "All Categories" option
      const allCategories = [
        {
          id: "all",
          name: "Toutes les catégories",
          slug: "all",
          description: "Tous les sujets de discussion",
          icon: "📋",
          color: "from-purple-600 to-fuchsia-600",
          topic_count: 0
        },
        ...(data || [])
      ];
      
      setCategories(allCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchTopics = async (currentPage = 1) => {
    try {
      currentPage === 1 ? setLoading(true) : setLoadingMore(true);
      
      const limit = 10;
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("forum_topics")
        .select(`
          *,
          author:user_id (
            username, 
            avatar_url,
            reputation
          ),
          category:category_id (
            id,
            name,
            slug,
            icon,
            color
          )
        `);

      // Apply category filter
      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      // Apply sorting
      switch (sortBy) {
        case "popular":
          query = query.order("like_count", { ascending: false });
          break;
        case "trending":
          query = query.order("view_count", { ascending: false });
          break;
        default:
          query = query.order("last_activity_at", { ascending: false });
      }

      // Apply pagination
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      setHasMore(data.length >= limit);
      setTopics((prev) => (currentPage === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Error fetching topics:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleSortChange = (sort: "recent" | "popular" | "trending") => {
    setSortBy(sort);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <ForumHero />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Discussions</h2>
                <NewTopicButton user={user} categories={categories} onTopicCreated={() => fetchTopics(1)} />
              </div>
              
              <CategoryTabs 
                categories={categories} 
                selectedCategory={selectedCategory} 
                onSelectCategory={handleCategoryChange} 
              />
              
              <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    onClick={() => handleSortChange("recent")}
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                      sortBy === "recent"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Récents
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("popular")}
                    className={`px-4 py-2 text-sm font-medium ${
                      sortBy === "popular"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Populaires
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange("trending")}
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                      sortBy === "trending"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Tendances
                  </button>
                </div>
              </div>
              
              <TopicList 
                topics={topics} 
                loading={loading} 
                onViewTopic={(topicId) => console.log("View topic", topicId)} 
              />
              
              {/* Loader for infinite scroll */}
              {!loading && hasMore && (
                <div 
                  ref={loaderRef} 
                  className="flex justify-center items-center py-8"
                >
                  {loadingMore && (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3 space-y-6">
            <TrendingTopics />
            <CommunityStats />
          </div>
        </div>
      </div>
    </div>
  );
}
