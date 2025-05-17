"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowUpRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Topic } from "../../communaute/page";

export function TrendingTopics() {
  const [trendingTopics, setTrendingTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const fetchTrendingTopics = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("forum_topics")
        .select(`
          id,
          title,
          view_count,
          like_count,
          reply_count,
          created_at,
          category:category_id (
            id,
            name,
            slug,
            icon,
            color
          )
        `)
        .order("view_count", { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setTrendingTopics(data || []);
    } catch (error) {
      console.error("Error fetching trending topics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Flame className="h-5 w-5 text-orange-500 mr-2" />
          Sujets populaires
        </h3>
        <Link 
          href="/communaute?sort=trending" 
          className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
        >
          Voir plus <ArrowUpRight className="h-3 w-3 ml-1" />
        </Link>
      </div>
      
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <Link 
              key={topic.id}
              href={`/communaute/topic/${topic.id}`}
              className="block"
            >
              <div className="group p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <h4 className="text-gray-800 font-medium line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {topic.title}
                </h4>
                
                <div className="flex items-center mt-2 text-xs text-gray-500 space-x-3">
                  {topic.category && (
                    <span className={`px-2 py-0.5 rounded-full text-white text-xs bg-gradient-to-r ${topic.category.color}`}>
                      {topic.category.icon} {topic.category.name}
                    </span>
                  )}
                  <span>{topic.view_count} vues</span>
                  <span>{topic.reply_count} réponses</span>
                </div>
              </div>
            </Link>
          ))}
          
          {trendingTopics.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              Aucun sujet populaire pour le moment
            </div>
          )}
        </div>
      )}
    </div>
  );
}
