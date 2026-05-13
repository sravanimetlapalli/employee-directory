import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Employee, Group } from '../types';
import {
  getEmployee, getGroups,
  addEmployeeToGroup, removeEmployeeFromGroup
} from '../api';
import GroupBadge from '../components/GroupBadge';

const EmployeeDetail: React.FC = () => {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const [employee,   setEmployee]   = useState<Employee | null>(null);
  const [allGroups,  setAllGroups]  = useState<Group[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    if (id) fetchData(id);
  }, [id]);

  const fetchData = async (empId: string) => {
    try {
      setLoading(true);
      const [emp, groups] = await Promise.all([
        getEmployee(empId),
        getGroups()
      ]);
      setEmployee(emp);
      setAllGroups(groups);
    } catch {
      toast.error('Failed to load employee');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToGroup = async (groupId: string) => {
    if (!employee) return;
    try {
      const updated = await addEmployeeToGroup(employee.id, groupId);
      setEmployee(updated);
      toast.success('Added to group!');
    } catch {
      toast.error('Failed to add to group');
    }
  };

  const handleRemoveFromGroup = async (groupId: string) => {
    if (!employee) return;
    try {
      const updated = await removeEmployeeFromGroup(employee.id, groupId);
      setEmployee(updated);
      toast.success('Removed from group');
    } catch {
      toast.error('Failed to remove from group');
    }
  };

  // Groups the employee is NOT part of yet
  const availableGroups = allGroups.filter(
    g => !employee?.groups.some(eg => eg.id === g.id)
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  if (!employee) return null;

  const initials = `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Employees
      </button>

      {/* Employee Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-blue-600 font-medium mt-0.5">{employee.role}</p>
            <p className="text-gray-500 text-sm mt-0.5">{employee.department}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {employee.email}
              </div>
              {employee.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {employee.phone}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Groups Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Group Memberships
        </h2>

        {/* Current Groups */}
        <div className="mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Current groups
          </p>
          {employee.groups.length === 0 ? (
            <p className="text-sm text-gray-400">Not part of any group yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {employee.groups.map(group => (
                <GroupBadge
                  key={group.id}
                  group={group}
                  onRemove={handleRemoveFromGroup}
                />
              ))}
            </div>
          )}
        </div>

        {/* Add to Group */}
        {availableGroups.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Add to group
            </p>
            <div className="flex flex-wrap gap-2">
              {availableGroups.map(group => (
                <button
                  key={group.id}
                  onClick={() => handleAddToGroup(group.id)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                >
                  + {group.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default EmployeeDetail;