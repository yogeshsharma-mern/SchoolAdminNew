import React, { useState, useEffect, useCallback } from "react";
import apiPath from "../../api/apiPath";
import { apiGet, apiPost, apiPatch, apiDelete, apiPut } from "../../api/apiFetch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReusableTable from "../../components/table/Table";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

/* ─────────────────────────────────────────────
   Inline debounce hook
───────────────────────────────────────────── */
function useDebounce(value, delay = 400) {
    const [dv, setDv] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDv(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return dv;
}

/* ─────────────────────────────────────────────
   Allowed section letters
───────────────────────────────────────────── */
const SECTION_LETTERS = ["A", "B", "C", "D"];

/* ─────────────────────────────────────────────
   CSS variable shorthand helpers
   rgb(var(--color-X)) usage throughout
───────────────────────────────────────────── */
const cv = (name) => `rgb(var(--color-${name}))`;
const cva = (name, alpha) => `rgba(var(--color-${name}),${alpha})`;

/* ─────────────────────────────────────────────
   Micro SVG icons (stroke-only, inherits color)
───────────────────────────────────────────── */
const Icon = {
    Layers: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.9" viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    ),
    Book: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        </svg>
    ),
    Calendar: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    ),
    Plus: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    Edit: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    ),
    Trash: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
        </svg>
    ),
    X: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    ),
    Chevron: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" />
        </svg>
    ),
    Alert: (p) => (
        <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    ),
    Spinner: (p) => (
        <svg {...p} fill="none" viewBox="0 0 24 24" style={{ ...(p.style || {}), animation: "sc-spin .7s linear infinite" }}>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" />
            <path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    ),
};

/* ─────────────────────────────────────────────
   Validation
───────────────────────────────────────────── */
function validate(data) {
    const e = {};
    if (!data.name) e.name = "Please select a section";
    else if (!SECTION_LETTERS.includes(data.name)) e.name = "Only A, B, C or D allowed";
    if (!data.classId) e.classId = "Please select a class";
    return e;
}

/* ─────────────────────────────────────────────
   Modal
───────────────────────────────────────────── */
function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);
    if (!isOpen) return null;
    return (
        <div className="sc-modal-overlay" onClick={onClose}>
            <div className="sc-modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="sc-modal-head">
                    <span className="sc-modal-title">{title}</span>
                    <button className="sc-icon-btn" onClick={onClose} aria-label="Close">
                        <Icon.X width={14} height={14} />
                    </button>
                </div>
                <div className="sc-modal-body">{children}</div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Confirm Dialog
───────────────────────────────────────────── */
function ConfirmDialog({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;
    return (
        <div className="sc-modal-overlay sc-confirm-overlay" onClick={onCancel}>
            <div className="sc-confirm-box" onClick={(e) => e.stopPropagation()}>
                <div className="sc-confirm-icon-row">
                    <span className="sc-danger-icon"><Icon.Trash width={15} height={15} /></span>
                    <span className="sc-confirm-title">Delete Section?</span>
                </div>
                <p className="sc-confirm-msg">This action is permanent and cannot be undone.</p>
                <div className="sc-confirm-actions">
                    <button className="sc-btn sc-btn-ghost" onClick={onCancel}>Cancel</button>
                    <button className="sc-btn sc-btn-danger" onClick={onConfirm}>Yes, Delete</button>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Field + error
───────────────────────────────────────────── */
function Field({ label, error, required, children }) {
    return (
        <div className="sc-field">
            <label className="sc-label">
                {label}{required && <span className="sc-required">*</span>}
            </label>
            {children}
            {error && (
                <div className="sc-field-error">
                    <Icon.Alert width={12} height={12} /> {error}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Section Letter Picker
───────────────────────────────────────────── */
function SectionPicker({ value, onChange, hasError }) {
    return (
        <div className="sc-picker">
            {SECTION_LETTERS.map((l) => (
                <button
                    key={l}
                    type="button"
                    onClick={() => onChange(l)}
                    className={`sc-chip ${value === l ? "sc-chip-active" : ""} ${hasError ? "sc-chip-error" : ""}`}
                >
                    {l}
                </button>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────────
   Styled Select
───────────────────────────────────────────── */
function StyledSelect({ value, onChange, options, placeholder, name, hasError }) {
    return (
        <div className="sc-select-wrap">
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`sc-select ${hasError ? "sc-select-error" : ""}`}
            >
                <option value="">{placeholder}</option>
                {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
            <span className="sc-select-arrow"><Icon.Chevron width={13} height={13} /></span>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
function StatCard({ icon: IconComp, label, value, colorVar }) {
    return (
        <div className="sc-stat-card">
            <div className="sc-stat-blob" style={{ background: cv(colorVar), opacity: 0.12 }} />
            <div className="sc-stat-icon" style={{ background: cv(colorVar) }}>
                <IconComp width={17} height={17} />
            </div>
            <p className="sc-stat-label">{label}</p>
            <p className="sc-stat-value">{value}</p>
        </div>
    );
}

/* ─────────────────────────────────────────────
   Badge component
───────────────────────────────────────────── */
function Badge({ icon: IconComp, children, colorVar }) {
    return (
        <span className="sc-badge" style={{
            background: cva(colorVar, 0.1),
            color: cv(colorVar),
        }}>
            {IconComp && <IconComp width={11} height={11} />}
            {children}
        </span>
    );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function Sections() {
    const [academicYearFilter, setAcademicYearFilter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState("add");
    const [selectedSection, setSelectedSection] = useState(null);
    const [formData, setFormData] = useState({ name: "", classId: "" });
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const  collapsed = useSelector((state)=>state.ui.sidebarCollapsed);

    // ReusableTable controlled state
    const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 });
    const [sortingState, setSortingState] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const searchQuery = useDebounce(globalFilter, 400);
    const queryClient = useQueryClient();

    useEffect(() => {
        setPaginationState((p) => ({ ...p, pageIndex: 0 }));
    }, [searchQuery, academicYearFilter]);

    /* ── Queries ── */
    const { data: academicSessions } = useQuery({
        queryKey: ["academicSessions"],
        queryFn: () => apiGet(apiPath.getAcademicSessions),
    });

    const { data: classesData } = useQuery({
        queryKey: ["Classes"],
        queryFn: () => apiGet(apiPath.getClasses),
    });

    const {
        data: sectionsData,
        isLoading: sectionsLoading,
        isFetching: sectionsFetching,
        refetch: refetchSections,
    } = useQuery({
        queryKey: ["sections", academicYearFilter, searchQuery, paginationState.pageIndex, paginationState.pageSize],
        queryFn: () => {
            const params = new URLSearchParams();
            if (academicYearFilter) params.append("academicSessionId", academicYearFilter);
            if (searchQuery) params.append("search", searchQuery);
            params.append("page", paginationState.pageIndex + 1);
            params.append("limit", paginationState.pageSize);
            return apiGet(`${apiPath.getSections}?${params}`);
        },
    });

    /* ── Mutations ── */
    const invalidate = useCallback(() => {
        queryClient.invalidateQueries(["sections"]);
        refetchSections();
    }, [queryClient, refetchSections]);

    const createMutation = useMutation({
        mutationFn: (d) => apiPost(apiPath.createSection, d),
        onSuccess: (res) => { toast.success(res.message || "Section created!"); closeModal(); invalidate(); },
        onError: (e) => toast.error(e?.response?.data?.message || "Failed to create"),
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => apiPut(`${apiPath.updateSection}/${id}`, data),
        onSuccess: (res) => { toast.success(res.message || "Section updated!"); closeModal(); invalidate(); },
        onError: (e) => toast.error(e?.message || "Failed to update"),
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => apiDelete(`${apiPath.deleteSection}/${id}`),
        onSuccess: () => { toast.success("Section deleted!"); invalidate(); },
        onError: (e) => toast.error(e?.message || "Failed to delete"),
    });

    /* ── Derived ── */
    const academicYearOptions = (academicSessions?.results || []).map((s) => ({
        value: s._id, label: s.academicSession,
    }));
    const classOptions = (classesData?.data || []).map((c) => ({
        value: c._id, label: c.name, academicSessionId: c.academicSessionId,
    }));
    // const filteredClassOptions = academicYearFilter
    //     ? classOptions.filter((c) => c.academicSessionId === academicYearFilter)
    //     : classOptions;

    const getSessionLabel = (id) => academicYearOptions.find((s) => s.value === id)?.label || id;
    const totalCount = sectionsData?.results?.totalDocs || 0;

    const tableData = (sectionsData?.results?.docs || []).map((item) => ({
        id: item._id,
        sectionName: item.name,
        className: item.class?.name || "—",
        academicSession: item.class?.academicSessionId ? getSessionLabel(item.class.academicSessionId) : "—",
        classId: item.classId,
    }));

    /* ── Form helpers ── */
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: "", classId: "" });
        setFormErrors({});
        setTouched({});
        setSelectedSection(null);
    };

    const handleAdd = () => { setModalMode("add"); closeModal(); setIsModalOpen(true); };
    const handleEdit = (row) => {
        setModalMode("edit");
        setSelectedSection(row);
        setFormData({ name: row.sectionName || "", classId: row.classId || "" });
        setFormErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const handleDelete = (id) => setConfirmDelete({ open: true, id });
    const handleConfirmDelete = () => {
        deleteMutation.mutate(confirmDelete.id);
        setConfirmDelete({ open: false, id: null });
    };


    const handleSectionPick = (letter) => {
        const next = { ...formData, name: letter };
        setFormData(next);
        setTouched((p) => ({ ...p, name: true }));
        setFormErrors((p) => ({ ...p, name: validate(next).name }));
    };
    const handleClassChange = (e) => {
        const next = { ...formData, classId: e.target.value };
        setFormData(next);
        setTouched((p) => ({ ...p, classId: true }));
        setFormErrors((p) => ({ ...p, classId: validate(next).classId }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formData);
        setFormErrors(errors);
        setTouched({ name: true, classId: true });
        if (Object.keys(errors).length) return;
        if (modalMode === "add") createMutation.mutate(formData);
        else updateMutation.mutate({ id: selectedSection.id, data: formData });
    };

    const isMutating = createMutation.isPending || updateMutation.isPending;

    /* ── Table columns ── */
    const columns = [
        {
            header: "Section",
            accessorKey: "sectionName",
            cell: ({ row }) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="sc-section-avatar">
                        {row.original.sectionName}
                    </div>
                    <span className="sc-section-name">Section {row.original.sectionName}</span>
                </div>
            ),
        },
        {
            header: "Class",
            accessorKey: "className",
            cell: ({ row }) => (
                <Badge icon={Icon.Book} colorVar="secondary">{row.original.className}</Badge>
            ),
        },
        {
            header: "Academic Session",
            accessorKey: "academicSession",
            cell: ({ row }) => (
                <Badge icon={Icon.Calendar} colorVar="info">{row.original.academicSession}</Badge>
            ),
        },
        {
            header: "Actions",
            accessorKey: "actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button className="sc-action-btn sc-edit-btn" onClick={() => handleEdit(row.original)}>
                        <Icon.Edit width={12} height={12} /> Edit
                    </button>
                    <button className="sc-action-btn sc-del-btn" onClick={() => handleDelete(row.original.id)}>
                        <Icon.Trash width={12} height={12} /> Delete
                    </button>
                </div>
            ),
        },
    ];

    /* ── Render ── */
    return (
        <>
            {/* ─── All component-scoped styles (CSS-var driven) ─── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600&display=swap');

        @keyframes sc-spin    { to { transform: rotate(360deg); } }
        @keyframes sc-modal   { from { opacity:0; transform:scale(.93) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes sc-fadein  { from { opacity:0; transform:translateY(6px); }             to { opacity:1; transform:translateY(0); } }

        /* ── root wrapper ── */
        .sc-root {
          font-family: 'DM Sans', sans-serif;
          padding: clamp(14px, 3vw, 28px);
          min-height: 100vh;
          background: rgb(var(--color-bg));
          color: rgb(var(--color-text));
          animation: sc-fadein .35s ease;
        }

        /* ── heading ── */
        .sc-page-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: clamp(18px, 3vw, 28px);
          flex-wrap: wrap;
        }
        .sc-head-icon {
          width: 44px; height: 44px;
          border-radius: 14px;
          background: rgb(var(--color-primary));
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--color-surface));
          box-shadow: 0 8px 24px -6px rgba(var(--color-primary), .42);
          flex-shrink: 0;
          transition: background .3s;
        }
        .sc-head-title {
          margin: 0;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(18px, 2.5vw, 24px);
          color: rgb(var(--color-text));
          letter-spacing: -.5px;
          line-height: 1.1;
        }
        .sc-head-sub {
          margin: 3px 0 0;
          font-size: 12.5px;
          color: rgb(var(--color-muted));
          font-weight: 500;
        }

        /* ── stat cards ── */
        .sc-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: clamp(10px, 2vw, 16px);
          margin-bottom: clamp(16px, 3vw, 24px);
        }
        .sc-stat-card {
          position: relative;
          overflow: hidden;
          background: rgb(var(--color-surface));
          border-radius: 16px;
          padding: clamp(14px, 2vw, 20px);
          border: 1px solid rgb(var(--color-border));
          box-shadow: 0 2px 12px -4px rgba(var(--color-text), .06);
          transition: box-shadow .2s, transform .2s;
        }
        .sc-stat-card:hover { box-shadow: 0 6px 24px -6px rgba(var(--color-text),.1); transform: translateY(-1px); }
        .sc-stat-blob {
          position: absolute; top: -20px; right: -20px;
          width: 72px; height: 72px; border-radius: 50%;
        }
        .sc-stat-icon {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--color-surface));
          margin-bottom: 12px; flex-shrink: 0;
        }
        .sc-stat-label {
          margin: 0 0 4px;
          font-size: 10.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .09em;
          color: rgb(var(--color-muted));
        }
        .sc-stat-value {
          margin: 0;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: clamp(22px, 3vw, 30px);
          color: rgb(var(--color-text));
          letter-spacing: -1px;
          line-height: 1;
        }

        /* ── toolbar ── */
        .sc-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          margin-bottom: 14px;
        }
        .sc-toolbar-left  { display: flex; gap: 10px; flex-wrap: wrap; flex: 1; min-width: 0; }
        .sc-toolbar-right { display: flex; gap: 10px; flex-wrap: wrap; }

        /* ── primary button ── */
        .sc-btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 18px;
          border-radius: 11px; border: none;
          background: rgb(var(--color-primary));
          color: rgb(var(--color-surface));
          font-family: 'Sora', sans-serif;
          font-weight: 700; font-size: 13.5px;
          cursor: pointer; white-space: nowrap;
          box-shadow: 0 6px 20px -4px rgba(var(--color-primary), .42);
          transition: all .2s;
          letter-spacing: -.2px;
        }
        .sc-btn-primary:hover {
          filter: brightness(1.08);
          transform: translateY(-2px);
          box-shadow: 0 12px 28px -6px rgba(var(--color-primary), .5);
        }
        .sc-btn-primary:active { transform: translateY(0); }

        /* ── select wrapper ── */
        .sc-select-wrap { position: relative; }
        .sc-select {
          width: 100%; appearance: none;
          padding: 10px 36px 10px 13px;
          background: rgb(var(--color-bg));
          border: 1.5px solid rgb(var(--color-border));
          border-radius: 10px;
          font-size: 13px; font-weight: 500;
          color: rgb(var(--color-text));
          cursor: pointer; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color .15s, box-shadow .15s, background .15s;
        }
        .sc-select:focus {
          border-color: rgb(var(--color-primary));
          box-shadow: 0 0 0 3px rgba(var(--color-primary), .14);
          background: rgb(var(--color-surface));
        }
        .sc-select-error {
          border-color: rgb(var(--color-danger));
          background: rgba(var(--color-danger), .04);
        }
        .sc-select-arrow {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; color: rgb(var(--color-muted));
        }
        .sc-year-select { width: clamp(170px, 28vw, 220px); }

        /* ── table container ── */
        .sc-table-wrap {
          background: rgb(var(--color-surface));
          border-radius: 18px;
          border: 1px solid rgb(var(--color-border));
          box-shadow: 0 2px 16px -4px rgba(var(--color-text), .06);
          overflow: hidden;
        }

        /* ── section avatar ── */
        .sc-section-avatar {
          width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
          background: rgb(var(--color-primary));
          display: flex; align-items: center; justify-content: center;
          color: rgb(var(--color-surface));
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 16px;
          box-shadow: 0 4px 12px -4px rgba(var(--color-primary), .45);
        }
        .sc-section-name {
          font-weight: 700; font-size: 13.5px;
          color: rgb(var(--color-text));
          font-family: 'Sora', sans-serif;
        }

        /* ── badge ── */
        .sc-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 600;
          white-space: nowrap;
        }

        /* ── action buttons ── */
        .sc-action-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 11px; border-radius: 8px; border: none;
          font-size: 12px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .15s;
        }
        .sc-edit-btn {
          background: rgba(var(--color-primary), .1);
          color: rgb(var(--color-primary));
        }
        .sc-edit-btn:hover  { background: rgba(var(--color-primary), .18); }
        .sc-del-btn {
          background: rgba(var(--color-danger), .1);
          color: rgb(var(--color-danger));
        }
        .sc-del-btn:hover   { background: rgba(var(--color-danger), .18); }

        /* ── icon button (close) ── */
        .sc-icon-btn {
          width: 30px; height: 30px; border-radius: 8px; border: none;
          background: rgb(var(--color-bg));
          color: rgb(var(--color-muted));
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s;
        }
        .sc-icon-btn:hover { background: rgb(var(--color-border)); }

        /* ── modal overlay ── */
        .sc-modal-overlay {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(var(--color-text), .45);
          backdrop-filter: blur(5px);
          padding: 16px;
        }
        .sc-confirm-overlay { z-index: 60; }
        .sc-modal-box {
          position: relative;
          background: rgb(var(--color-surface));
          border-radius: 22px;
          width: 100%; max-width: 448px;
          box-shadow: 0 40px 100px -12px rgba(var(--color-text), .28);
          border: 1px solid rgb(var(--color-border));
          animation: sc-modal .26s cubic-bezier(.34,1.56,.64,1);
          overflow: hidden;
        }
        .sc-modal-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid rgb(var(--color-border));
        }
        .sc-modal-title {
          font-family: 'Sora', sans-serif;
          font-weight: 800; font-size: 17px;
          color: rgb(var(--color-text)); letter-spacing: -.5px;
        }
        .sc-modal-body { padding: 20px 24px 24px; }

        /* ── confirm dialog ── */
        .sc-confirm-box {
          background: rgb(var(--color-surface));
          border-radius: 20px; padding: 26px;
          width: 100%; max-width: 370px;
          box-shadow: 0 28px 72px -8px rgba(var(--color-text), .24);
          border: 1px solid rgb(var(--color-border));
          animation: sc-modal .22s ease;
        }
        .sc-confirm-icon-row {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
        }
        .sc-danger-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(var(--color-danger), .12);
          color: rgb(var(--color-danger));
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sc-confirm-title {
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 17px;
          color: rgb(var(--color-text));
        }
        .sc-confirm-msg {
          font-size: 13px; color: rgb(var(--color-muted));
          margin: 0 0 22px; line-height: 1.65;
        }
        .sc-confirm-actions { display: flex; gap: 10px; }

        /* ── form fields ── */
        .sc-field { margin-bottom: 18px; }
        .sc-field:last-of-type { margin-bottom: 0; }
        .sc-label {
          display: block; font-size: 10.5px; font-weight: 700;
          text-transform: uppercase; letter-spacing: .09em;
          color: rgb(var(--color-muted)); margin-bottom: 8px;
        }
        .sc-required { color: rgb(var(--color-danger)); margin-left: 3px; }
        .sc-field-error {
          display: flex; align-items: center; gap: 5px;
          margin-top: 6px; color: rgb(var(--color-danger));
          font-size: 11.5px; font-weight: 500;
        }

        /* ── section chip picker ── */
        .sc-picker { display: flex; gap: 10px; flex-wrap: wrap; }
        .sc-chip {
          width: 54px; height: 54px; border-radius: 14px;
          background: rgb(var(--color-bg));
          border: 1.5px solid rgb(var(--color-border));
          color: rgb(var(--color-muted));
          font-family: 'Sora', sans-serif; font-weight: 900; font-size: 20px;
          cursor: pointer; outline: none;
          transition: all .22s cubic-bezier(.34,1.56,.64,1);
        }
        .sc-chip:hover:not(.sc-chip-active) {
          background: rgba(var(--color-primary), .08);
          color: rgb(var(--color-primary));
          border-color: rgba(var(--color-primary), .35);
        }
        .sc-chip-active {
          background: rgb(var(--color-primary));
          border-color: transparent;
          color: rgb(var(--color-surface));
          box-shadow: 0 8px 22px -6px rgba(var(--color-primary), .55);
          transform: scale(1.08) translateY(-2px);
        }
        .sc-chip-error:not(.sc-chip-active) { border-color: rgba(var(--color-danger), .5); }

        /* ── modal warning notice ── */
        .sc-notice {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px; border-radius: 9px; margin-bottom: 18px;
          font-size: 12.5px; font-weight: 600;
          background: rgba(var(--color-primary), .09);
          color: rgb(var(--color-primary));
        }
        .sc-no-class-warn {
          display: flex; align-items: center; gap: 6px;
          margin-top: 8px; padding: 8px 11px; border-radius: 9px;
          background: rgba(var(--color-warning), .1);
          color: rgb(var(--color-warning));
          font-size: 12px; font-weight: 500;
        }

        /* ── generic buttons ── */
        .sc-btn {
          flex: 1; padding: 11px 0; border-radius: 12px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background .15s, filter .15s;
        }
        .sc-btn-ghost {
          border: 1.5px solid rgb(var(--color-border));
          background: rgb(var(--color-bg));
          color: rgb(var(--color-muted));
        }
        .sc-btn-ghost:hover { background: rgb(var(--color-surface-hover)); }
        .sc-btn-danger {
          border: none;
          background: rgb(var(--color-danger));
          color: #fff;
          box-shadow: 0 4px 14px -4px rgba(var(--color-danger), .45);
        }
        .sc-btn-danger:hover { filter: brightness(1.08); }

        /* ── submit button ── */
        .sc-submit-row { display: flex; gap: 10px; margin-top: 10px; }
        .sc-btn-submit {
          flex: 1; padding: 11px 0; border-radius: 12px; border: none;
          background: rgb(var(--color-primary));
          color: rgb(var(--color-surface));
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 13.5px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
          box-shadow: 0 6px 18px -4px rgba(var(--color-primary), .44);
          transition: filter .15s, box-shadow .15s;
        }
        .sc-btn-submit:hover { filter: brightness(1.07); box-shadow: 0 10px 24px -6px rgba(var(--color-primary), .5); }
        .sc-btn-submit:disabled { opacity: .55; cursor: not-allowed; }

        /* ── responsive ── */
        @media (max-width: 600px) {
          .sc-toolbar { flex-direction: column; align-items: stretch; }
          .sc-toolbar-left, .sc-toolbar-right { width: 100%; }
          .sc-year-select { width: 100%; }
          .sc-btn-primary { width: 100%; justify-content: center; }
          .sc-stats { grid-template-columns: 1fr 1fr; }
          .sc-picker { gap: 8px; }
          .sc-chip { width: 48px; height: 48px; font-size: 18px; }
        }
        @media (max-width: 380px) {
          .sc-stats { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="sc-root">

                {/* ── Page Heading ── */}
                <div className="sc-page-head">
                    <div className="sc-head-icon">
                        <Icon.Layers width={19} height={19} />
                    </div>
                    <div>
                        <h1 className="sc-head-title">Sections</h1>
                        <p className="sc-head-sub">Manage class sections and academic assignments</p>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="sc-stats">
                    <StatCard icon={Icon.Layers} label="Total Sections" value={totalCount} colorVar="primary" />
                    <StatCard icon={Icon.Book} label="Total Classes" value={classOptions.length} colorVar="secondary" />
                    <StatCard
                        icon={Icon.Calendar}
                        label="Active Filter"
                        value={academicYearFilter ? (getSessionLabel(academicYearFilter).split(" ")[0] || "—") : "All"}
                        colorVar="info"
                    />
                </div>

                {/* ── Toolbar ── */}
                <div className="sc-toolbar">
                    <div className="sc-toolbar-left">
                        <div className="sc-year-select">
                            <StyledSelect
                                value={academicYearFilter || ""}
                                onChange={(e) => setAcademicYearFilter(e.target.value || null)}
                                options={academicYearOptions}
                                placeholder="All Academic Years"
                            />
                        </div>
                    </div>
                    <div className="sc-toolbar-right">
                        <button className="sc-btn-primary" onClick={handleAdd}>
                            <Icon.Plus width={13} height={13} /> Add Section
                        </button>
                    </div>
                </div>

                {/* ── ReusableTable ── */}
                <div className={`
  overflow-x-auto transition-all duration-300 w-[90vw]
  ${collapsed ? "md:w-[90vw]" : "md:w-[73vw]"}
`}>
                    <ReusableTable
                        columns={columns}
                        data={tableData}
                        paginationState={paginationState}
                        setPaginationState={setPaginationState}
                        sortingState={sortingState}
                        setSortingState={setSortingState}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        totalCount={totalCount}
                        loading={sectionsLoading}
                        fetching={sectionsFetching}
                        tablePlaceholder="Search by section name or class…"
                        error={null}
                    />
                </div>
            </div>

            {/* ── Add / Edit Modal ── */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={modalMode === "add" ? "Add New Section" : "Edit Section"}
            >
                <form onSubmit={handleSubmit} noValidate>

                    <Field label="Section" required error={touched.name && formErrors.name}>
                        <SectionPicker
                            value={formData.name}
                            onChange={handleSectionPick}
                            hasError={!!(touched.name && formErrors.name)}
                        />
                    </Field>

                    <Field label="Class" required error={touched.classId && formErrors.classId}>
                        <StyledSelect
                            name="classId"
                            value={formData.classId}
                            onChange={handleClassChange}
                            options={classOptions}
                            placeholder="Select a class"
                            hasError={!!(touched.classId && formErrors.classId)}
                        />
                        {academicYearFilter && classOptions.length === 0 && (
                            <div className="sc-no-class-warn">
                                <Icon.Alert width={13} height={13} /> No classes for the selected academic year
                            </div>
                        )}
                    </Field>

                    {modalMode === "edit" && selectedSection && (
                        <div className="sc-notice">
                            <Icon.Edit width={13} height={13} />
                            Editing: Section <strong style={{ marginLeft: 4 }}>{selectedSection.sectionName}</strong>
                        </div>
                    )}

                    <div className="sc-submit-row">
                        <button type="button" className="sc-btn sc-btn-ghost" onClick={closeModal}>
                            Cancel
                        </button>
                        <button type="submit" className="sc-btn-submit" disabled={isMutating}>
                            {isMutating
                                ? <><Icon.Spinner width={14} height={14} /> Saving…</>
                                : modalMode === "add" ? "Create Section" : "Save Changes"
                            }
                        </button>
                    </div>
                </form>
            </Modal>

            {/* ── Confirm Delete ── */}
            <ConfirmDialog
                isOpen={confirmDelete.open}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmDelete({ open: false, id: null })}
            />
        </>
    );
}