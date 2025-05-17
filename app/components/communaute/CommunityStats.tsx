"use client";

import { useEffect, useState } from "react";
import { Users, MessageSquare, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

interface CommunityStatistics {
  memberCount: number;
  topicCount: number;
  replyCount: number;
  activeUsersCount: number;
}

export function CommunityStats() {
  const [stats, setStats] = useState<CommunityStatistics>({
    memberCount: 0,
    topicCount: 0,
    replyCount: 0,
    activeUsersCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch member count
      const { count: memberCount, error: memberError } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      if (memberError) throw memberError;

      // Fetch topic count
      const { count: topicCount, error: topicError } = await supabase
        .from("forum_topics")
        .select("id", { count: "exact", head: true });

      if (topicError) throw topicError;

      // Fetch reply count
      const { count: replyCount, error: replyError } = await supabase
        .from("forum_replies")
        .select("id", { count: "exact", head: true });

      if (replyError) throw replyError;

      // Fetch active users (users who posted in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsers, error: activeUsersError } = await supabase
        .from("forum_topics")
        .select("user_id")
        .gte("created_at", thirtyDaysAgo.toISOString())
        .limit(100);

      if (activeUsersError) throw activeUsersError;

      // Get unique active users
      const uniqueActiveUsers = new Set();
      activeUsers?.forEach(topic => uniqueActiveUsers.add(topic.user_id));

      // Set all stats
      setStats({
        memberCount: memberCount || 0,
        topicCount: topicCount || 0,
        replyCount: replyCount || 0,
        activeUsersCount: uniqueActiveUsers.size
      });
    } catch (error) {
      console.error("Error fetching community stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques de la communauté</h3>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-full mr-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center text-white">
                <Users className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Membres</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.memberCount)}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Actifs (30j)</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.activeUsersCount)}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex items-center justify-center text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Discussions</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.topicCount)}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-500">Réponses</p>
                <p className="text-xl font-bold text-gray-800">{formatNumber(stats.replyCount)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
