import React, { useEffect, useState } from 'react';
import apiPath from '../../api/apiPath';
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from '../../api/apiFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Select from "react-select";
import Loader from '../../components/loader/Loader';
import toast from 'react-hot-toast';

export default function AcademicYear() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        academicSession: '',
        startDate: '',
        endDate: '',
        status: 'active'
    });

    // Generate academic years (current year and previous 4 years)
    const generateAcademicYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            const year = currentYear - i;
            years.push({
                value: `${year}-${year + 1}`,
                label: `${year}-${year + 1}`
            });
        }
        return years;
    };
    
    const validateForm = () => {
        const newErrors = {};

        if (!formData.academicSession) {
            newErrors.academicSession = "Academic session is required";
        }

        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
        }

        if (!formData.endDate) {
            newErrors.endDate = "End date is required";
        }

        if (formData.academicSession && formData.startDate && formData.endDate) {
            const [startYear, endYear] = formData.academicSession.split("-");
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start.getFullYear().toString() !== startYear) {
                newErrors.startDate = `Start date must be in year ${startYear}`;
            }

            if (end.getFullYear().toString() !== endYear) {
                newErrors.endDate = `End date must be in year ${endYear}`;
            }

            if (end <= start) {
                newErrors.endDate = "End date must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const academicYearOptions = generateAcademicYears();

    // Custom styles for react-select using CSS variables
    const selectStyles = {
        control: (base) => ({
            ...base,
            borderColor: `rgb(var(--color-border) / 1)`,
            backgroundColor: `rgb(var(--color-surface) / 1)`,
            '&:hover': {
                borderColor: `rgb(var(--color-muted) / 1)`
            },
            boxShadow: 'none',
            '&:focus': {
                borderColor: `rgb(var(--color-primary) / 1)`,
                boxShadow: `0 0 0 2px rgb(var(--color-primary) / 0.1)`
            }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected 
                ? `rgb(var(--color-primary) / 1)` 
                : state.isFocused 
                    ? `rgb(var(--color-primary) / 0.1)` 
                    : `rgb(var(--color-surface) / 1)`,
            color: state.isSelected 
                ? `rgb(var(--color-surface) / 1)` 
                : `rgb(var(--color-text) / 1)`,
            '&:hover': {
                backgroundColor: `rgb(var(--color-primary) / 0.1)`
            }
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: `rgb(var(--color-surface) / 1)`,
            border: `1px solid rgb(var(--color-border) / 1)`
        }),
        singleValue: (base) => ({
            ...base,
            color: `rgb(var(--color-text) / 1)`
        }),
        placeholder: (base) => ({
            ...base,
            color: `rgb(var(--color-muted-light) / 1)`
        })
    };

    // Fetch all academic sessions
    const { data: academicSessions, isLoading, error } = useQuery({
        queryKey: ['academicSessions'],
        queryFn: () => apiGet(apiPath.getAcademicSessions)
    });
    
    // Create mutation
    const createMutation = useMutation({
        mutationFn: (newData) => apiPost(apiPath.createAcademicSession, newData),
        onSuccess: (res) => {
            queryClient.invalidateQueries(['academicSessions']);
            toast.success(res?.message);
            closeModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => apiPut(`${apiPath.updateAcademeicSession}/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['academicSessions']);
            closeModal();
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => apiDelete(`${apiPath.setting.getAcademicSession}/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['academicSessions']);
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        setErrors(prev => ({
            ...prev,
            [name]: ""
        }));

        if (name === 'startDate' && value) {
            const startDate = new Date(value);
            const endDate = new Date(startDate);
            endDate.setFullYear(startDate.getFullYear() + 1);

            setFormData(prev => ({
                ...prev,
                endDate: endDate.toISOString().split('T')[0]
            }));
        }
    };
    
    const handleAcademicSessionSelect = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            academicSession: selectedOption.value
        }));

        setErrors(prev => ({
            ...prev,
            academicSession: ""
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const payload = {
            academicSession: formData.academicSession,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status
        };

        if (editingItem) {
            updateMutation.mutate({ id: editingItem._id, data: payload });
        } else {
            createMutation.mutate(payload);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            academicSession: item.academicSession,
            startDate: item.startDate.split('T')[0],
            endDate: item.endDate.split('T')[0],
            status: item.status
        });
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this academic year?')) {
            deleteMutation.mutate(id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setErrors({});
        setFormData({
            academicSession: '',
            startDate: '',
            endDate: '',
            status: 'inactive'
        });
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const getStatusBadge = (status) => {
        const badges = {
            active: `bg-[rgb(var(--color-success)_/_0.1)] text-[rgb(var(--color-success)_/_1)] border border-[rgb(var(--color-success)_/_0.2)]`,
            inactive: `bg-[rgb(var(--color-muted)_/_0.1)] text-[rgb(var(--color-muted)_/_1)] border border-[rgb(var(--color-muted)_/_0.2)]`,
            upcoming: `bg-[rgb(var(--color-info)_/_0.1)] text-[rgb(var(--color-info)_/_1)] border border-[rgb(var(--color-info)_/_0.2)]`,
            completed: `bg-[rgb(var(--color-primary)_/_0.1)] text-[rgb(var(--color-primary)_/_1)] border border-[rgb(var(--color-primary)_/_0.2)]`
        };
        return badges[status] || `bg-[rgb(var(--color-muted)_/_0.1)] text-[rgb(var(--color-muted)_/_1)] border border-[rgb(var(--color-muted)_/_0.2)]`;
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            {academicSessions?.results?.length === 0 && (
                <div className="text-center py-20 text-[rgb(var(--color-muted)_/_1)]">
                    No academic years found.
                </div>
            )}
            
            <div className="min-h-screen bg-[rgb(var(--color-bg)_/_1)]">
                {/* Simple Header */}
                <div className="bg-[rgb(var(--color-surface)_/_1)] border-b border-[rgb(var(--color-border)_/_1)]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-[rgb(var(--color-text)_/_1)]">
                                    Academic Years
                                </h1>
                                <p className="mt-1 text-sm text-[rgb(var(--color-muted)_/_1)]">
                                    Manage and track academic sessions
                                </p>
                            </div>
                            <button
                                onClick={openModal}
                                className="inline-flex items-center px-4 py-2 bg-[rgb(var(--color-primary)_/_1)] hover:bg-[rgb(var(--color-primary-dark)_/_1)] text-[rgb(var(--color-surface)_/_1)] text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.5)] focus:ring-offset-2 focus:ring-offset-[rgb(var(--color-surface)_/_1)]"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New Academic Year
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-[rgb(var(--color-surface)_/_1)] rounded-xl border border-[rgb(var(--color-border)_/_1)] p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[rgb(var(--color-muted)_/_1)]">
                                        Total Years
                                    </p>
                                    <p className="text-2xl font-semibold text-[rgb(var(--color-text)_/_1)] mt-2">
                                        {academicSessions?.results?.length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-[rgb(var(--color-primary)_/_0.1)] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[rgb(var(--color-primary)_/_1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[rgb(var(--color-surface)_/_1)] rounded-xl border border-[rgb(var(--color-border)_/_1)] p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[rgb(var(--color-muted)_/_1)]">
                                        Active Years
                                    </p>
                                    <p className="text-2xl font-semibold text-[rgb(var(--color-text)_/_1)] mt-2">
                                        {academicSessions?.results?.filter(item => item.status === 'active').length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-[rgb(var(--color-success)_/_0.1)] rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-[rgb(var(--color-success)_/_1)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[rgb(var(--color-surface)_/_1)] rounded-xl border border-[rgb(var(--color-border)_/_1)] p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[rgb(var(--color-muted)_/_1)]">
                                        Current Session
                                    </p>
                                    <p className="text-lg font-semibold text-[rgb(var(--color-text)_/_1)] mt-2">
                                        {academicSessions?.results?.find(item => item.status === "active")?.academicSession || "Not set"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="mt-8 bg-[rgb(var(--color-surface)_/_1)] rounded-xl border border-[rgb(var(--color-border)_/_1)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[rgb(var(--color-border)_/_1)]">
                                <thead className="bg-[rgb(var(--color-surface-hover)_/_1)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-muted)_/_1)] uppercase tracking-wider">
                                            Session
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-muted)_/_1)] uppercase tracking-wider">
                                            Start Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-muted)_/_1)] uppercase tracking-wider">
                                            End Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[rgb(var(--color-muted)_/_1)] uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-[rgb(var(--color-muted)_/_1)] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[rgb(var(--color-surface)_/_1)] divide-y divide-[rgb(var(--color-border)_/_1)]">
                                    {academicSessions?.results?.map((item) => (
                                        <tr key={item._id} className="hover:bg-[rgb(var(--color-surface-hover)_/_1)] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[rgb(var(--color-text)_/_1)]">
                                                {item.academicSession}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--color-muted)_/_1)]">
                                                {new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[rgb(var(--color-muted)_/_1)]">
                                                {new Date(item.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadge(item.status)}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-[rgb(var(--color-muted)_/_1)] hover:text-[rgb(var(--color-primary)_/_1)] mr-4 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 flex justify-center items-center bg-[rgb(var(--color-text)_/_0.5)] transition-opacity">
                                {/* Modal panel */}
                                <div className="relative inline-block transform overflow-hidden rounded-xl bg-[rgb(var(--color-surface)_/_1)] text-left align-bottom shadow-2xl transition-all sm:my-8 lg:w-full lg:max-w-lg w-full sm:align-middle">
                                    {/* Header */}
                                    <div className="px-6 py-4 border-b border-[rgb(var(--color-border)_/_1)]">
                                        <h3 className="text-lg font-medium text-[rgb(var(--color-text)_/_1)]">
                                            {editingItem ? 'Edit Academic Year' : 'Create Academic Year'}
                                        </h3>
                                        <p className="mt-1 text-sm text-[rgb(var(--color-muted)_/_1)]">
                                            {editingItem ? 'Update the details below' : 'Fill in the information below'}
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className="px-6 py-4 space-y-4">
                                            {/* Academic Session */}
                                            <div>
                                                <label className="block text-sm font-medium text-[rgb(var(--color-text)_/_1)] mb-1">
                                                    Academic Session <span className="text-[rgb(var(--color-primary)_/_1)]">*</span>
                                                </label>
                                                <Select
                                                    options={academicYearOptions}
                                                    onChange={handleAcademicSessionSelect}
                                                    value={academicYearOptions.find(option => option.value === formData.academicSession)}
                                                    placeholder="Select session"
                                                    styles={selectStyles}
                                                />
                                                {errors.academicSession && (
                                                    <p className="text-[rgb(var(--color-danger)_/_1)] text-xs mt-1">
                                                        {errors.academicSession}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Start Date */}
                                            <div>
                                                <label className="block text-sm font-medium text-[rgb(var(--color-text)_/_1)] mb-1">
                                                    Start Date <span className="text-[rgb(var(--color-primary)_/_1)]">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-[rgb(var(--color-surface)_/_1)] border border-[rgb(var(--color-border)_/_1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] focus:border-[rgb(var(--color-primary)_/_1)] text-[rgb(var(--color-text)_/_1)] text-sm"
                                                />
                                                {errors.startDate && (
                                                    <p className="text-[rgb(var(--color-danger)_/_1)] text-xs mt-1">
                                                        {errors.startDate}
                                                    </p>
                                                )}
                                            </div>

                                            {/* End Date */}
                                            <div>
                                                <label className="block text-sm font-medium text-[rgb(var(--color-text)_/_1)] mb-1">
                                                    End Date <span className="text-[rgb(var(--color-primary)_/_1)]">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-[rgb(var(--color-surface)_/_1)] border border-[rgb(var(--color-border)_/_1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] focus:border-[rgb(var(--color-primary)_/_1)] text-[rgb(var(--color-text)_/_1)] text-sm"
                                                />
                                                {errors.endDate && (
                                                    <p className="text-[rgb(var(--color-danger)_/_1)] text-xs mt-1">
                                                        {errors.endDate}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div>
                                                <label className="block text-sm font-medium text-[rgb(var(--color-text)_/_1)] mb-1">
                                                    Status
                                                </label>
                                                <select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 bg-[rgb(var(--color-surface)_/_1)] border border-[rgb(var(--color-border)_/_1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] focus:border-[rgb(var(--color-primary)_/_1)] text-[rgb(var(--color-text)_/_1)] text-sm"
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="upcoming">Upcoming</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="px-6 py-4 bg-[rgb(var(--color-surface-hover)_/_1)] border-t border-[rgb(var(--color-border)_/_1)] flex items-center justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={closeModal}
                                                className="px-4 py-2 text-sm font-medium text-[rgb(var(--color-text)_/_1)] hover:text-[rgb(var(--color-text)_/_1)] bg-[rgb(var(--color-surface)_/_1)] border border-[rgb(var(--color-border)_/_1)] rounded-lg hover:bg-[rgb(var(--color-surface-hover)_/_1)] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.2)] transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={createMutation.isPending || updateMutation.isPending}
                                                className="px-4 py-2 text-sm font-medium text-[rgb(var(--color-surface)_/_1)] bg-[rgb(var(--color-primary)_/_1)] hover:bg-[rgb(var(--color-primary-dark)_/_1)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary)_/_0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {createMutation.isPending || updateMutation.isPending ? (
                                                    <span className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[rgb(var(--color-surface)_/_1)]" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                        </svg>
                                                        Saving...
                                                    </span>
                                                ) : (
                                                    editingItem ? 'Update' : 'Create'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}