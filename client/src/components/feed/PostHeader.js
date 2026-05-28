import React from 'react';
import { Link } from 'react-router-dom';
import Avatar from '../ui/Avatar';

const PostHeader = ({ post }) => {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return new Date(date).toLocaleDateString();
  };

  const isAnonymous = post.isAnonymous;

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {isAnonymous ? (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          A
        </div>
      ) : (
        <Avatar
          src={post.user?.avatar}
          name={post.user?.name}
          username={post.user?.username}
          size="sm"
          hasStory={false}
        />
      )}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {isAnonymous ? (
          <span className="font-semibold text-sm text-purple-500 truncate">Anonymous</span>
        ) : (
          <Link to={`/profile/${post.user?.username}`} className="font-semibold text-sm hover:underline truncate">
            {post.user?.username}
          </Link>
        )}
        <span className="text-ticos-secondary text-xs flex-shrink-0 dark:text-ticos-dark-secondary">{timeAgo(post.createdAt)}</span>
      </div>
    </div>
  );
};

export default React.memo(PostHeader);
