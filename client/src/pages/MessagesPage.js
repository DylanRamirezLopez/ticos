import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiChevronRight, FiUsers, FiPlus, FiCopy, FiLink, FiMessageCircle, FiHash, FiSend, FiEyeOff, FiSettings } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../api/client';
import useMediaQuery from '../hooks/useMediaQuery';
import ConversationList from '../components/messages/ConversationList';
import ChatBubble from '../components/messages/ChatBubble';
import ChatInput from '../components/messages/ChatInput';
import TypingIndicator from '../components/messages/TypingIndicator';
import GroupSettings from '../components/messages/GroupSettings';
import useDebounce from '../hooks/useDebounce';

const MessagesPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const isMobile = useMediaQuery('(max-width: 767px)');

  const [tab, setTab] = useState('dms');
  const [conversations, setConversations] = useState({ dms: [], groups: [] });
  const [activeChat, setActiveChat] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [groupIsAnonymous, setGroupIsAnonymous] = useState(false);
  const [groupInviteCode, setGroupInviteCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [showGroupSettings, setShowGroupSettings] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedSearch.trim()) { setSearchResults([]); return; }
    api.get(`/users/search?q=${debouncedSearch}`)
      .then((res) => setSearchResults(res.data))
      .catch(() => {});
  }, [debouncedSearch]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/messages/conversations');
      setConversations(res.data);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  const fetchMessages = useCallback(async (userId) => {
    setChatLoading(true);
    try {
      const res = await api.get(`/messages/${userId}`);
      setMessages(res.data);
    } catch {} finally {
      setChatLoading(false);
    }
  }, []);

  const fetchGroupMessages = useCallback(async (groupId) => {
    setChatLoading(true);
    try {
      const res = await api.get(`/messages/group/${groupId}/messages`);
      setMessages(res.data);
    } catch {} finally {
      setChatLoading(false);
    }
  }, []);

  const handleSelectChat = useCallback((chatUser) => {
    setActiveChat(chatUser);
    setActiveGroup(null);
    fetchMessages(chatUser._id);
  }, [fetchMessages]);

  const handleSelectGroup = useCallback((group) => {
    setActiveGroup(group);
    setActiveChat(null);
    fetchGroupMessages(group._id);
  }, [fetchGroupMessages]);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      fetchConversations();
      if (activeChat && (msg.sender?._id === activeChat._id || msg.receiver?._id === activeChat._id)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    const handleNewGroupMessage = (data) => {
      fetchConversations();
      if (activeGroup && data.groupId === activeGroup._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    };
    const handleTyping = (data) => {
      if (data.userId === activeChat?._id) setTyping(true);
    };
    const handleStopTyping = (data) => {
      if (data.userId === activeChat?._id) setTyping(false);
    };
    socket.on('new-message', handleNewMessage);
    socket.on('new-group-message', handleNewGroupMessage);
    socket.on('user-typing', handleTyping);
    socket.on('user-stop-typing', handleStopTyping);
    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('new-group-message', handleNewGroupMessage);
      socket.off('user-typing', handleTyping);
      socket.off('user-stop-typing', handleStopTyping);
    };
  }, [socket, activeChat, activeGroup, fetchConversations]);

  const handleSend = async (text) => {
    try {
      if (activeGroup) {
        const res = await api.post('/messages/group/message', { groupId: activeGroup._id, text });
        setMessages((prev) => [...prev, res.data]);
      } else {
        const res = await api.post('/messages', { receiverId: activeChat._id, text });
        setMessages((prev) => [...prev, res.data]);
      }
      fetchConversations();
    } catch {}
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await api.post('/messages/group', { name: newGroupName, isAnonymous: groupIsAnonymous });
      setGroupInviteCode(res.data.inviteCode);
      setShowCreateGroup(false);
      setNewGroupName('');
      setGroupIsAnonymous(false);
      fetchConversations();
    } catch {}
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim()) return;
    try {
      await api.post('/messages/group/join', { inviteCode: joinCode.trim() });
      setJoinCode('');
      fetchConversations();
      setTab('groups');
    } catch {}
  };

  const handleSelectSearch = (u) => {
    if (u._id === user._id) return;
    setTab('dms');
    handleSelectChat(u);
    setSearchResults([]);
    setSearchQuery('');
  };

  const messagesEndRef = React.createRef();
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  const renderChatHeader = () => {
    if (activeChat) {
      return (
        <>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover flex-shrink-0">
            {activeChat.avatar ? (
              <img src={activeChat.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-avatar flex items-center justify-center text-white font-bold text-sm">
                {activeChat.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <p className="font-semibold text-sm">{activeChat.username}</p>
        </>
      );
    }
    if (activeGroup) {
      return (
        <>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {activeGroup.name?.[0]?.toUpperCase()}
          </div>
          <p className="font-semibold text-sm truncate">{activeGroup.name}</p>
          {activeGroup.isAnonymous && <FiEyeOff size={12} className="text-purple-400 ml-1" />}
          <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary ml-auto">
            {activeGroup.members?.length || 0} members
          </span>
          <button
            onClick={() => setShowGroupSettings(true)}
            className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-lg transition-colors"
          >
            <FiSettings size={16} className="text-gray-500" />
          </button>
        </>
      );
    }
    return null;
  };

  const renderMessages = () => (
    <div className="flex-1 overflow-y-auto px-6 py-4">
      {chatLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-6 h-6 border-2 border-ticos-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-ticos-secondary dark:text-ticos-dark-secondary text-sm">
          {activeGroup ? 'No messages yet. Say hello!' : 'No messages yet. Start a conversation!'}
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <ChatBubble key={msg._id} message={msg} isOwn={msg.sender?._id === user._id || msg.sender === user._id} />
          ))}
        </>
      )}
      {typing && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );

  const mobileChatView = () => (
    <div className="h-screen flex flex-col bg-ticos-bg dark:bg-ticos-dark-bg">
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 dark:bg-ticos-dark-card dark:border-ticos-dark-border">
        <button onClick={() => { setActiveChat(null); setActiveGroup(null); }} className="p-1">
          <FiArrowLeft size={22} />
        </button>
        {renderChatHeader()}
      </div>
      {renderMessages()}
      <ChatInput
        onSend={handleSend}
        onTyping={() => {
          if (activeChat) socket?.emit('typing', { receiverId: activeChat._id });
        }}
        onStopTyping={() => {
          if (activeChat) socket?.emit('stop-typing', { receiverId: activeChat._id });
        }}
      />
    </div>
  );

  // Mobile chat view
  if (isMobile && (activeChat || activeGroup)) return mobileChatView();

  // Empty state for group tab
  const GroupTab = () => (
    <div className="flex-1 flex flex-col">
      <div className="p-4 space-y-2 border-b border-gray-200 dark:border-ticos-dark-border">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Group name..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-ticos-dark-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent"
          />
          <button
            onClick={handleCreateGroup}
            disabled={!newGroupName.trim()}
            className="px-3 py-2 bg-ticos-accent text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <FiPlus size={16} />
          </button>
        </div>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={groupIsAnonymous}
            onChange={(e) => setGroupIsAnonymous(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 cursor-pointer"
          />
          <FiEyeOff size={14} className="text-purple-500" />
          <span className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary">Anonymous group (members hidden)</span>
        </label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Join with invite code..."
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-ticos-dark-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleJoinGroup}
            disabled={!joinCode.trim()}
            className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <FiLink size={16} />
          </button>
        </div>
      </div>

      {groupInviteCode && (
        <div className="mx-4 mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
          <p className="text-xs text-purple-700 dark:text-purple-300 font-medium mb-1">Group Created! Share invite code:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-2 py-1 bg-white dark:bg-ticos-dark-card rounded text-sm font-mono">{groupInviteCode}</code>
            <button
              onClick={() => navigator.clipboard?.writeText(groupInviteCode)}
              className="p-1.5 hover:bg-white dark:hover:bg-ticos-dark-hover rounded-lg transition-colors"
            >
              <FiCopy size={14} className="text-purple-500" />
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {conversations.groups.length === 0 ? (
          <div className="flex items-center justify-center h-full text-ticos-secondary dark:text-ticos-dark-secondary text-sm">
            <div className="text-center">
              <FiUsers size={32} className="mx-auto mb-2 text-gray-300" />
              <p>No groups yet</p>
              <p className="text-xs mt-1">Create or join a group above</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-ticos-dark-border">
            {conversations.groups.map((group) => (
              <button
                key={group._id}
                onClick={() => handleSelectGroup(group)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {group.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{group.name}</p>
                  <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary truncate">
                    {group.members?.length || 0} members
                    {group.lastMessage && ` · ${group.lastMessage.text?.substring(0, 30)}...`}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto h-[calc(100vh-64px)] flex bg-white rounded-2xl shadow-ticos dark:shadow-none overflow-hidden mt-4 mx-4 dark:bg-ticos-dark-card"
    >
      <div className={`${isMobile ? 'w-full' : 'w-80'} border-r border-gray-200 flex flex-col bg-white dark:border-ticos-dark-border dark:bg-ticos-dark-card`}>
        <div className="p-4 border-b border-gray-200 dark:border-ticos-dark-border">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => setTab('dms')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'dms' ? 'bg-ticos-accent text-white' : 'bg-gray-100 dark:bg-ticos-dark-hover text-ticos-secondary dark:text-ticos-dark-secondary'
              }`}
            >
              <FiMessageCircle size={14} className="inline mr-1" /> DMs
            </button>
            <button
              onClick={() => setTab('groups')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                tab === 'groups' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-ticos-dark-hover text-ticos-secondary dark:text-ticos-dark-secondary'
              }`}
            >
              <FiUsers size={14} className="inline mr-1" /> Groups
            </button>
          </div>
          <input
            type="text"
            placeholder={tab === 'dms' ? 'Search users...' : 'Search groups...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-ticos-dark-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticos-accent dark:placeholder-gray-500"
          />
          {tab === 'dms' && searchResults.length > 0 && (
            <div className="mt-2 bg-white dark:bg-ticos-dark-card border border-gray-200 dark:border-ticos-dark-border rounded-lg shadow-sm max-h-48 overflow-y-auto">
              {searchResults.map((u) => (
                <button
                  key={u._id}
                  onClick={() => handleSelectSearch(u)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-ticos-dark-hover transition-colors"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 dark:bg-ticos-dark-hover flex-shrink-0">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-avatar flex items-center justify-center text-white text-xs font-bold">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{u.username}</p>
                    <p className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary truncate">{u.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {tab === 'dms' ? (
          <ConversationList
            conversations={conversations.dms}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            loading={loading}
          />
        ) : (
          <GroupTab />
        )}
      </div>

      <div className={`flex-1 flex flex-col bg-gray-50 ${isMobile ? 'hidden' : ''} dark:bg-ticos-dark-bg`}>
        {(activeChat || activeGroup) ? (
          <>
            <div className="flex items-center gap-3 px-6 py-3 bg-white border-b border-gray-200 dark:bg-ticos-dark-card dark:border-ticos-dark-border">
              {renderChatHeader()}
            </div>
            {renderMessages()}
            <ChatInput
              onSend={handleSend}
              onTyping={() => {
                if (activeChat) socket?.emit('typing', { receiverId: activeChat._id });
              }}
              onStopTyping={() => {
                if (activeChat) socket?.emit('stop-typing', { receiverId: activeChat._id });
              }}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-ticos-secondary dark:text-ticos-dark-secondary">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-ticos-dark-card flex items-center justify-center mx-auto mb-4">
                <FiChevronRight size={24} className="text-gray-400 dark:text-ticos-dark-secondary" />
              </div>
              <p className="text-lg font-semibold text-ticos-primary mb-1 dark:text-ticos-dark-primary">
                {tab === 'dms' ? 'Your Messages' : 'Your Groups'}
              </p>
              <p className="text-sm">
                {tab === 'dms' ? 'Select a conversation to start chatting' : 'Create or join a group'}
              </p>
            </div>
          </div>
        )}
      </div>

      <GroupSettings
        isOpen={showGroupSettings}
        onClose={() => setShowGroupSettings(false)}
        group={activeGroup ? { ...activeGroup, currentUserId: user?._id } : null}
        onUpdate={(updated) => {
          const newGroups = conversations.groups.map((g) =>
            g._id === updated._id ? updated : g
          );
          setConversations((prev) => ({ ...prev, groups: newGroups }));
          setActiveGroup(updated);
        }}
      />
    </motion.div>
  );
};

export default MessagesPage;
