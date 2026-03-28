import { useState } from 'react';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked((p) => !p);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <article className="bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container overflow-hidden">
      <div className="p-5">
        {/* Author */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-3">
            <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
              {post.author.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">{post.author}</p>
              <p className="text-xs text-on-surface-variant">{post.authorTitle} · {post.postedAt}</p>
            </div>
          </div>
          <button className="text-outline hover:text-primary transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>

        {/* Content */}
        <p className="text-sm text-on-surface leading-relaxed mb-3">{post.content}</p>

        {/* Location */}
        {post.location && (
          <div className="flex items-center gap-1 text-xs text-on-surface-variant mb-3">
            <span className="material-symbols-outlined text-sm text-secondary">location_on</span>
            {post.location}
          </div>
        )}

        {/* Image */}
        {post.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-3">
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="w-full object-cover max-h-64"
            />
          </div>
        )}
      </div>

      {/* Social Bar */}
      <div className="px-5 py-3 border-t border-surface-container flex items-center justify-between text-on-surface-variant">
        <div className="flex items-center gap-5">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              liked ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={liked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              thumb_up
            </span>
            {likeCount}
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">comment</span>
            {post.comments}
          </button>
        </div>
        <button className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-xl">share</span>
          Share
        </button>
      </div>
    </article>
  );
};

export default PostCard;
