import React from 'react';
import { motion } from 'framer-motion';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import useMediaQuery from '../../hooks/useMediaQuery';

const ProfileHeader = ({ profile, isOwn, isFollowing, onFollow, onEditProfile }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (!profile) return null;

  return (
    <div className={`flex ${isMobile ? 'flex-col items-center text-center' : 'items-start gap-16'} mb-8`}>
      <Avatar
        src={profile.avatar}
        name={profile.name}
        size={isMobile ? 'lg' : 'xl'}
        hasStory={false}
        toProfile={false}
      />

      <div className="flex-1">
        <div className={`flex items-center gap-4 mb-4 ${isMobile ? 'justify-center flex-wrap' : ''}`}>
          <h2 className="text-xl font-light">{profile.username}</h2>
          {isOwn ? (
            <Button variant="secondary" size="sm" onClick={onEditProfile}>
              Edit Profile
            </Button>
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant={isFollowing ? 'following' : 'primary'}
                size="sm"
                onClick={onFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
            </motion.div>
          )}
        </div>

        <div className={`flex gap-8 mb-4 ${isMobile ? 'justify-center' : ''}`}>
          <Stat value={profile.postsCount ?? 0} label="posts" />
          <Stat value={profile.followers?.length ?? 0} label="followers" />
          <Stat value={profile.following?.length ?? 0} label="following" />
        </div>

        <div className={isMobile ? '' : ''}>
          <p className="font-semibold text-sm">{profile.name}</p>
          {profile.bio && <p className="text-sm text-gray-600 dark:text-ticos-dark-secondary mt-1">{profile.bio}</p>}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div className="text-center">
    <span className="font-bold text-base">{value}</span>
    <span className="text-ticos-secondary dark:text-ticos-dark-secondary text-sm ml-1">{label}</span>
  </div>
);

export default React.memo(ProfileHeader);
