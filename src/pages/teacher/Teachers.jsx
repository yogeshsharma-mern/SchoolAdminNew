import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiDelete } from '../../api/apiFetch';
import apiPath from '../../api/apiPath';
import ReusableTable from '../../components/table/Table';
import Loader from "../../components/loader/Loader";

export default function Teachers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 });
  const [sortingState, setSortingState] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const { data: allTeachersList, isLoading, error, isError, isFetching } = useQuery({
    queryKey: ["allteachers", paginationState, sortingState, globalFilter, columnFilters],
    queryFn: () => apiGet(apiPath.getAllTeachers, {
      page: paginationState.pageIndex + 1,
      limit: paginationState.pageSize,
      search: globalFilter,
      sort: sortingState[0]?.id,
      order: sortingState[0]?.desc ? 'desc' : 'asc',
      ...Object.fromEntries(columnFilters.map(f => [f.id, f.value]))
    }),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const deleteTeacherMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.teachers}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['allteachers']);
      setShowDeleteModal(false);
      setSelectedTeacher(null);
    },
    onError: (error) => {
      alert(error.message || 'Failed to delete teacher');
    }
  });

  const teachers = allTeachersList?.results?.docs || [];
  const totalCount = allTeachersList?.results?.totalDocs || 0;

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedTeacher) {
      deleteTeacherMutation.mutate(selectedTeacher._id);
    }
  };

  // Stats calculations
  const activeTeachers = teachers.filter(t => t.status === 'active').length;
  const totalExperience = teachers.reduce((sum, t) => sum + (t.experience || 0), 0);
  const avgSalary = Math.round(teachers.reduce((sum, t) => sum + (t.salaryInfo?.netSalary || 0), 0) / (teachers.length || 1));

  const columns = [
    {
      id: 'teacher',
      header: 'TEACHER',
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(var(--color-primary),0.2)] to-[rgba(var(--color-secondary),0.2)] p-0.5">
              <img 
                src={row.original.profilePic || 'https://ui-avatars.com/api/?background=6366f1&color=fff&name=' + encodeURIComponent(row.original.name)} 
                alt={row.original.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[rgba(var(--color-surface),1)] ${
              row.original.status === 'active' ? 'bg-[rgba(var(--color-success),1)]' : 'bg-[rgba(var(--color-danger),1)]'
            }`} />
          </div>
          <div>
            <p className="font-semibold text-[rgba(var(--color-text),1)]">{row.original.name}</p>
            <p className="text-xs text-[rgba(var(--color-muted),1)]">{row.original.employeeId}</p>
          </div>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'contact',
      header: 'CONTACT',
      accessorKey: 'email',
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-[rgba(var(--color-text),1)]">{row.original.email}</p>
          <p className="text-xs text-[rgba(var(--color-muted),1)] mt-0.5">{row.original.phone}</p>
        </div>
      ),
    },
    {
      id: 'designation',
      header: 'POSITION',
      accessorKey: 'designation',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-medium text-[rgba(var(--color-text),1)]">{row.original.designation || '—'}</p>
          <p className="text-xs text-[rgba(var(--color-muted),1)] mt-0.5">{row.original.experience || 0} years experience</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'qualifications',
      header: 'QUALIFICATIONS',
      accessorKey: 'qualifications',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.qualifications?.slice(0, 2).map((qual, idx) => (
            <span 
              key={idx}
              className="px-2 py-1 rounded-lg text-xs font-medium"
              style={{ 
                background: `linear-gradient(135deg, rgba(var(--color-primary),0.1), rgba(var(--color-secondary),0.05))`,
                color: `rgba(var(--color-primary), 1)`
              }}
            >
              {qual}
            </span>
          ))}
          {row.original.qualifications?.length > 2 && (
            <span className="text-xs text-[rgba(var(--color-muted),1)]">+{row.original.qualifications.length - 2}</span>
          )}
        </div>
      ),
    },
    {
      id: 'salary',
      header: 'COMPENSATION',
      accessorKey: 'salaryInfo.netSalary',
      cell: ({ row }) => (
        <div>
          <p className="text-sm font-bold text-[rgba(var(--color-primary),1)]">
            ₹{row.original.salaryInfo?.netSalary?.toLocaleString() || '—'}
          </p>
          <p className="text-xs text-[rgba(var(--color-muted),1)]">/ month</p>
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'status',
      header: 'STATUS',
      accessorKey: 'status',
      cell: ({ row }) => (
        <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm"
          style={{
            background: row.original.status === 'active' 
              ? `linear-gradient(135deg, rgba(var(--color-success),0.15), rgba(var(--color-success),0.05))`
              : `linear-gradient(135deg, rgba(var(--color-danger),0.15), rgba(var(--color-danger),0.05))`,
            color: row.original.status === 'active' 
              ? `rgba(var(--color-success), 1)` 
              : `rgba(var(--color-danger), 1)`,
            border: `1px solid ${row.original.status === 'active' ? 'rgba(var(--color-success),0.2)' : 'rgba(var(--color-danger),0.2)'}`
          }}
        >
          <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
            row.original.status === 'active' ? 'bg-[rgba(var(--color-success),1)] animate-pulse' : 'bg-[rgba(var(--color-danger),1)]'
          }`} />
          {row.original.status === 'active' ? 'Active' : 'Inactive'}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/teachers/view/${row.original._id}`)}
            className="group relative p-2 rounded-xl transition-all duration-300 hover:scale-110"
            style={{ color: `rgba(var(--color-info), 0.7)` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-info), 1)`;
              e.currentTarget.style.backgroundColor = `rgba(var(--color-info), 0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-info), 0.7)`;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="View Details"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => navigate(`/teachers/edit/${row.original._id}`)}
            className="group relative p-2 rounded-xl transition-all duration-300 hover:scale-110"
            style={{ color: `rgba(var(--color-primary), 0.7)` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-primary), 1)`;
              e.currentTarget.style.backgroundColor = `rgba(var(--color-primary), 0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-primary), 0.7)`;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Edit Teacher"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="group relative p-2 rounded-xl transition-all duration-300 hover:scale-110"
            style={{ color: `rgba(var(--color-danger), 0.7)` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-danger), 1)`;
              e.currentTarget.style.backgroundColor = `rgba(var(--color-danger), 0.1)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = `rgba(var(--color-danger), 0.7)`;
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title="Delete Teacher"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
      enableSorting: false,
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: `rgba(var(--color-bg), 1)` }}>
        <Loader size="lg" text="Loading teachers..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: `rgba(var(--color-bg), 1)` }}>
        <div className="text-center max-w-md">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-2xl flex items-center justify-center mb-6" 
              style={{ background: `linear-gradient(135deg, rgba(var(--color-danger),0.1), rgba(var(--color-danger),0.05))` }}>
              <svg className="w-12 h-12" style={{ color: `rgba(var(--color-danger), 1)` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{ color: `rgba(var(--color-text), 1)` }}>Connection Error</h3>
          <p className="text-sm mb-6" style={{ color: `rgba(var(--color-muted), 1)` }}>{error?.message || 'Unable to fetch teacher data'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, rgba(var(--color-primary),1), rgba(var(--color-secondary),1))`,
              color: 'white'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: `rgba(var(--color-bg), 1)` }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-primary),0.03)] to-[rgba(var(--color-secondary),0.03)] rounded-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" 
                style={{ background: `linear-gradient(135deg, rgba(var(--color-primary),0.1), rgba(var(--color-secondary),0.05))` }}>
                <div className="w-1.5 h-1.5 rounded-full bg-[rgba(var(--color-primary),1)] animate-pulse" />
                <span className="text-xs font-medium" style={{ color: `rgba(var(--color-primary), 1)` }}>TEACHER MANAGEMENT</span>
              </div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight" style={{ color: `rgba(var(--color-text), 1)` }}>
                Faculty Directory
              </h1>
              <p className="text-base mt-2" style={{ color: `rgba(var(--color-muted), 1)` }}>
                Manage and oversee all teaching staff in one centralized dashboard
              </p>
            </div>
            <button
              onClick={() => navigate('/admin/teachers/add')}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(var(--color-primary),1), rgba(var(--color-secondary),1))`,
                color: 'white'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add New Teacher</span>
            </button>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { 
              label: 'Total Faculty', 
              value: teachers.length, 
              icon: '👥', 
              color: 'primary',
              bgGradient: 'from-blue-500/20 to-cyan-500/20',
              change: '+12% this month'
            },
            { 
              label: 'Active Staff', 
              value: activeTeachers, 
              icon: '✅', 
              color: 'success',
              bgGradient: 'from-green-500/20 to-emerald-500/20',
              change: `${((activeTeachers / teachers.length) * 100).toFixed(0)}% active rate`
            },
            { 
              label: 'Total Experience', 
              value: `${totalExperience} yrs`, 
              icon: '📊', 
              color: 'purple',
              bgGradient: 'from-purple-500/20 to-pink-500/20',
              change: 'Combined experience'
            },
            { 
              label: 'Average Salary', 
              value: `₹${avgSalary.toLocaleString()}`, 
              icon: '💰', 
              color: 'orange',
              bgGradient: 'from-orange-500/20 to-amber-500/20',
              change: 'Monthly compensation'
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer overflow-hidden"
              style={{ 
                backgroundColor: `rgba(var(--color-surface), 1)`,
                border: `1px solid rgba(var(--color-border), 0.5)`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-6"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(var(--color-${stat.color}),0.15), rgba(var(--color-${stat.color}),0.05))`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: `rgba(var(--color-text), 1)` }}>{stat.value}</p>
                    <p className="text-xs mt-0.5" style={{ color: `rgba(var(--color-muted), 0.7)` }}>{stat.change}</p>
                  </div>
                </div>
                <p className="text-sm font-medium" style={{ color: `rgba(var(--color-muted), 1)` }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table Section */}
        <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm" style={{
          backgroundColor: `rgba(var(--color-surface), 1)`,
          border: `1px solid rgba(var(--color-border), 0.5)`,
          boxShadow: '0 20px 35px -10px rgba(0,0,0,0.1)'
        }}>
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-[rgba(var(--color-bg),0.8)] backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader size="md" text="Updating data..." />
            </div>
          )}
          <ReusableTable
            columns={columns}
            data={teachers}
            paginationState={paginationState}
            setPaginationState={setPaginationState}
            sortingState={sortingState}
            setSortingState={setSortingState}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            totalCount={totalCount}
            tablePlaceholder="Search by name, email, employee ID..."
            error={error}
            isError={isError}
            loading={isLoading}
            onNew={() => navigate('/admin/teachers/add')}
          />
        </div>
      </div>

      {/* Premium Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div 
            className="rounded-2xl max-w-md w-full p-0 transform transition-all animate-scaleIn overflow-hidden"
            style={{ 
              backgroundColor: `rgba(var(--color-surface), 1)`,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[rgba(var(--color-danger),0.1)] to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: `rgba(var(--color-danger), 0.15)` }}>
                    <svg className="w-7 h-7" style={{ color: `rgba(var(--color-danger), 1)` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: `rgba(var(--color-text), 1)` }}>Remove Teacher</h3>
                    <p className="text-sm" style={{ color: `rgba(var(--color-muted), 1)` }}>This action is permanent</p>
                  </div>
                </div>
                <p className="mb-6 leading-relaxed" style={{ color: `rgba(var(--color-text), 1)` }}>
                  Are you sure you want to remove <strong className="font-bold" style={{ color: `rgba(var(--color-danger), 1)` }}>{selectedTeacher?.name}</strong> from the system? All associated data, records, and documents will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: `rgba(var(--color-surface-hover), 1)`,
                      color: `rgba(var(--color-text), 1)`,
                      border: `1px solid rgba(var(--color-border), 1)`
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteTeacherMutation.isLoading}
                    className="flex-1 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(var(--color-danger),1), rgba(var(--color-danger),0.8))`,
                      color: 'white'
                    }}
                  >
                    {deleteTeacherMutation.isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </span>
                    ) : 'Delete Teacher'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}