import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Employee, EmployeeCreate } from '../types';
import {
  getEmployees, createEmployee,
  updateEmployee, deleteEmployee
} from '../api';
import EmployeeCard   from '../components/EmployeeCard';
import EmployeeModal  from '../components/EmployeeModal';

const EmployeesPage: React.FC = () => {
  const [employees,  setEmployees]  = useState<Employee[]>([]);
  const [filtered,   setFiltered]   = useState<Employee[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees when search changes
  useEffect(() => {
    const query = search.toLowerCase();
    setFiltered(
      employees.filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query)      ||
        emp.department.toLowerCase().includes(query) ||
        emp.role.toLowerCase().includes(query)
      )
    );
  }, [search, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: EmployeeCreate) => {
    try {
      if (editTarget) {
        const updated = await updateEmployee(editTarget.id, data);
        setEmployees(prev => prev.map(e => e.id === updated.id ? updated : e));
        toast.success('Employee updated!');
      } else {
        const created = await createEmployee(data);
        setEmployees(prev => [...prev, created]);
        toast.success('Employee added!');
      }
      setModalOpen(false);
      setEditTarget(null);
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(prev => prev.filter(e => e.id !== id));
      toast.success('Employee deleted');
    } catch {
      toast.error('Failed to delete employee');
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditTarget(employee);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-1">
            {employees.length} total employees
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, department or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-20">
          <svg className="mx-auto w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-500 font-medium">No employees found</p>
          <p className="text-gray-400 text-sm mt-1">
            {search ? 'Try a different search term' : 'Add your first employee to get started'}
          </p>
        </div>
      )}

      {/* Employee Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(employee => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSubmit={handleCreate}
        employee={editTarget}
      />

    </div>
  );
};

export default EmployeesPage;