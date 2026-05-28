import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import ProfileGrid from '../components/profile/ProfileGrid';
import Modal from '../components/ui/Modal';
import PostDetailModal from '../components/feed/PostDetailModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import { ProfileSkeleton } from '../components/ui/Skeleton';

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailPostId, setDetailPostId] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    const target = username || currentUser?.username;
    if (!target) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await api.get(`/users/${target}`);
        setProfile(userRes.data);

        const postsRes = await api.get(`/posts/user/${userRes.data._id}`);
        setPosts(postsRes.data);

        if (currentUser) {
          setIsFollowing(
            userRes.data.followers?.some((f) =>
              typeof f === 'object' ? f._id === currentUser._id : f === currentUser._id
            ) || false
          );
        }
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username, currentUser, navigate]);

  const handleFollow = async () => {
    try {
      await api.post(`/users/${profile._id}/follow`);
      setIsFollowing((prev) => !prev);
      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => (typeof f === 'object' ? f._id !== currentUser._id : f !== currentUser._id))
          : [...prev.followers, currentUser._id],
      }));
    } catch {}
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (currentUser) {
      Object.assign(currentUser, updates);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!profile) return null;

  const isOwn = currentUser?._id === profile._id;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-8 px-4"
    >
      <ProfileHeader
        profile={profile}
        isOwn={isOwn}
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onEditProfile={handleEditProfile}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'posts' && (
        <div className="mt-1">
          <ProfileGrid posts={posts} onPostClick={(postId) => setDetailPostId(postId)} />
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="text-center py-20 text-ticos-secondary dark:text-ticos-dark-secondary text-sm">
          Only you can see what you've saved
        </div>
      )}

      <Modal
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Post"
      >
        {selectedPost && (
          <div className="p-4">
            <img src={selectedPost.image} alt="" className="w-full rounded-lg" />
            {selectedPost.caption && (
              <p className="text-sm mt-3">{selectedPost.caption}</p>
            )}
          </div>
        )}
      </Modal>

      {detailPostId && (
        <PostDetailModal
          postId={detailPostId}
          onClose={() => setDetailPostId(null)}
        />
      )}

      {showEditProfile && (
        <EditProfileModal
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}
    </motion.div>
  );
};

export default ProfilePage;
