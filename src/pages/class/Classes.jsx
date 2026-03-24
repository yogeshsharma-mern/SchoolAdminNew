import React, { useState, useMemo, useEffect, useCallback } from 'react';
import apiPath from '../../api/apiPath';
import { apiGet, apiPost, apiPut, apiDelete } from '../../api/apiFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReusableTable from "../../components/table/Table";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

/* ═══════════════════════════════════════════════
   Inline debounce hook
═══════════════════════════════════════════════ */
function useDebounce(value, delay = 400) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

/* ═══════════════════════════════════════════════
   CSS variable helpers
═══════════════════════════════════════════════ */
const cv  = (n)    => `rgb(var(--color-${n}))`;
const cva = (n, a) => `rgba(var(--color-${n}),${a})`;

/* ═══════════════════════════════════════════════
   Validation
═══════════════════════════════════════════════ */
function validateClass(data) {
  const e = {};
  if (!data.name?.trim())             e.name = 'Class name is required';
  if (!data.academicSessionId?.trim()) e.academicSessionId = 'Academic session is required';
  if ((data.name === '11' || data.name === '12') && !data.streams)
    e.streams = 'Stream is required for 11th & 12th';
  return e;
}

/* ═══════════════════════════════════════════════
   Icons
═══════════════════════════════════════════════ */
const I = {
  GradCap: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  Users: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  Grid: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Plus: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Edit: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  X: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  ),
  Alert: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Spinner: (p) => (
    <svg {...p} fill="none" viewBox="0 0 24 24"
      style={{ ...(p.style||{}), animation: 'cls-spin .7s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/>
      <path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  ),
  ChevronDown: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  Filter: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  ),
  Check: (p) => (
    <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
};

/* ═══════════════════════════════════════════════
   Modal (self-contained)
═══════════════════════════════════════════════ */
function ClassModal({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:50,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:16,
        background: cva('text',.45), backdropFilter:'blur(6px)',
        animation:'cls-fadein .2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          position:'relative', width:'100%', maxWidth:520,
          background: cv('surface'),
          borderRadius:22, overflow:'hidden',
          border:`1px solid ${cv('border')}`,
          boxShadow:`0 40px 100px -12px rgba(0,0,0,.3)`,
          animation:'cls-modal .27s cubic-bezier(.34,1.56,.64,1)',
          maxHeight:'90vh', display:'flex', flexDirection:'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 24px 16px',
          borderBottom:`1px solid ${cv('border')}`,
          flexShrink:0,
        }}>
          <div>
            <h2 style={{
              margin:0, fontFamily:"'Sora',sans-serif", fontWeight:800,
              fontSize:18, color:cv('text'), letterSpacing:'-.5px',
            }}>{title}</h2>
            {subtitle && (
              <p style={{ margin:'3px 0 0', fontSize:12.5, color:cv('muted') }}>{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width:32, height:32, borderRadius:9, border:'none',
              background:cv('bg'), color:cv('muted'),
              display:'flex', alignItems:'center', justifyContent:'center',
              cursor:'pointer', transition:'background .15s', flexShrink:0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = cv('border')}
            onMouseLeave={e => e.currentTarget.style.background = cv('bg')}
          >
            <I.X width={13} height={13} />
          </button>
        </div>
        {/* Modal body (scrollable) */}
        <div style={{ padding:'20px 24px 24px', overflowY:'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Confirm Dialog
═══════════════════════════════════════════════ */
function ConfirmBox({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:60,
        display:'flex', alignItems:'center', justifyContent:'center', padding:16,
        background: cva('text',.5), backdropFilter:'blur(6px)',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background:cv('surface'), borderRadius:20, padding:26,
          width:'100%', maxWidth:370,
          border:`1px solid ${cv('border')}`,
          boxShadow:`0 28px 72px -8px rgba(0,0,0,.24)`,
          animation:'cls-modal .22s ease',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <div style={{
            width:40, height:40, borderRadius:11,
            background:cva('danger',.12), color:cv('danger'),
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <I.Trash width={16} height={16} />
          </div>
          <p style={{ margin:0, fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:16, color:cv('text') }}>
            Delete Class?
          </p>
        </div>
        <p style={{ fontSize:13, color:cv('muted'), margin:'0 0 22px', lineHeight:1.65 }}>
          {message || 'This action cannot be undone.'}
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel}
            style={{
              flex:1, padding:'10px 0', borderRadius:11,
              border:`1.5px solid ${cv('border')}`,
              background:cv('bg'), color:cv('muted'),
              fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background = cv('surface-hover')}
            onMouseLeave={e => e.currentTarget.style.background = cv('bg')}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex:1, padding:'10px 0', borderRadius:11, border:'none',
              background:cv('danger'), color:'#fff',
              fontSize:13, fontWeight:700, cursor:'pointer',
              fontFamily:"'Sora',sans-serif",
              boxShadow:`0 4px 14px -4px ${cva('danger',.45)}`,
            }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
            onMouseLeave={e => e.currentTarget.style.filter = 'none'}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Form Field
═══════════════════════════════════════════════ */
function Field({ label, required, error, children, hint }) {
  return (
    <div style={{ marginBottom:18 }}>
      <label style={{
        display:'block', fontSize:10.5, fontWeight:700,
        textTransform:'uppercase', letterSpacing:'.09em',
        color:cv('muted'), marginBottom:7,
      }}>
        {label}
        {required && <span style={{ color:cv('danger'), marginLeft:3 }}>*</span>}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontSize:11.5, color:cv('muted'), marginTop:5 }}>{hint}</p>
      )}
      {error && (
        <div style={{
          display:'flex', alignItems:'center', gap:5,
          marginTop:6, color:cv('danger'), fontSize:11.5, fontWeight:500,
        }}>
          <I.Alert width={11} height={11} /> {error}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Styled Select
═══════════════════════════════════════════════ */
function StyledSelect({ value, onChange, options, placeholder, hasError, name }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position:'relative' }}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:'100%', appearance:'none',
          padding:'11px 36px 11px 14px',
          background: hasError ? cva('danger',.04) : focused ? cv('surface') : cv('bg'),
          border:`1.5px solid ${hasError ? cv('danger') : focused ? cv('primary') : cv('border')}`,
          borderRadius:11, fontSize:13, fontWeight:500,
          color: value ? cv('text') : cv('muted'),
          cursor:'pointer', outline:'none', fontFamily:'inherit',
          boxShadow: focused && !hasError ? `0 0 0 3px ${cva('primary',.12)}` : 'none',
          transition:'all .15s',
        }}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <div style={{
        position:'absolute', right:11, top:'50%', transform:'translateY(-50%)',
        pointerEvents:'none', color:cv('muted'),
      }}>
        <I.ChevronDown width={14} height={14} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Stream Card Button
═══════════════════════════════════════════════ */
function StreamCard({ stream, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding:'12px 10px', borderRadius:13, border:'none',
        background: selected ? cva('primary',.1) : cv('bg'),
        outline: selected ? `2px solid ${cv('primary')}` : `1.5px solid ${cv('border')}`,
        cursor:'pointer', textAlign:'left', transition:'all .2s',
        position:'relative',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = cva('primary',.05); }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = cv('bg'); }}
    >
      {selected && (
        <div style={{
          position:'absolute', top:7, right:7,
          width:18, height:18, borderRadius:9,
          background:cv('primary'), color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <I.Check width={10} height={10} />
        </div>
      )}
      <div style={{ fontSize:22, marginBottom:6 }}>{stream.icon}</div>
      <div style={{
        fontSize:12, fontWeight:700,
        color: selected ? cv('primary') : cv('text'),
        fontFamily:"'Sora',sans-serif",
        lineHeight:1.3,
      }}>
        {stream.label}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════
   Stat Card
═══════════════════════════════════════════════ */
function StatCard({ icon: Icon, label, value, colorVar, delay = 0 }) {
  return (
    <div style={{
      background:cv('surface'), borderRadius:18,
      padding:'18px 20px', border:`1px solid ${cv('border')}`,
      boxShadow:`0 2px 16px -4px ${cva('text',.06)}`,
      position:'relative', overflow:'hidden',
      transition:'box-shadow .2s, transform .2s',
      animationDelay:`${delay}ms`,
      animation:'cls-slidein .4s ease both',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 8px 28px -6px ${cva('text',.12)}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 2px 16px -4px ${cva('text',.06)}`; }}
    >
      <div style={{
        position:'absolute', top:-16, right:-16, width:64, height:64,
        borderRadius:'50%', background:cv(colorVar), opacity:.1,
      }} />
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <div style={{
          width:38, height:38, borderRadius:11,
          background:cv(colorVar), color:cv('surface'),
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon width={17} height={17} />
        </div>
        <span style={{
          fontSize:10.5, fontWeight:700, textTransform:'uppercase',
          letterSpacing:'.09em', color:cv('muted'),
        }}>{label}</span>
      </div>
      <p style={{
        margin:0, fontFamily:"'Sora',sans-serif",
        fontWeight:900, fontSize:32, color:cv('text'),
        letterSpacing:'-1.2px', lineHeight:1,
      }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Class badge colour (deterministic)
═══════════════════════════════════════════════ */
const BADGE_COLORS = ['primary','secondary','purple','orange','info','success','pink'];
function badgeColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return BADGE_COLORS[Math.abs(h) % BADGE_COLORS.length];
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Classes() {
  const queryClient = useQueryClient();
  const collapsed   = useSelector(s => s.ui.sidebarCollapsed);

  /* ── state ── */
  const [paginationState, setPaginationState] = useState({ pageIndex:0, pageSize:10 });
  const [sortingState,    setSortingState]    = useState([]);
  const [globalFilter,    setGlobalFilter]    = useState('');
  const [columnFilters,   setColumnFilters]   = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');

  const [showModal,    setShowModal]    = useState(false);
  const [editingItem,  setEditingItem]  = useState(null);
  const [formData,     setFormData]     = useState({ name:'', streams:'', academicSessionId:'' });
  const [formErrors,   setFormErrors]   = useState({});
  const [touched,      setTouched]      = useState({});
  const [confirmDel,   setConfirmDel]   = useState({ open:false, item:null });

  const debouncedSearch = useDebounce(globalFilter, 400);

  /* ── queries ── */
  const { data:classesData, isLoading, isError, error } = useQuery({
    queryKey: ['classes', debouncedSearch, selectedAcademicYear],
    queryFn: () => {
      const params = new URLSearchParams();
      if (debouncedSearch)      params.append('search', debouncedSearch);
      if (selectedAcademicYear) params.append('academicSessionId', selectedAcademicYear);
      const qs = params.toString();
      return apiGet(`${apiPath.getClasses}${qs ? `?${qs}` : ''}`);
    },
  });

  const { data:academicSessions } = useQuery({
    queryKey: ['academicYears'],
    queryFn:  () => apiGet(apiPath.getAcademicSessions),
  });

  const academicYearOptions = useMemo(() =>
    (academicSessions?.results || []).map(s => ({ label:s.academicSession, value:s._id })),
    [academicSessions]
  );

  /* ── mutations ── */
  const invalidate = useCallback(() => queryClient.invalidateQueries({ queryKey:['classes'] }), [queryClient]);

  const createMutation = useMutation({
    mutationFn: (d)          => apiPost(apiPath.createClass, d),
    onSuccess:  (r)          => { toast.success(r?.message || 'Class created!'); invalidate(); closeModal(); },
    onError:    (e)          => toast.error(e?.response?.data?.message || 'Failed to create'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => apiPut(`${apiPath.updateClass}/${id}`, data),
    onSuccess:  (r)           => { toast.success(r?.message || 'Class updated!'); invalidate(); closeModal(); },
    onError:    (e)           => toast.error(e?.response?.data?.message || 'Failed to update'),
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => apiDelete(`${apiPath.deleteClass}/${id}`),
    onSuccess:  (r)  => { toast.success(r?.message || 'Class deleted!'); invalidate(); setConfirmDel({ open:false, item:null }); },
    onError:    (e)  => toast.error(e?.response?.data?.message || 'Failed to delete'),
  });

  /* ── transformed table data ── */
  const transformedData = useMemo(() => {
    if (!classesData?.data) return [];
    const flat = [];
    classesData.data.forEach(cls => {
      if (cls.sections?.length > 0) {
        cls.sections.forEach(sec => flat.push({
          id: sec._id, className: cls.name, sectionName: sec.name,
          stream: cls.streams || '—', studentCount: sec.studentCount || 0,
          createdAt: cls.createdAt, classId: cls._id, sectionId: sec._id,
          academicSessionId: cls.academicSessionId, originalClass: cls,
        }));
      } else {
        flat.push({
          id: cls._id, className: cls.name, sectionName: '—',
          stream: cls.streams || '—', studentCount: cls.studentCount || 0,
          createdAt: cls.createdAt, classId: cls._id, sectionId: null,
          academicSessionId: cls.academicSessionId, originalClass: cls,
        });
      }
    });
    return flat;
  }, [classesData]);

  /* search + paginate client-side */
  const filteredData = useMemo(() => {
    if (!globalFilter) return transformedData;
    const q = globalFilter.toLowerCase();
    return transformedData.filter(r =>
      r.className.toLowerCase().includes(q) ||
      r.sectionName.toLowerCase().includes(q) ||
      r.stream.toLowerCase().includes(q)
    );
  }, [transformedData, globalFilter]);

  const paginatedData = useMemo(() => {
    const s = paginationState.pageIndex * paginationState.pageSize;
    return filteredData.slice(s, s + paginationState.pageSize);
  }, [filteredData, paginationState]);

  const stats = useMemo(() => ({
    uniqueClasses:  new Set(transformedData.map(r => r.className)).size,
    totalSections:  transformedData.length,
    totalStudents:  transformedData.reduce((a, r) => a + r.studentCount, 0),
  }), [transformedData]);

  /* ── form helpers ── */
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name:'', streams:'', academicSessionId:'' });
    setFormErrors({});
    setTouched({});
    setEditingItem(null);
  };

  const handleAdd = () => { closeModal(); setShowModal(true); };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name:item.className, streams:item.stream !== '—' ? item.stream : '', academicSessionId:item.academicSessionId || '' });
    setFormErrors({});
    setTouched({});
    setShowModal(true);
  };

  const handleDelete    = (item) => setConfirmDel({ open:true, item });
  const handleConfirmDel = ()    => {
    const id = confirmDel.item?.originalClass?._id || confirmDel.item?.classId;
    deleteMutation.mutate(id);
  };

  const setField = (field, val) => {
    const next = { ...formData, [field]:val };
    if (field === 'name') next.streams = ''; // reset streams when class changes
    setFormData(next);
    setTouched(p => ({ ...p, [field]:true }));
    setFormErrors(p => ({ ...p, [field]: validateClass(next)[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateClass(formData);
    setFormErrors(errors);
    setTouched({ name:true, academicSessionId:true, streams:true });
    if (Object.keys(errors).length) return;

    const payload = { name:formData.name, academicSessionId:formData.academicSessionId };
    if (formData.name === '11' || formData.name === '12') payload.streams = formData.streams;

    if (editingItem) updateMutation.mutate({ id:editingItem.classId, data:payload });
    else             createMutation.mutate(payload);
  };

  const isMutating    = createMutation.isPending || updateMutation.isPending;
  const requiresStream = formData.name === '11' || formData.name === '12';

  /* ── static options ── */
  const CLASS_OPTIONS = [
    { value:'Prep',  label:'Preparatory' }, { value:'PreKG', label:'Pre-Kindergarten' },
    { value:'KG',    label:'Kindergarten' },
    ...['1','2','3','4','5','6','7','8','9','10'].map(v => ({ value:v, label:`${v}${['1','2','3'].includes(v)?['st','nd','rd'][+v-1]:'th'} Grade` })),
    { value:'11', label:'11th Grade' }, { value:'12', label:'12th Grade' },
  ];
  const STREAM_OPTIONS = [
    { value:'Commerce',        label:'Commerce',            icon:'📊' },
    { value:'Arts',            label:'Arts',                icon:'🎨' },
    { value:'Science-Math',    label:'Science + Maths',     icon:'🔬' },
    { value:'Science-Biology', label:'Science + Biology',   icon:'🧬' },
  ];

  /* ── table columns ── */
  const columns = useMemo(() => [
    {
      accessorKey: 'className', header: 'Class',
      cell: ({ getValue }) => {
        const v   = getValue();
        const col = badgeColor(v);
        return (
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{
              width:38, height:38, borderRadius:11, flexShrink:0,
              background: cv(col), color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:13,
              boxShadow:`0 4px 12px -4px ${cva(col,.45)}`,
            }}>
              {v}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13.5, color:cv('text'), fontFamily:"'Sora',sans-serif" }}>
                {isNaN(v) || ['Prep','PreKG','KG'].includes(v) ? v : `${v}${['1','2','3'].includes(v)?['st','nd','rd'][+v-1]:'th'}`} Grade
              </div>
              <div style={{ fontSize:11, color:cv('muted'), marginTop:1 }}>Academic Class</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'sectionName', header: 'Section',
      cell: ({ getValue }) => {
        const v = getValue();
        return v !== '—' ? (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:8,
            background:cva('secondary',.1), color:cv('secondary'),
            fontSize:12, fontWeight:600,
          }}>
            📚 Section {v}
          </span>
        ) : <span style={{ color:cv('muted'), fontSize:13 }}>—</span>;
      },
    },
    {
      accessorKey: 'stream', header: 'Stream',
      cell: ({ getValue }) => {
        const v = getValue();
        const icons = { Commerce:'📊', Arts:'🎨', 'Science-Math':'🔬', 'Science-Biology':'🧬' };
        return v !== '—' ? (
          <span style={{
            display:'inline-flex', alignItems:'center', gap:5,
            padding:'4px 10px', borderRadius:8,
            background:cva('purple',.1), color:cv('purple'),
            fontSize:12, fontWeight:600,
          }}>
            {icons[v] || '📘'} {v}
          </span>
        ) : <span style={{ color:cv('muted'), fontSize:13 }}>—</span>;
      },
    },
    {
      accessorKey: 'studentCount', header: 'Students',
      cell: ({ getValue }) => (
        <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
          <span style={{ fontFamily:"'Sora',sans-serif", fontWeight:800, fontSize:18, color:cv('text') }}>
            {getValue()}
          </span>
          <span style={{ fontSize:11, color:cv('muted') }}>enrolled</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt', header: 'Created',
      cell: ({ getValue }) => (
        <span style={{
          display:'inline-flex', alignItems:'center', gap:5,
          padding:'4px 10px', borderRadius:8,
          background:cva('info',.1), color:cv('info'),
          fontSize:12, fontWeight:600,
        }}>
          {new Date(getValue()).toLocaleDateString('en-IN',{ day:'2-digit', month:'short', year:'numeric' })}
        </span>
      ),
    },
    {
      id:'actions', header:'Actions', enableSorting:false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div style={{ display:'flex', gap:6 }}>
            <button
              onClick={() => handleEdit(item)}
              style={{
                display:'inline-flex', alignItems:'center', gap:5,
                padding:'5px 11px', borderRadius:8, border:'none',
                background:cva('primary',.1), color:cv('primary'),
                fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = cva('primary',.18)}
              onMouseLeave={e => e.currentTarget.style.background = cva('primary',.1)}
            >
              <I.Edit width={12} height={12} /> Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              style={{
                display:'inline-flex', alignItems:'center', gap:5,
                padding:'5px 11px', borderRadius:8, border:'none',
                background:cva('danger',.1), color:cv('danger'),
                fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = cva('danger',.18)}
              onMouseLeave={e => e.currentTarget.style.background = cva('danger',.1)}
            >
              <I.Trash width={12} height={12} /> Delete
            </button>
          </div>
        );
      },
    },
  ], []);

  /* ═══════════════════════════════════════════════
     Render
  ═══════════════════════════════════════════════ */
  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes cls-spin    { to { transform:rotate(360deg); } }
        @keyframes cls-fadein  { from { opacity:0 } to { opacity:1 } }
        @keyframes cls-modal   { from { opacity:0; transform:scale(.92) translateY(10px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes cls-slidein { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        .cls-root * { box-sizing:border-box; }
        .cls-root { animation:cls-slidein .35s ease; }

        /* Pill filter tabs */
        .cls-year-pill {
          display:inline-flex; align-items:center; gap:6px;
          padding:6px 14px; border-radius:20px; border:none;
          font-size:12.5px; font-weight:600; cursor:pointer;
          font-family:'DM Sans',sans-serif; transition:all .18s;
          white-space:nowrap;
        }
        .cls-year-pill-inactive {
          background:rgb(var(--color-bg));
          color:rgb(var(--color-muted));
          border:1.5px solid rgb(var(--color-border));
        }
        .cls-year-pill-inactive:hover {
          background:rgba(var(--color-primary),.06);
          color:rgb(var(--color-primary));
          border-color:rgba(var(--color-primary),.3);
        }
        .cls-year-pill-active {
          background:rgb(var(--color-primary));
          color:rgb(var(--color-surface));
          border:1.5px solid transparent;
          box-shadow:0 4px 14px -4px rgba(var(--color-primary),.45);
        }
        .cls-stream-grid {
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:10px;
        }
        @media (max-width:400px) {
          .cls-stream-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div
        className="cls-root"
        style={{
          fontFamily:"'DM Sans',sans-serif",
          minHeight:'100vh',
          background:cv('bg'),
          color:cv('text'),
          padding:'clamp(14px,3vw,28px)',
        }}
      >
        {/* ── Page Header ── */}
        <div style={{
          display:'flex', flexWrap:'wrap', alignItems:'flex-start',
          justifyContent:'space-between', gap:16, marginBottom:28,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{
              width:46, height:46, borderRadius:15, flexShrink:0,
              background:cv('primary'), color:cv('surface'),
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 10px 28px -6px ${cva('primary',.5)}`,
            }}>
              <I.GradCap width={20} height={20} />
            </div>
            <div>
              <h1 style={{
                margin:0, fontFamily:"'Sora',sans-serif", fontWeight:900,
                fontSize:'clamp(20px,3vw,26px)', color:cv('text'),
                letterSpacing:'-.7px', lineHeight:1.1,
              }}>
                Classes
              </h1>
              <p style={{ margin:'3px 0 0', fontSize:12.5, color:cv('muted'), fontWeight:500 }}>
                Manage academic classes, sections &amp; streams
              </p>
            </div>
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            style={{
              display:'inline-flex', alignItems:'center', gap:7,
              padding:'10px 20px', borderRadius:13, border:'none',
              background:cv('primary'), color:cv('surface'),
              fontFamily:"'Sora',sans-serif", fontWeight:700, fontSize:13.5,
              cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'-.2px',
              boxShadow:`0 8px 24px -6px ${cva('primary',.45)}`,
              transition:'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.08)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 14px 32px -6px ${cva('primary',.55)}`; }}
            onMouseLeave={e => { e.currentTarget.style.filter='none'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 8px 24px -6px ${cva('primary',.45)}`; }}
          >
            <I.Plus width={13} height={13} /> Add New Class
          </button>
        </div>

        {/* ── Stat Cards ── */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',
          gap:'clamp(10px,2vw,16px)',
          marginBottom:24,
        }}>
          <StatCard icon={I.GradCap} label="Total Classes"   value={stats.uniqueClasses}  colorVar="primary"   delay={0}   />
          <StatCard icon={I.Grid}    label="Total Sections"  value={stats.totalSections}  colorVar="secondary" delay={60}  />
          <StatCard icon={I.Users}   label="Total Students"  value={stats.totalStudents}  colorVar="success"   delay={120} />
        </div>

        {/* ── Filter Bar: Academic Year Pill Tabs ── */}
        <div style={{
          background:cv('surface'), borderRadius:16,
          border:`1px solid ${cv('border')}`,
          padding:'14px 18px', marginBottom:16,
          boxShadow:`0 2px 12px -4px ${cva('text',.05)}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:6,
              fontSize:11.5, fontWeight:700, textTransform:'uppercase',
              letterSpacing:'.09em', color:cv('muted'), marginRight:4, flexShrink:0,
            }}>
              <I.Filter width={12} height={12} /> Filter by Year
            </div>

            {/* All pill */}
            <button
              className={`cls-year-pill ${!selectedAcademicYear ? 'cls-year-pill-active' : 'cls-year-pill-inactive'}`}
              onClick={() => setSelectedAcademicYear('')}
            >
              All Years
            </button>

            {/* One pill per academic year */}
            {academicYearOptions.map(opt => (
              <button
                key={opt.value}
                className={`cls-year-pill ${selectedAcademicYear === opt.value ? 'cls-year-pill-active' : 'cls-year-pill-inactive'}`}
                onClick={() => setSelectedAcademicYear(selectedAcademicYear === opt.value ? '' : opt.value)}
              >
                {selectedAcademicYear === opt.value && <I.Check width={11} height={11} />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div style={{
          transition:'all .3s',
          width: collapsed ? '90vw' : 'clamp(300px,73vw,100%)',
          maxWidth:'100%',
          overflowX:'auto',
        }}>
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
            tablePlaceholder="Search by class, section, or stream…"
            error={error}
            isError={isError}
            loading={isLoading}
            fetching={isLoading}
          />
        </div>
      </div>

      {/* ══ Add / Edit Modal ══ */}
      <ClassModal
        isOpen={showModal}
        onClose={closeModal}
        title={editingItem ? 'Edit Class' : 'Add New Class'}
        subtitle={editingItem ? 'Update class information' : 'Create a new academic class'}
      >
        <form onSubmit={handleSubmit} noValidate>

          {/* Class Name */}
          <Field label="Class Name" required error={touched.name && formErrors.name}
            hint={requiresStream ? '✨ Stream selection is mandatory for 11th & 12th' : '📘 No stream needed for classes 1–10'}>
            <StyledSelect
              value={formData.name}
              onChange={e => setField('name', e.target.value)}
              options={CLASS_OPTIONS}
              placeholder="Select a class"
              hasError={!!(touched.name && formErrors.name)}
            />
          </Field>

          {/* Stream — animated reveal */}
          {requiresStream && (
            <Field label="Stream" required error={touched.streams && formErrors.streams}
              style={{ animation:'cls-slidein .25s ease' }}>
              <div className="cls-stream-grid">
                {STREAM_OPTIONS.map(s => (
                  <StreamCard
                    key={s.value}
                    stream={s}
                    selected={formData.streams === s.value}
                    onClick={() => setField('streams', s.value)}
                  />
                ))}
              </div>
            </Field>
          )}

          {/* Academic Session */}
          <Field label="Academic Session" required error={touched.academicSessionId && formErrors.academicSessionId}>
            <StyledSelect
              value={formData.academicSessionId}
              onChange={e => setField('academicSessionId', e.target.value)}
              options={academicYearOptions}
              placeholder="Select academic session"
              hasError={!!(touched.academicSessionId && formErrors.academicSessionId)}
            />
          </Field>

          {/* Edit hint */}
          {editingItem && (
            <div style={{
              display:'flex', alignItems:'center', gap:7,
              padding:'9px 13px', borderRadius:10,
              background:cva('primary',.09), color:cv('primary'),
              fontSize:12.5, fontWeight:600, marginBottom:18,
            }}>
              <I.Edit width={12} height={12} />
              Editing: <strong style={{ marginLeft:4 }}>{editingItem.className}</strong>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:10, marginTop:6 }}>
            <button
              type="button"
              onClick={closeModal}
              style={{
                flex:1, padding:'11px 0', borderRadius:12,
                border:`1.5px solid ${cv('border')}`,
                background:cv('bg'), color:cv('muted'),
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                transition:'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = cv('surface-hover')}
              onMouseLeave={e => e.currentTarget.style.background = cv('bg')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isMutating}
              style={{
                flex:1, padding:'11px 0', borderRadius:12, border:'none',
                background: isMutating ? cva('primary',.6) : cv('primary'),
                color:cv('surface'),
                fontSize:13.5, fontWeight:700,
                cursor: isMutating ? 'not-allowed' : 'pointer',
                fontFamily:"'Sora',sans-serif",
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
                boxShadow: isMutating ? 'none' : `0 6px 18px -4px ${cva('primary',.44)}`,
                transition:'all .15s',
              }}
              onMouseEnter={e => { if (!isMutating) e.currentTarget.style.filter='brightness(1.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter='none'; }}
            >
              {isMutating
                ? <><I.Spinner width={14} height={14} /> Saving…</>
                : editingItem ? 'Update Class' : 'Create Class'
              }
            </button>
          </div>
        </form>
      </ClassModal>

      {/* ══ Confirm Delete ══ */}
      <ConfirmBox
        isOpen={confirmDel.open}
        message={`Are you sure you want to delete "${confirmDel.item?.className}"? This action cannot be undone.`}
        onConfirm={handleConfirmDel}
        onCancel={() => setConfirmDel({ open:false, item:null })}
      />
    </>
  );
}