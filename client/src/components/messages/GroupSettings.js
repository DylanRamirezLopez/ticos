import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2, FiShield, FiUser, FiUserPlus, FiCheck, FiSettings, FiSlash } from 'react-icons/fi';
import api from '../../api/client';

const allPermissions = [
  { key: 'invite', label: 'Invite People' },
  { key: 'createLinks', label: 'Create Invite Links' },
  { key: 'sendImages', label: 'Send Images' },
  { key: 'sendLinks', label: 'Send Links' },
  { key: 'sendText', label: 'Send Messages' },
  { key: 'manageRoles', label: 'Manage Roles' },
  { key: 'removeMembers', label: 'Remove Members' },
  { key: 'changeName', label: 'Change Group Name' },
  { key: 'pinMessages', label: 'Pin Messages' },
];

const GroupSettings = ({ isOpen, onClose, group, onUpdate }) => {
  const [view, setView] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [editingPerms, setEditingPerms] = useState({});
  const [assignTarget, setAssignTarget] = useState(null);
  const [assignRole, setAssignRole] = useState('');

  const currentUserRole = group?.members?.find(
    (m) => m.user?._id === group.currentUserId
  )?.role;

  const canManageRoles = group?.roles?.find((r) => r.name === currentUserRole)?.permissions?.manageRoles;
  const canRemove = group?.roles?.find((r) => r.name === currentUserRole)?.permissions?.removeMembers;

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      const res = await api.put(`/messages/group/${group._id}/roles`, {
        action: 'createRole',
        roleName: newRoleName.trim(),
        permissions: editingPerms,
      });
      onUpdate?.(res.data);
      setNewRoleName('');
      setEditingPerms({});
    } catch {}
  };

  const handleUpdateRole = async (roleName, permissions) => {
    try {
      const res = await api.put(`/messages/group/${group._id}/roles`, {
        action: 'updateRole',
        roleName,
        permissions,
      });
      onUpdate?.(res.data);
    } catch {}
  };

  const handleDeleteRole = async (roleName) => {
    if (!window.confirm(`Delete role "${roleName}"? Members will be reassigned to "member".`)) return;
    try {
      const res = await api.put(`/messages/group/${group._id}/roles`, {
        action: 'deleteRole',
        roleName,
      });
      onUpdate?.(res.data);
      setView(null);
    } catch {}
  };

  const handleAssignRole = async () => {
    if (!assignTarget || !assignRole) return;
    try {
      const res = await api.put(`/messages/group/${group._id}/roles`, {
        action: 'assignRole',
        targetUserId: assignTarget,
        newRole: assignRole,
      });
      onUpdate?.(res.data);
      setAssignTarget(null);
      setAssignRole('');
    } catch {}
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the group?')) return;
    try {
      const res = await api.put(`/messages/group/${group._id}/roles`, {
        action: 'removeMember',
        targetUserId: userId,
      });
      onUpdate?.(res.data);
    } catch {}
  };

  const PermissionToggle = ({ permKey, label, checked, onChange }) => (
    <label className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover rounded-lg cursor-pointer">
      <span className="text-sm text-ticos-primary dark:text-ticos-dark-primary">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(permKey, e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-ticos-accent focus:ring-ticos-accent cursor-pointer"
      />
    </label>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-ticos-dark-card rounded-2xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-ticos-dark-border">
              <h3 className="font-bold">
                {view === 'roles' ? 'Manage Roles' : view === 'members' ? 'Members' : 'Group Settings'}
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-full">
                <FiX size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!view && (
                <div className="space-y-2">
                  <button onClick={() => setView('roles')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover rounded-xl transition-colors text-left">
                    <FiShield size={18} className="text-purple-500" />
                    <span className="text-sm font-medium">Roles & Permissions</span>
                  </button>
                  <button onClick={() => setView('members')} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover rounded-xl transition-colors text-left">
                    <FiUser size={18} className="text-ticos-accent" />
                    <span className="text-sm font-medium">Members ({group?.members?.length || 0})</span>
                  </button>
                  {group?.isAnonymous && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <p className="text-xs text-purple-700 dark:text-purple-300">
                        🔒 This is an anonymous group. Member identities are hidden.
                      </p>
                    </div>
                  )}
                  <div className="p-3 bg-gray-50 dark:bg-ticos-dark-hover rounded-xl mt-4">
                    <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary mb-1">Invite Code</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-2 py-1 bg-white dark:bg-ticos-dark-card rounded text-sm font-mono border border-gray-200 dark:border-ticos-dark-border">
                        {group?.inviteCode}
                      </code>
                      <button
                        onClick={() => navigator.clipboard?.writeText(group?.inviteCode || '')}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-ticos-dark-hover rounded-lg transition-colors"
                      >
                        <FiSlash size={14} className="text-ticos-accent" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {view === 'roles' && (
                <div className="space-y-4">
                  {group?.roles?.map((role) => (
                    <div key={role.name} className="bg-gray-50 dark:bg-ticos-dark-hover rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm capitalize">{role.name}</span>
                        {role.name !== 'creator' && role.name !== 'member' && canManageRoles && (
                          <button onClick={() => handleDeleteRole(role.name)} className="p-1 hover:bg-red-50 rounded transition-colors">
                            <FiTrash2 size={14} className="text-ticos-like-red" />
                          </button>
                        )}
                      </div>
                      {role.name === 'creator' ? (
                        <p className="text-xs text-ticos-secondary dark:text-ticos-dark-secondary">Full access (cannot modify)</p>
                      ) : (
                        <div className="space-y-0.5">
                          {allPermissions.map((perm) => (
                            <PermissionToggle
                              key={perm.key}
                              permKey={perm.key}
                              label={perm.label}
                              checked={role.permissions[perm.key] || false}
                              onChange={(key, val) => {
                                if (canManageRoles && role.name !== 'creator') {
                                  handleUpdateRole(role.name, { [key]: val });
                                  role.permissions[key] = val;
                                }
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {canManageRoles && (
                    <div className="border-t border-gray-100 dark:border-ticos-dark-border pt-4 mt-4">
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="New role name..."
                          className="flex-1 px-3 py-2 bg-gray-100 dark:bg-ticos-dark-hover rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                        />
                        <button
                          onClick={handleCreateRole}
                          disabled={!newRoleName.trim()}
                          className="px-3 py-2 bg-purple-500 text-white rounded-lg text-sm font-semibold hover:bg-purple-600 transition-colors disabled:opacity-50"
                        >
                          <FiPlus size={16} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {allPermissions.map((perm) => (
                          <label key={perm.key} className="flex items-center gap-2 text-xs cursor-pointer py-1">
                            <input
                              type="checkbox"
                              checked={editingPerms[perm.key] || false}
                              onChange={(e) => setEditingPerms((p) => ({ ...p, [perm.key]: e.target.checked }))}
                              className="w-3 h-3 rounded"
                            />
                            {perm.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {view === 'members' && (
                <div className="space-y-2">
                  {group?.members?.map((member) => {
                    const isSelf = member.user?._id === group.currentUserId;
                    const isCreator = member.role === 'creator';
                    return (
                      <div key={member.user?._id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-ticos-dark-hover rounded-xl">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isCreator ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 dark:bg-ticos-dark-hover text-gray-600'
                          }`}>
                            {isCreator ? 'C' : member.user?.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {isSelf ? 'You' : member.user?.name || 'Anonymous'}
                              {isCreator && ' 👑'}
                            </p>
                            {!isCreator && canManageRoles && (
                              <select
                                value={member.role}
                                onChange={(e) => {
                                  api.put(`/messages/group/${group._id}/roles`, {
                                    action: 'assignRole',
                                    targetUserId: member.user?._id,
                                    newRole: e.target.value,
                                  }).then((res) => onUpdate?.(res.data));
                                }}
                                className="text-2xs bg-transparent text-ticos-accent focus:outline-none cursor-pointer"
                              >
                                {group?.roles?.map((r) => (
                                  <option key={r.name} value={r.name}>{r.name}</option>
                                ))}
                              </select>
                            )}
                            {!isCreator && !canManageRoles && (
                              <span className="text-2xs text-ticos-secondary dark:text-ticos-dark-secondary capitalize">{member.role}</span>
                            )}
                          </div>
                        </div>
                        {!isSelf && !isCreator && canRemove && (
                          <button onClick={() => handleRemoveMember(member.user?._id)} className="p-1 hover:bg-red-50 rounded transition-colors">
                            <FiX size={14} className="text-gray-400 hover:text-ticos-like-red" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GroupSettings;
