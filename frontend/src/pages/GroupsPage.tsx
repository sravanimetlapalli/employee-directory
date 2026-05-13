import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Group, GroupCreate } from '../types';
import { getGroups, createGroup, deleteGroup, getGroupMembers } from '../api';
import GroupBadge from '../components/GroupBadge';

const GroupsPage: React.FC = () => {
  const [groups,      setGroups]      = useState<Group[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [newGroup,    setNewGroup]    = useState<GroupCreate>({ name: '', description: '' });
  const [expandedId,  setExpandedId]  = useState<string | null>(null);
  const [members,     setMembers]     = useState<{ [key: string]: any[] }>({});

  useEffect(() => { fetchGroups(); }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGroups();
      setGroups(data);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createGroup(newGroup);
      setGroups(prev => [...prev, created]);
      setNewGroup({ name: '', description: '' });
      toast.success('Group created!');
    } catch {
      toast.error('Failed to create group');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this group?')) return;
    try {
      await deleteGroup(id);
      setGroups(prev => prev.filter(g => g.id !== id));
      toast.success('Group deleted');
    } catch {
      toast.error('Failed to delete group');
    }
  };

  const handleExpand = async (groupId: string) => {
    if (expandedId === groupId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(groupId);
    if (!members[groupId]) {
      try {
        const data = await getGroupMembers(groupId);
        setMembers(prev => ({ ...prev, [groupId]: data }));
      } catch {
        toast.error('Failed to load members');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage employee groups and memberships
        </p>
      </div>

      {/* Create Group Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Create New Group
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Group name (e.g. DevOps)"
            value={newGroup.name}
            onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
            className="flex-1 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newGroup.description}
            onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
            className="flex-1 rounded-lg border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + Create Group
          </button>
        </form>
      </div>

      {/* Groups List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No groups yet — create your first one above!
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => (
            <div
              key={group.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Group Row */}
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{group.name}</p>
                    {group.description && (
                      <p className="text-sm text-gray-500">{group.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExpand(group.id)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {expandedId === group.id ? 'Hide members' : 'View members'}
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded Members */}
              {expandedId === group.id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  {!members[group.id] ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    </div>
                  ) : members[group.id].length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-2">
                      No members in this group yet
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {members[group.id].map((emp: any) => (
                        <span
                          key={emp.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium">
                            {emp.first_name[0]}
                          </span>
                          {emp.first_name} {emp.last_name}
                          <span className="text-gray-400 text-xs">· {emp.role}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupsPage;