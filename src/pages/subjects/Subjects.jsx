import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import apiPath from "../../api/apiPath";
import { apiGet, apiPost, apiPut, apiDelete } from "../../api/apiFetch";
import ReusableTable from "../../components/table/Table";
import { useSelector } from "react-redux";

/* ══════════════════════════════════════════
   Inline debounce hook
══════════════════════════════════════════ */
function useDebounce(value, delay = 400) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

/* ══════════════════════════════════════════
   Date formatter  (no deps – vanilla JS)
══════════════════════════════════════════ */
function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/* ══════════════════════════════════════════
   Validation
══════════════════════════════════════════ */
function validateSubject(data) {
  const errors = {};
  if (!data.name?.trim()) errors.name = "Subject name is required";
  else if (data.name.trim().length < 2) errors.name = "Minimum 2 characters required";
  if (data.description?.length > 200) errors.description = "Max 200 characters allowed";
  return errors;
}

/* ══════════════════════════════════════════
   SVG Icons  (stroke-only, inherits color)
══════════════════════════════════════════ */
const BookOpenIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
const PlusIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const EditIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);
const XIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);
const AlertIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const SpinnerIcon = (p) => (
  <svg {...p} fill="none" viewBox="0 0 24 24"
    style={{ ...(p.style || {}), animation: "subj-spin .7s linear infinite" }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25" />
    <path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);
const CalendarIcon = (p) => (
  <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/* ══════════════════════════════════════════
   Modal
══════════════════════════════════════════ */
function SubjectModal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(var(--color-text),0.45)", backdropFilter: "blur(2px)", animation: "subj-fadein .2s ease" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgb(var(--color-surface))",
          border: "1px solid rgb(var(--color-border))",
          boxShadow: "0 32px 80px -8px rgba(0,0,0,0.28)",
          animation: "subj-modal .26s cubic-bezier(.34,1.56,.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgb(var(--color-border))" }}>
          <h2 className="font-bold text-lg tracking-tight"
            style={{ color: "rgb(var(--color-text))", fontFamily: "'Sora',sans-serif", letterSpacing: "-.4px" }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{ background: "rgb(var(--color-bg))", color: "rgb(var(--color-muted))", border: "none", cursor: "pointer" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--color-border))"}
            onMouseLeave={e => e.currentTarget.style.background = "rgb(var(--color-bg))"}
          >
            <XIcon width={13} height={13} />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Confirm Dialog
══════════════════════════════════════════ */
function ConfirmBox({ isOpen, onConfirm, onCancel, subjectName }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      style={{ zIndex: 60, background: "rgba(var(--color-text),0.5)", backdropFilter: "blur(1px)" }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "rgb(var(--color-surface))",
          border: "1px solid rgb(var(--color-border))",
          boxShadow: "0 24px 64px -8px rgba(0,0,0,0.24)",
          animation: "subj-modal .22s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: "rgba(var(--color-danger),0.12)", color: "rgb(var(--color-danger))" }}>
            <TrashIcon width={15} height={15} />
          </div>
          <p className="font-bold text-base" style={{ color: "rgb(var(--color-text))", fontFamily: "'Sora',sans-serif" }}>
            Delete Subject?
          </p>
        </div>
        <p className="text-sm mb-5 leading-relaxed" style={{ color: "rgb(var(--color-muted))" }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "rgb(var(--color-text))" }}>"{subjectName}"</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: "rgb(var(--color-bg))",
              border: "1.5px solid rgb(var(--color-border))",
              color: "rgb(var(--color-muted))",
              cursor: "pointer", fontFamily: "inherit"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--color-surface-hover))"}
            onMouseLeave={e => e.currentTarget.style.background = "rgb(var(--color-bg))"}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{
              background: "rgb(var(--color-danger))",
              border: "none", cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              boxShadow: "0 4px 14px -4px rgba(var(--color-danger),0.45)"
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.08)"}
            onMouseLeave={e => e.currentTarget.style.filter = "none"}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   Form Field wrapper
══════════════════════════════════════════ */
function Field({ label, error, required, children, hint }) {
  return (
    <div className="mb-4">
      <label className="block mb-1.5 text-xs font-bold uppercase tracking-widest"
        style={{ color: "rgb(var(--color-muted))", letterSpacing: ".09em" }}>
        {label}{required && <span style={{ color: "rgb(var(--color-danger))", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1 text-xs" style={{ color: "rgb(var(--color-muted))" }}>{hint}</p>
      )}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-xs font-medium"
          style={{ color: "rgb(var(--color-danger))" }}>
          <AlertIcon width={11} height={11} /> {error}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Styled Input
══════════════════════════════════════════ */
function StyledInput({ value, onChange, placeholder, hasError, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", padding: "10px 14px",
        background: hasError ? "rgba(var(--color-danger),.04)" : focused ? "rgb(var(--color-surface))" : "rgb(var(--color-bg))",
        border: `1.5px solid ${hasError ? "rgb(var(--color-danger))" : focused ? "rgb(var(--color-primary))" : "rgb(var(--color-border))"}`,
        borderRadius: 10, fontSize: 13, fontWeight: 500,
        color: "rgb(var(--color-text))",
        outline: "none", fontFamily: "inherit",
        boxShadow: focused && !hasError ? "0 0 0 3px rgba(var(--color-primary),.12)" : "none",
        transition: "all .15s",
      }}
      {...rest}
    />
  );
}

/* ══════════════════════════════════════════
   Styled Textarea
══════════════════════════════════════════ */
function StyledTextarea({ value, onChange, placeholder, hasError, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "10px 14px",
          background: hasError ? "rgba(var(--color-danger),.04)" : focused ? "rgb(var(--color-surface))" : "rgb(var(--color-bg))",
          border: `1.5px solid ${hasError ? "rgb(var(--color-danger))" : focused ? "rgb(var(--color-primary))" : "rgb(var(--color-border))"}`,
          borderRadius: 10, fontSize: 13, fontWeight: 500, resize: "vertical",
          color: "rgb(var(--color-text))",
          outline: "none", fontFamily: "inherit",
          boxShadow: focused && !hasError ? "0 0 0 3px rgba(var(--color-primary),.12)" : "none",
          transition: "all .15s",
        }}
      />
      {maxLength && (
        <span className="absolute bottom-2.5 right-3 text-xs"
          style={{ color: (value?.length || 0) > maxLength * 0.9 ? "rgb(var(--color-warning))" : "rgb(var(--color-muted))" }}>
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   Stat Card
══════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, colorVar }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 transition-shadow hover:shadow-md"
      style={{
        background: "rgb(var(--color-surface))",
        border: "1px solid rgb(var(--color-border))",
        boxShadow: "0 2px 12px -4px rgba(var(--color-text),.06)",
      }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full"
        style={{ background: `rgb(var(--color-${colorVar}))`, opacity: .1 }} />
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `rgb(var(--color-${colorVar}))`, color: "rgb(var(--color-surface))" }}>
          <Icon width={16} height={16} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider"
          style={{ color: "rgb(var(--color-muted))" }}>{label}</span>
      </div>
      <p className="text-3xl font-black leading-none tracking-tight"
        style={{ color: "rgb(var(--color-text))", fontFamily: "'Sora',sans-serif" }}>{value}</p>
    </div>
  );
}

/* ══════════════════════════════════════════
   Subject colour dot (random but consistent)
══════════════════════════════════════════ */
const SUBJECT_COLORS = [
  "primary", "secondary", "purple", "pink", "orange", "info", "success",
];
function subjectColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return SUBJECT_COLORS[Math.abs(hash) % SUBJECT_COLORS.length];
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Subjects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, subject: null });
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});


  const collapsed = useSelector((state)=>state.ui.sidebarCollapsed);

  // ReusableTable state
  const [paginationState, setPaginationState] = useState({ pageIndex: 0, pageSize: 10 });
  const [sortingState, setSortingState] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const searchQuery = useDebounce(globalFilter, 400);
  const queryClient = useQueryClient();

  // Reset page on search change
  useEffect(() => {
    setPaginationState((p) => ({ ...p, pageIndex: 0 }));
  }, [searchQuery]);

  /* ── Query ── */
  const {
    data: subjectsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subjects", searchQuery, paginationState.pageIndex, paginationState.pageSize],
    queryFn: () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      params.append("page", paginationState.pageIndex + 1);
      params.append("limit", paginationState.pageSize);
      return apiGet(`${apiPath.getAllSubjects}?${params}`);
    },
  });

  const totalCount = subjectsData?.results?.total || 0;
  const tableData = (subjectsData?.results?.docs || []).map((item) => ({
    id: item._id,
    name: item.name,
    description: item.description || "—",
    createdAt: item.createdAt,
    _raw: item,
  }));

  /* ── Mutations ── */
  const invalidate = useCallback(() => {
    queryClient.invalidateQueries(["subjects"]);
    refetch();
  }, [queryClient, refetch]);

  const createMutation = useMutation({
    mutationFn: (d) => apiPost(apiPath.createSubject, d),
    onSuccess: () => { toast.success("Subject created successfully!"); closeModal(); invalidate(); },
    onError: (e) => toast.error(e?.message || "Failed to create subject"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiPut(`${apiPath.updateSubject}/${id}`, data),
    onSuccess: () => { toast.success("Subject updated successfully!"); closeModal(); invalidate(); },
    onError: (e) => toast.error(e?.message || "Failed to update subject"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.deleteSubject}/${id}`),
    onSuccess: () => { toast.success("Subject deleted successfully!"); invalidate(); },
    onError: (e) => toast.error(e?.message || "Failed to delete subject"),
  });

  /* ── Form helpers ── */
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setTouched({});
    setSelectedSubject(null);
  };

  const handleAdd = () => {
    setModalMode("add");
    closeModal();
    setIsModalOpen(true);
  };

  const handleEdit = (row) => {
    setModalMode("edit");
    setSelectedSubject(row);
    setFormData({ name: row.name || "", description: row.description === "—" ? "" : (row.description || "") });
    setFormErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const handleDelete = (row) => setConfirmDelete({ open: true, subject: row });
  const handleConfirmDel = () => {
    deleteMutation.mutate(confirmDelete.subject.id);
    setConfirmDelete({ open: false, subject: null });
  };

  const handleFieldChange = (field, value) => {
    const next = { ...formData, [field]: value };
    setFormData(next);
    setTouched((p) => ({ ...p, [field]: true }));
    setFormErrors((p) => ({ ...p, [field]: validateSubject(next)[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateSubject(formData);
    setFormErrors(errors);
    setTouched({ name: true, description: true });
    if (Object.keys(errors).length) return;
    const payload = { name: formData.name.trim(), description: formData.description?.trim() || "" };
    if (modalMode === "add") createMutation.mutate(payload);
    else updateMutation.mutate({ id: selectedSubject.id, data: payload });
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  /* ── Table columns ── */
  const columns = [
    {
      header: "Subject",
      accessorKey: "name",
      cell: ({ row }) => {
        const col = subjectColor(row.original.name);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: `rgb(var(--color-${col}))`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgb(var(--color-surface))",
              fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 15,
              boxShadow: `0 4px 12px -4px rgba(var(--color-${col}),.45)`,
            }}>
              {row.original.name?.[0]?.toUpperCase() || "?"}
            </div>
            <span style={{ fontWeight: 700, fontSize: 13.5, color: "rgb(var(--color-text))", fontFamily: "'Sora',sans-serif" }}>
              {row.original.name}
            </span>
          </div>
        );
      },
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: ({ row }) => (
        <span style={{
          fontSize: 13, color: "rgb(var(--color-muted))",
          maxWidth: 280, display: "block",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
        }}>
          {row.original.description}
        </span>
      ),
    },
    {
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 8,
          background: "rgba(var(--color-info),.1)",
          color: "rgb(var(--color-info))", fontSize: 12, fontWeight: 600,
        }}>
          <CalendarIcon width={11} height={11} />
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => handleEdit(row.original)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 8, border: "none",
              background: "rgba(var(--color-primary),.1)",
              color: "rgb(var(--color-primary))",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(var(--color-primary),.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(var(--color-primary),.1)"}
          >
            <EditIcon width={12} height={12} /> Edit
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 11px", borderRadius: 8, border: "none",
              background: "rgba(var(--color-danger),.1)",
              color: "rgb(var(--color-danger))",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(var(--color-danger),.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(var(--color-danger),.1)"}
          >
            <TrashIcon width={12} height={12} /> Delete
          </button>
        </div>
      ),
    },
  ];

  /* ══════════════════════════════════════════
     Render
  ══════════════════════════════════════════ */
  return (
    <>
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes subj-spin    { to { transform: rotate(360deg); } }
        @keyframes subj-fadein  { from { opacity:0 } to { opacity:1 } }
        @keyframes subj-modal   { from { opacity:0; transform:scale(.92) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes subj-slidein { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .subj-root * { box-sizing: border-box; }
        .subj-root { animation: subj-slidein .35s ease; }
      `}</style>

      <div
        className="subj-root min-h-screen p-4 sm:p-6"
        style={{ fontFamily: "'DM Sans',sans-serif", background: "rgb(var(--color-bg))", color: "rgb(var(--color-text))" }}
      >

        {/* ── Page Header ── */}
        <div className="flex flex-wrap items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgb(var(--color-primary))",
                color: "rgb(var(--color-surface))",
                boxShadow: "0 8px 24px -6px rgba(var(--color-primary),.45)",
              }}
            >
              <BookOpenIcon width={20} height={20} />
            </div>
            <div>
              <h1 className="font-black tracking-tight leading-none"
                style={{ fontSize: "clamp(20px,3vw,26px)", fontFamily: "'Sora',sans-serif", color: "rgb(var(--color-text))", letterSpacing: "-.6px" }}>
                Subjects
              </h1>
              <p className="mt-1 text-xs font-medium" style={{ color: "rgb(var(--color-muted))" }}>
                Manage curriculum subjects and descriptions
              </p>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all"
            style={{
              background: "rgb(var(--color-primary))",
              color: "rgb(var(--color-surface))",
              border: "none", cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
              boxShadow: "0 6px 20px -4px rgba(var(--color-primary),.45)",
              letterSpacing: "-.2px",
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 12px 28px -6px rgba(var(--color-primary),.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px -4px rgba(var(--color-primary),.45)"; }}
          >
            <PlusIcon width={13} height={13} />
            Add Subject
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
          <StatCard icon={BookOpenIcon} label="Total Subjects" value={totalCount} colorVar="primary" />
          <StatCard icon={CalendarIcon} label="This Page"
            value={tableData.length} colorVar="secondary" />
          <StatCard icon={BookOpenIcon} label="Page"
            value={`${paginationState.pageIndex + 1} of ${Math.max(1, Math.ceil(totalCount / paginationState.pageSize))}`}
            colorVar="purple" />
        </div>

        {/* ── Table ── */}
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
            loading={isLoading}
            fetching={isFetching}
            isError={isError}
            error={error}
            tablePlaceholder="Search subjects…"
          />
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      <SubjectModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalMode === "add" ? "Add New Subject" : "Edit Subject"}
      >
        <form onSubmit={handleSubmit} noValidate>

          <Field label="Subject Name" required error={touched.name && formErrors.name}>
            <StyledInput
              value={formData.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g. Mathematics, Science, English…"
              hasError={!!(touched.name && formErrors.name)}
              autoFocus
            />
          </Field>

          <Field
            label="Description"
            error={touched.description && formErrors.description}
            hint="Brief description of the subject (optional)"
          >
            <StyledTextarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              placeholder="What is this subject about?"
              hasError={!!(touched.description && formErrors.description)}
              maxLength={200}
            />
          </Field>

          {modalMode === "edit" && selectedSubject && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold mb-4"
              style={{ background: "rgba(var(--color-primary),.09)", color: "rgb(var(--color-primary))" }}
            >
              <EditIcon width={12} height={12} />
              Editing: <strong className="ml-1">{selectedSubject.name}</strong>
            </div>
          )}

          <div className="flex gap-2.5 mt-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: "rgb(var(--color-bg))",
                border: "1.5px solid rgb(var(--color-border))",
                color: "rgb(var(--color-muted))",
                cursor: "pointer", fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgb(var(--color-surface-hover))"}
              onMouseLeave={e => e.currentTarget.style.background = "rgb(var(--color-bg))"}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMutating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: isMutating ? "rgba(var(--color-primary),.6)" : "rgb(var(--color-primary))",
                color: "rgb(var(--color-surface))",
                border: "none",
                cursor: isMutating ? "not-allowed" : "pointer",
                fontFamily: "'Sora',sans-serif",
                boxShadow: isMutating ? "none" : "0 6px 18px -4px rgba(var(--color-primary),.44)",
              }}
              onMouseEnter={e => { if (!isMutating) e.currentTarget.style.filter = "brightness(1.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
            >
              {isMutating
                ? <><SpinnerIcon width={14} height={14} /> Saving…</>
                : modalMode === "add" ? "Create Subject" : "Save Changes"
              }
            </button>
          </div>
        </form>
      </SubjectModal>

      {/* ── Confirm Delete ── */}
      <ConfirmBox
        isOpen={confirmDelete.open}
        subjectName={confirmDelete.subject?.name}
        onConfirm={handleConfirmDel}
        onCancel={() => setConfirmDelete({ open: false, subject: null })}
      />
    </>
  );
}