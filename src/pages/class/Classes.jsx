import React, { useState, useMemo } from 'react';
import apiPath from '../../api/apiPath';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/apiFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReusableTable from "../../components/table/Table";
import { Pencil, Trash2, Plus, X, AlertCircle } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Select from "react-select";
import toast from 'react-hot-toast';

export default function Classes() {
  const queryClient = useQueryClient();
  
  // State management
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10
  });
  const [sortingState, setSortingState] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    streams: '',
    academicSessionId: ''
  });

  // Fetch classes data
  const { data: classesData, isLoading, isError, error } = useQuery({
    queryKey: ["classes"],
    queryFn: () => apiGet(apiPath.getClasses),
  });

  const {data:academicSessions} = useQuery({
    queryKey:["academicYears"],
    queryFn:()=>apiGet(apiPath.getAcademicSessions)
  });
const academicYearOptions = academicSessions?.results?.map((item,i)=>
({
  label:item.academicSession,
       value:item._id
}
)
)

console.log("academicyearOptions",academicYearOptions);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (newClass) => apiPost(apiPath.createClass, newClass),
    onSuccess: (res) => {
      toast.success(res?.message);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      setFormErrors({ submit: error.message || 'Failed to create class' });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiPut(`${apiPath.updateClass}/${id}`, data),
    onSuccess: (res) => {
toast.success(res?.message);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setShowModal(false);
      resetForm();
    },
    onError: (error) => {
      // console.log("err.responnse",error.response.data.message);
      toast.error(error?.response?.data?.message);
      setFormErrors({ submit: error.message || 'Failed to update class' });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.deleteClass}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });

  // Transform API data for table display
  const transformedData = useMemo(() => {
    if (!classesData?.data) return [];
    
    const flatData = [];
    
    classesData.data.forEach((classItem) => {
      if (classItem.sections && classItem.sections.length > 0) {
        classItem.sections.forEach((section) => {
          flatData.push({
            id: section._id,
            className: classItem.name,
            sectionName: section.name,
            stream: classItem.streams || '-',
            studentCount: section.studentCount || 0,
            totalStudents: classItem.studentCount || 0,
            createdAt: classItem.createdAt,
            classId: classItem._id,
            sectionId: section._id,
            originalClass: classItem,
            originalSection: section
          });
        });
      } else {
        flatData.push({
          id: classItem._id,
          className: classItem.name,
          sectionName: '-',
          stream: classItem.streams || '-',
          studentCount: classItem.studentCount || 0,
          totalStudents: classItem.studentCount || 0,
          createdAt: classItem.createdAt,
          classId: classItem._id,
          sectionId: null,
          originalClass: classItem,
          originalSection: null
        });
      }
    });
    
    return flatData;
  }, [classesData]);

  const resetForm = () => {
    setFormData({
      name: '',
      streams: '',
      academicSessionId: '69b51a1b0a14d3e9216a1285'
    });
    setFormErrors({});
    setEditingItem(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.className,
      streams: item.stream !== '-' ? item.stream : '',
      academicSessionId: '69b51a1b0a14d3e9216a1285'
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.className}${item.sectionName !== '-' ? ` - ${item.sectionName}` : ''}?`)) {
      if (item.sectionId) {
        await deleteMutation.mutateAsync(item.sectionId);
      } else {
        await deleteMutation.mutateAsync(item.classId);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) {
      errors.name = 'Class name is required';
    }
    
    if ((formData.name === '11' || formData.name === '12') && !formData.streams) {
      errors.streams = 'Stream is required for classes 11 and 12';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const payload = {
      name: formData.name,
      academicSessionId: formData.academicSessionId
    };
    
    // Add streams only for classes 11 and 12
    if (formData.name === '11' || formData.name === '12') {
      payload.streams = formData.streams;
    }
    
    if (editingItem) {
      await updateMutation.mutateAsync({
        id: editingItem.classId,
        data: payload
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
  };

  // Available class options based on schema enum
  const classOptions = [
    { value: 'Prep', label: 'Preparatory', requiresStream: false },
    { value: 'PreKG', label: 'Pre-Kindergarten', requiresStream: false },
    { value: 'KG', label: 'Kindergarten', requiresStream: false },
    { value: '1', label: '1st ', requiresStream: false },
    { value: '2', label: '2nd ', requiresStream: false },
    { value: '3', label: '3rd ', requiresStream: false },
    { value: '4', label: '4th ', requiresStream: false },
    { value: '5', label: '5th ', requiresStream: false },
    { value: '6', label: '6th ', requiresStream: false },
    { value: '7', label: '7th ', requiresStream: false },
    { value: '8', label: '8th ', requiresStream: false },
    { value: '9', label: '9th ', requiresStream: false },
    { value: '10', label: '10th ', requiresStream: false },
    { value: '11', label: '11th ', requiresStream: true },
    { value: '12', label: '12th ', requiresStream: true }
  ];

  // Stream options for 11th and 12th
  const streamOptions = [
    { value: 'Commerce', label: 'Commerce', icon: '📊' },
    { value: 'Arts', label: 'Arts', icon: '🎨' },
    { value: 'Science-Math', label: 'Science with Mathematics', icon: '🔬' },
    { value: 'Science-Biology', label: 'Science with Biology', icon: '🧬' }
  ];

  // Check if selected class requires stream
  const requiresStream = formData.name === '11' || formData.name === '12';
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    // minHeight: "56px",
    height: "56px",
    borderColor: state.isFocused ? "#1976d2" : "#e5e7eb",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(25, 118, 210, 0.2)"
      : "none",
    "&:hover": { borderColor: "#1976d2" },
    borderRadius: "8px",
    fontSize: "0.95rem",
    backgroundColor: state.isDisabled ? "#f9fafb" : "white",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "56px",
    padding: "0 12px",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "56px",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),

  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "8px",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#1976d2"
      : state.isFocused
        ? "#e8f0fe"
        : "white",
    color: state.isSelected ? "white" : "#1f2937",
    cursor: "pointer",
  }),
};

  const customStreamSelectStyles = {
    ...customSelectStyles,
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(var(--color-purple), 0.1)' : 'transparent',
      color: 'rgba(var(--color-text), 0.9)',
      cursor: 'pointer',
      padding: '10px 12px',
      '&:active': {
        backgroundColor: 'rgba(var(--color-purple), 0.2)'
      }
    })
  };
  // Define table columns with custom cell rendering including actions
  const columns = useMemo(() => [
    {
      accessorKey: "className",
      header: "Class",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-primary), 0.1) 0%, rgba(var(--color-primary), 0.05) 100%)',
            color: 'rgba(var(--color-primary), 1)'
          }}>
            {getValue()}
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
              {getValue()}{!isNaN(getValue()) && getValue() !== 'Prep' && getValue() !== 'PreKG' && getValue() !== 'KG' ? 'th' : ''} Grade
            </div>
            <div className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.6)' }}>
              Class
            </div>
          </div>
        </div>
      )
    },
    {
      accessorKey: "sectionName",
      header: "Section",
      cell: ({ getValue }) => (
        getValue() !== '-' ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-secondary), 0.1) 0%, rgba(var(--color-secondary), 0.05) 100%)',
            color: 'rgba(var(--color-secondary), 1)'
          }}>
            <span className="text-base">📚</span>
            Section {getValue()}
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'rgba(var(--color-muted), 0.5)' }}>—</span>
        )
      )
    },
    {
      accessorKey: "stream",
      header: "Stream",
      cell: ({ getValue }) => {
        const stream = getValue();
        const streamIcon = stream === 'Commerce' ? '📊' : stream === 'Arts' ? '🎨' : stream === 'Science-Math' ? '🔬' : stream === 'Science-Biology' ? '🧬' : '';
        return stream !== '-' ? (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-purple), 0.1) 0%, rgba(var(--color-purple), 0.05) 100%)',
            color: 'rgba(var(--color-purple), 1)'
          }}>
            <span>{streamIcon}</span>
            {stream}
          </div>
        ) : (
          <span className="text-sm" style={{ color: 'rgba(var(--color-muted), 0.5)' }}>—</span>
        );
      }
    },
    {
      accessorKey: "studentCount",
      header: "Students",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
              {getValue()}
            </span>
            <span className="text-xs" style={{ color: 'rgba(var(--color-muted), 0.6)' }}>
              enrolled
            </span>
          </div>
        </div>
      )
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ getValue }) => {
        const date = new Date(getValue());
        return (
          <div className="text-sm" style={{ color: 'rgba(var(--color-muted), 0.7)' }}>
            {date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleEdit(item)}
              className="p-2 rounded-lg transition-all duration-200 group"
              style={{
                color: 'rgba(var(--color-muted), 0.6)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--color-primary), 0.1)';
                e.currentTarget.style.color = 'rgba(var(--color-primary), 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(var(--color-muted), 0.6)';
              }}
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="p-2 rounded-lg transition-all duration-200 group"
              style={{
                color: 'rgba(var(--color-muted), 0.6)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--color-danger), 0.1)';
                e.currentTarget.style.color = 'rgba(var(--color-danger), 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'rgba(var(--color-muted), 0.6)';
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        );
      }
    }
  ], []);

  // Filter data based on global search
  const filteredData = useMemo(() => {
    if (!globalFilter) return transformedData;
    
    const searchTerm = globalFilter.toLowerCase();
    return transformedData.filter(item => 
      item.className.toLowerCase().includes(searchTerm) ||
      item.sectionName.toLowerCase().includes(searchTerm) ||
      item.stream.toLowerCase().includes(searchTerm)
    );
  }, [transformedData, globalFilter]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = paginationState.pageIndex * paginationState.pageSize;
    const endIndex = startIndex + paginationState.pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, paginationState.pageIndex, paginationState.pageSize]);

  // Calculate stats
  const stats = useMemo(() => {
    const uniqueClasses = new Set(transformedData.map(item => item.className)).size;
    const totalSections = transformedData.length;
    const totalStudents = transformedData.reduce((sum, item) => sum + item.studentCount, 0);
    return { uniqueClasses, totalSections, totalStudents };
  }, [transformedData]);

  return (
    <div className="min-h-screen p-6" style={{
      backgroundColor: 'rgba(var(--color-bg), 1)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgba(var(--color-text), 1)' }}>
                Classes Management
              </h1>
              <p className="text-sm" style={{ color: 'rgba(var(--color-muted), 0.8)' }}>
                Manage academic classes, sections, and streams
              </p>
            </div>
            
            {/* Add Button */}
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              style={{
                // background: '',
                // color: 'white',
                boxShadow: '0 4px 12px rgba(var(--color-primary), 0.3)'
              }}
            >
              <Plus size={18} />
              Add New Class
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="rounded-2xl p-5 transition-all duration-200 shadow hover:shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-surface), 1) 0%, rgba(var(--color-surface-hover), 0.5) 100%)',
            border: '1px solid rgba(var(--color-border), 0.2)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'rgba(var(--color-muted), 0.7)' }}>Total Classes</p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, rgba(var(--color-primary), 0.1) 0%, rgba(var(--color-primary), 0.05) 100%)'
              }}>
                <span className="text-xl">📚</span>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'rgba(var(--color-primary), 1)' }}>
              {stats.uniqueClasses}
            </p>
          </div>
          
          <div className="rounded-2xl p-5 transition-all duration-200 shadow hover:shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-surface), 1) 0%, rgba(var(--color-surface-hover), 0.5) 100%)',
            border: '1px solid rgba(var(--color-border), 0.2)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'rgba(var(--color-muted), 0.7)' }}>Total Sections</p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, rgba(var(--color-secondary), 0.1) 0%, rgba(var(--color-secondary), 0.05) 100%)'
              }}>
                <span className="text-xl">📖</span>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'rgba(var(--color-secondary), 1)' }}>
              {stats.totalSections}
            </p>
          </div>
          
          <div className="rounded-2xl p-5 transition-all duration-200 shadow hover:shadow-lg" style={{
            background: 'linear-gradient(135deg, rgba(var(--color-surface), 1) 0%, rgba(var(--color-surface-hover), 0.5) 100%)',
            border: '1px solid rgba(var(--color-border), 0.2)'
          }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'rgba(var(--color-muted), 0.7)' }}>Total Students</p>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, rgba(var(--color-success), 0.1) 0%, rgba(var(--color-success), 0.05) 100%)'
              }}>
                <span className="text-xl">👨‍🎓</span>
              </div>
            </div>
            <p className="text-3xl font-bold" style={{ color: 'rgba(var(--color-success), 1)' }}>
              {stats.totalStudents}
            </p>
          </div>
        </div>

        {/* Table Component */}
        <ReusableTable
          columns={columns}
          data={paginatedData}
          paginationState={paginationState}
          setPaginationState={setPaginationState}
          sortingState={sortingState}
          setSortingState={setSortingState}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          totalCount={filteredData.length}
          tablePlaceholder="Search by class, section, or stream..."
          error={error}
          isError={isError}
          fetching={isLoading}
          loading={isLoading}
        />

        {/* Modern Modal for Add/Edit */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <div className="relative">
            {/* Close Button */}
            {/* <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg transition-all duration-200 hover:bg-opacity-10"
              style={{
                color: 'rgba(var(--color-muted), 0.6)',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(var(--color-muted), 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <X size={18} />
            </button> */}

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgba(var(--color-text), 1)' }}>
                {editingItem ? 'Edit Class' : 'Add New Class'}
              </h2>
              <p className="text-sm" style={{ color: 'rgba(var(--color-muted), 0.7)' }}>
                {editingItem ? 'Update class information' : 'Create a new academic class'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Class Name Selection */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                  Class Name <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, name: value, streams: '' });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                  }}
                  className={`w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                    formErrors.name ? 'border-red-500' : ''
                  }`}
                  style={{
                    backgroundColor: 'rgba(var(--color-surface), 1)',
                    border: `1px solid rgba(var(--color-border), ${formErrors.name ? '0.8' : '0.4'})`,
                    color: 'rgba(var(--color-text), 1)'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(var(--color-primary), 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(var(--color-primary), 0.1)';
                    e.currentTarget.style.outline = 'none';
                  }}
                  onBlur={(e) => {
                    if (!formErrors.name) {
                      e.currentTarget.style.borderColor = 'rgba(var(--color-border), 0.4)';
                    }
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select class</option>
                  {classOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {formErrors.name && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle size={12} style={{ color: 'rgba(var(--color-danger), 1)' }} />
                    <p className="text-xs" style={{ color: 'rgba(var(--color-danger), 0.9)' }}>
                      {formErrors.name}
                    </p>
                  </div>
                )}
                <p className="text-xs mt-2" style={{ color: 'rgba(var(--color-muted), 0.6)' }}>
                  {requiresStream 
                    ? '✨ For 11th and 12th, stream selection is mandatory' 
                    : '📘 For classes 1-10, no stream selection needed'}
                </p>
              </div>

              {/* Stream Selection - Auto shows for 11th/12th */}
              {requiresStream && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                    Stream <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {streamOptions.map((stream) => (
                      <button
                        key={stream.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, streams: stream.value });
                          if (formErrors.streams) setFormErrors({ ...formErrors, streams: null });
                        }}
                        className={`p-3 rounded-xl text-left transition-all duration-200 ${
                          formData.streams === stream.value
                            ? 'ring-2 ring-primary'
                            : 'hover:bg-opacity-10'
                        }`}
                        style={{
                          backgroundColor: formData.streams === stream.value
                            ? 'rgba(var(--color-primary), 0.1)'
                            : 'rgba(var(--color-surface-hover), 0.5)',
                          border: `1px solid rgba(var(--color-border), 0.3)`
                        }}
                      >
                        <div className="text-2xl mb-1">{stream.icon}</div>
                        <div className="text-sm font-medium" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                          {stream.label}
                        </div>
                      </button>
                    ))}
                  </div>
                  {formErrors.streams && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <AlertCircle size={12} style={{ color: 'rgba(var(--color-danger), 1)' }} />
                      <p className="text-xs" style={{ color: 'rgba(var(--color-danger), 0.9)' }}>
                        {formErrors.streams}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Academic Session */}
                 <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'rgba(var(--color-text), 0.9)' }}>
                  Academic Session <span className="text-red-500">*</span>
                </label>
                <Select
                  options={academicYearOptions}
          value={academicYearOptions?.find(
  (opt) => opt.value === formData.academicSessionId
)}

                  onChange={(selected) => {
                    console.log("selected",selected);
                    setFormData({ ...formData,  academicSessionId: selected?.value || ""});
                    if (formErrors.academicSessionId) setFormErrors({ ...formErrors, academicSessionId: null });
                  }}
                  placeholder="Select academic session..."
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  isSearchable
                />
                {formErrors.academicSessionId && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle size={12} style={{ color: 'rgba(var(--color-danger), 1)' }} />
                    <p className="text-xs" style={{ color: 'rgba(var(--color-danger), 0.9)' }}>
                      {formErrors.academicSessionId}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Error */}
              {formErrors.submit && (
                <div className="p-3 rounded-xl" style={{
                  backgroundColor: 'rgba(var(--color-danger), 0.1)',
                  border: '1px solid rgba(var(--color-danger), 0.2)'
                }}>
                  <p className="text-sm" style={{ color: 'rgba(var(--color-danger), 0.9)' }}>
                    {formErrors.submit}
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(var(--color-border), 0.5)',
                    color: 'rgba(var(--color-muted), 0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(var(--color-muted), 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="flex-1 px-4 py-3 rounded-xl font-medium border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  // style={{
                  //   background: 'linear-gradient(135deg, rgba(var(--color-primary), 1) 0%, rgba(var(--color-primary-dark), 1) 100%)'
                  // }}
                >
                  {createMutation.isLoading || updateMutation.isLoading 
                    ? 'Saving...' 
                    : editingItem ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}