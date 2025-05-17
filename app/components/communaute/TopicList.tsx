"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MessageSquare, Heart, Eye, PinIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Topic } from "../../communaute/page";

interface TopicListProps {
  topics: Topic[];
  loading: boolean;
  onViewTopic: (topicId: string) => void;
}

export function TopicList({ topics, loading, onViewTopic }: TopicListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune discussion trouvée</h3>
        <p className="text-gray-500">Soyez le premier à créer une discussion dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {topics.map((topic, index) => (
        <motion.div 
          key={topic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="relative bg-white border border-gray-100 rounded-lg p-5 hover:shadow-md transition-shadow"
        >
          {topic.is_pinned && (
            <div className="absolute top-2 right-2 text-orange-500">
              <PinIcon className="h-4 w-4" />
            </div>
          )}
          
          <div className="flex items-start gap-4">
            <Link href={`/profil/${topic.author.username}`} className="shrink-0">
              <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-purple-100">
                {topic.author.avatar_url ? (
                  <Image
                    src={topic.author.avatar_url}
                    alt={topic.author.username}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-white text-xl font-bold">
                    {topic.author.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </Link>
            
            <div className="flex-1">
              <Link 
                href={`/communaute/topic/${topic.id}`}
                onClick={() => onViewTopic(topic.id)}
                className="block"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-purple-600 transition-colors line-clamp-2">
                  {topic.title}
                </h3>
              </Link>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm text-gray-500">
                  par <Link href={`/profil/${topic.author.username}`} className="text-purple-600 hover:underline">{topic.author.username}</Link>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(topic.created_at), { addSuffix: true, locale: fr })}
                </span>
                
                {topic.category && (
                  <>
                    <span className="text-gray-400">•</span>
                    <Link 
                      href={`/communaute/categorie/${topic.category.slug}`}
                      className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${topic.category.color} text-white`}
                    >
                      {topic.category.icon} {topic.category.name}
                    </Link>
                  </>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {topic.content.replace(/<[^>]*>?/gm, '')}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 gap-4">
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{topic.reply_count} réponses</span>
                </div>
                
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  <span>{topic.like_count} j&apos;aime</span>
                </div>
                
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{topic.view_count} vues</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
