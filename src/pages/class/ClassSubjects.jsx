import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiPath from '../../api/apiPath';
import { apiGet, apiDelete } from '../../api/apiFetch';
import toast from 'react-hot-toast';

/* ═══════════════════════════════════════════════════════════════
   CSS VARIABLE HELPERS
═══════════════════════════════════════════════════════════════ */
const cv  = (n)    => `rgb(var(--color-${n}))`;
const cva = (n, a) => `rgba(var(--color-${n}),${a})`;

/* ═══════════════════════════════════════════════════════════════
   SUBJECT META
═══════════════════════════════════════════════════════════════ */
const SUBJECT_META = {
  Math:      { emoji: '📐', color: 'primary'   },
  Maths:     { emoji: '📐', color: 'primary'   },
  Science:   { emoji: '🔬', color: 'info'      },
  Hindi:     { emoji: '📖', color: 'secondary' },
  Sanskrit:  { emoji: '🕉️', color: 'orange'    },
  English:   { emoji: '📝', color: 'success'   },
  SST:       { emoji: '🌏', color: 'purple'    },
  Sst:       { emoji: '🌏', color: 'purple'    },
  Physics:   { emoji: '⚡', color: 'info'      },
  Chemistry: { emoji: '🧪', color: 'danger'    },
  Biology:   { emoji: '🧬', color: 'success'   },
  GKS:       { emoji: '🌟', color: 'orange'    },
  Gks:       { emoji: '🌟', color: 'orange'    },
  Geography: { emoji: '🗺️', color: 'info'      },
  History:   { emoji: '📜', color: 'secondary' },
  Computer:  { emoji: '💻', color: 'primary'   },
  Music:     { emoji: '🎵', color: 'purple'    },
  Art:       { emoji: '🎨', color: 'danger'    },
  PE:        { emoji: '⚽', color: 'success'   },
};
const COLOR_CYCLE = ['primary','info','success','purple','orange','secondary','danger'];

function getSubjectMeta(name = '', index = 0) {
  const key = Object.keys(SUBJECT_META).find(k => k.toLowerCase() === name.toLowerCase());
  if (key) return SUBJECT_META[key];
  return { emoji: '📚', color: COLOR_CYCLE[index % COLOR_CYCLE.length] };
}

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const I = {
  ArrowLeft:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Grid:        (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  List:        (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Trash:       (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  Check:       (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  X:           (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  Layers:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  Clock:       (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Spinner:     (p) => <svg {...p} fill="none" viewBox="0 0 24 24" style={{...(p.style||{}),animation:'csub-spin .7s linear infinite'}}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity=".25"/><path fill="currentColor" opacity=".75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  AlertCircle: (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Search:      (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  Minus:       (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  SelectAll:   (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 12 11 14 15 10"/></svg>,
  BookOpen:    (p) => <svg {...p} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
};

/* ═══════════════════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════════════════ */
function ConfirmDialog({ isOpen, onConfirm, onCancel, count, isPending }) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position:'fixed', inset:0, zIndex:100,
        display:'flex', alignItems:'center', justifyContent:'center', padding:16,
        background:'rgba(0,0,0,.65)', backdropFilter:'blur(8px)',
        animation:'csub-fade .18s ease',
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background:cv('surface'), borderRadius:24, padding:'28px 28px 24px',
          width:'100%', maxWidth:400,
          border:`1px solid ${cva('danger',.25)}`,
          boxShadow:`0 40px 80px -12px rgba(0,0,0,.5), 0 0 0 1px ${cva('danger',.1)}`,
          animation:'csub-pop .22s cubic-bezier(.34,1.56,.64,1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          width:56, height:56, borderRadius:18, margin:'0 auto 20px',
          background:`linear-gradient(135deg,${cva('danger',.2)},${cva('orange',.1)})`,
          border:`1.5px solid ${cva('danger',.3)}`,
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 8px 24px -6px ${cva('danger',.35)}`,
          color:cv('danger'),
        }}>
          <I.Trash width={24} height={24}/>
        </div>
        <h3 style={{
          margin:'0 0 8px', textAlign:'center',
          fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800,
          fontSize:20, color:cv('text'), letterSpacing:'-.5px',
        }}>
          Remove {count} Subject{count > 1 ? 's' : ''}?
        </h3>
        <p style={{
          margin:'0 0 26px', textAlign:'center',
          fontSize:13.5, color:cv('muted'), lineHeight:1.6,
        }}>
          {count === 1
            ? 'This subject will be removed from the class. This cannot be undone.'
            : `These ${count} subjects will be removed from the class. This cannot be undone.`
          }
        </p>
        <div style={{ display:'flex', gap:10 }}>
          <button
            onClick={onCancel} disabled={isPending}
            style={{
              flex:1, padding:'12px 0', borderRadius:13,
              border:`1.5px solid ${cv('border')}`,
              background:'transparent', color:cv('muted'),
              fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
              transition:'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background=cva('text',.04); e.currentTarget.style.color=cv('text'); }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=cv('muted'); }}
          >Cancel</button>
          <button
            onClick={onConfirm} disabled={isPending}
            // style={{
            //   flex:1, padding:'12px 0', borderRadius:13, border:'none',
            //   background:`linear-gradient(135deg,${cv('danger')},${cva('orange',1)})`,
            //   color:'#fff', fontSize:13.5, fontWeight:700,
            //   cursor: isPending ? 'not-allowed' : 'pointer',
            //   fontFamily:"'Cabinet Grotesk',sans-serif",
            //   display:'flex', alignItems:'center', justifyContent:'center', gap:7,
            //   boxShadow:`0 6px 20px -4px ${cva('danger',.5)}`,
            //   opacity: isPending ? .7 : 1, transition:'all .15s',
            // }}
            // onMouseEnter={e => { if(!isPending) e.currentTarget.style.filter='brightness(1.08)'; }}
            // onMouseLeave={e => e.currentTarget.style.filter='none'}
            className='bg-red-500 px-2 py-1 rounded flex items-center gap-1 text-white cursor-pointer'
          >
            {isPending ? <><I.Spinner width={14} height={14}/> Removing…</> : <><I.Trash width={14} height={14}/> Yes, Remove</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBJECT CARD — Grid view
═══════════════════════════════════════════════════════════════ */
function SubjectCard({ subject, index, selected, onSelect, onDeleteSingle }) {
  const { emoji, color } = getSubjectMeta(subject.name, index);
  const date = subject.createdAt
    ? new Date(subject.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    : '—';

  return (
    <div
      style={{
        borderRadius:20, position:'relative', overflow:'hidden',
        background: selected
          ? `linear-gradient(145deg,${cva(color,.2)},${cva(color,.07)})`
          : cv('surface'),
        border:`1.5px solid ${selected ? cva(color,.55) : cv('border')}`,
        padding:'20px',
        transition:'all .22s cubic-bezier(.4,0,.2,1)',
        animation:`csub-card .45s ease both`,
        animationDelay:`${Math.min(index*55,420)}ms`,
        cursor:'pointer',
        boxShadow: selected
          ? `0 0 0 3px ${cva(color,.18)}, 0 10px 28px -6px ${cva(color,.2)}`
          : '0 1px 4px rgba(0,0,0,.06)',
      }}
      onClick={() => onSelect(subject._id)}
      onMouseEnter={e => {
        if(!selected){
          e.currentTarget.style.transform='translateY(-4px)';
          e.currentTarget.style.boxShadow=`0 14px 36px -8px ${cva(color,.22)},0 0 0 1px ${cva(color,.18)}`;
        //   e.currentTarget.style.borderColor=cva(color,.38);
        }
      }}
      onMouseLeave={e => {
        if(!selected){
          e.currentTarget.style.transform='none';
          e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,.06)';
          e.currentTarget.style.borderColor=cv('border');
        }
      }}
    >
      {/* Decorative bg orb */}
      <div style={{
        position:'absolute', bottom:-30, right:-30, width:100, height:100,
        borderRadius:'50%', background:cv(color), opacity:.06, pointerEvents:'none',
      }}/>

      {/* Index badge */}
      <div style={{
        position:'absolute', top:12, left:14,
        padding:'2px 8px', borderRadius:20,
        background:cva(color,.14), color:cv(color),
        fontSize:9.5, fontWeight:800, fontFamily:"'Cabinet Grotesk',sans-serif",
        letterSpacing:'.06em', textTransform:'uppercase',
      }}>#{String(index+1).padStart(2,'0')}</div>

      {/* Checkbox */}
      <div
        style={{
          position:'absolute', top:12, right:14,
          width:22, height:22, borderRadius:7,
          border:`2px solid ${selected ? cv(color) : cva('text',.15)}`,
          background: selected ? cv(color) : 'transparent',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .15s', zIndex:2,
          boxShadow: selected ? `0 4px 10px -2px ${cva(color,.45)}` : 'none',
        }}
        onClick={e => { e.stopPropagation(); onSelect(subject._id); }}
      >
        {selected && <I.Check width={11} height={11} style={{color:'#fff'}}/>}
      </div>

      {/* Emoji icon */}
      <div style={{
        width:52, height:52, borderRadius:16, marginTop:22, marginBottom:14, fontSize:23,
        background:`linear-gradient(135deg,${cv(color)},${cva(color,.65)})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 10px 24px -6px ${cva(color,.55)}`,
      }}>{emoji}</div>

      {/* Name */}
      <div style={{
        fontFamily:"'Cabinet Grotesk',sans-serif",
        fontWeight:800, fontSize:16, color:cv('text'),
        letterSpacing:'-.3px', marginBottom:5,
      }}>{subject.name}</div>

      {/* Description */}
      <div style={{
        fontSize:12, color:cv('muted'), lineHeight:1.6,
        marginBottom:16, minHeight:18,
        display:'-webkit-box', WebkitLineClamp:2,
        WebkitBoxOrient:'vertical', overflow:'hidden',
      }}>
        {subject.description || 'No description provided'}
      </div>

      {/* Footer */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        paddingTop:11, borderTop:`1px solid ${cva(color,.12)}`,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:cv('muted'), fontWeight:500 }}>
          <I.Clock width={10} height={10}/> {date}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onDeleteSingle(subject._id); }}
          style={{
            width:30, height:30, borderRadius:10, border:'none',
            background:cva('danger',.08), color:cv('danger'),
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', transition:'all .15s',
          }}
          title="Remove"
          onMouseEnter={e => { e.currentTarget.style.background=cva('danger',.2); e.currentTarget.style.transform='scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background=cva('danger',.08); e.currentTarget.style.transform='none'; }}
        >
          <I.Trash width={13} height={13}/>
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBJECT ROW — List view
═══════════════════════════════════════════════════════════════ */
function SubjectRow({ subject, index, selected, onSelect, onDeleteSingle }) {
  const { emoji, color } = getSubjectMeta(subject.name, index);
  const date = subject.createdAt
    ? new Date(subject.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
    : '—';

  return (
    <div
      style={{
        display:'flex', alignItems:'center', gap:14,
        padding:'13px 16px', borderRadius:16,
        background: selected
          ? `linear-gradient(90deg,${cva(color,.12)},${cva(color,.04)})`
          : cv('surface'),
        border:`1.5px solid ${selected ? cva(color,.45) : cv('border')}`,
        cursor:'pointer', transition:'all .18s',
        animation:`csub-card .4s ease both`,
        animationDelay:`${Math.min(index*40,320)}ms`,
        boxShadow: selected ? `0 0 0 3px ${cva(color,.12)}` : 'none',
      }}
      onClick={() => onSelect(subject._id)}
      onMouseEnter={e => {
        if(!selected){
          e.currentTarget.style.borderColor=cva(color,.32);
          e.currentTarget.style.background=cva(color,.04);
          e.currentTarget.style.transform='translateX(4px)';
        }
      }}
      onMouseLeave={e => {
        if(!selected){
          e.currentTarget.style.borderColor=cv('border');
          e.currentTarget.style.background=cv('surface');
          e.currentTarget.style.transform='none';
        }
      }}
    >
      {/* Checkbox */}
      <div
        style={{
          width:20, height:20, borderRadius:6, flexShrink:0,
          border:`2px solid ${selected ? cv(color) : cva('text',.15)}`,
          background: selected ? cv(color) : 'transparent',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'all .15s',
          boxShadow: selected ? `0 3px 8px -2px ${cva(color,.45)}` : 'none',
        }}
        onClick={e => { e.stopPropagation(); onSelect(subject._id); }}
      >
        {selected && <I.Check width={10} height={10} style={{color:'#fff'}}/>}
      </div>

      {/* Emoji */}
      <div style={{
        width:42, height:42, borderRadius:13, flexShrink:0, fontSize:18,
        background:`linear-gradient(135deg,${cv(color)},${cva(color,.65)})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 6px 14px -4px ${cva(color,.5)}`,
      }}>{emoji}</div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{
          fontFamily:"'Cabinet Grotesk',sans-serif",
          fontWeight:800, fontSize:14.5, color:cv('text'), letterSpacing:'-.2px',
        }}>{subject.name}</div>
        <div style={{
          fontSize:11.5, color:cv('muted'), marginTop:2,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
        }}>
          {subject.description || 'No description'}
        </div>
      </div>

      {/* Color tag */}
      <div style={{
        padding:'3px 10px', borderRadius:20, flexShrink:0,
        background:cva(color,.12), color:cv(color),
        fontSize:11, fontWeight:700, whiteSpace:'nowrap',
        border:`1px solid ${cva(color,.22)}`,
      }}>
        {emoji} {subject.name}
      </div>

      {/* Date */}
      <div style={{
        display:'flex', alignItems:'center', gap:5, flexShrink:0,
        fontSize:11.5, color:cv('muted'), whiteSpace:'nowrap',
      }}>
        <I.Clock width={11} height={11}/> {date}
      </div>

      {/* Delete */}
      <button
        onClick={e => { e.stopPropagation(); onDeleteSingle(subject._id); }}
        style={{
          width:34, height:34, borderRadius:11, border:'none', flexShrink:0,
          background:cva('danger',.08), color:cv('danger'),
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', transition:'all .15s',
        }}
        title="Remove"
        onMouseEnter={e => { e.currentTarget.style.background=cva('danger',.2); e.currentTarget.style.transform='scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background=cva('danger',.08); e.currentTarget.style.transform='none'; }}
      >
        <I.Trash width={14} height={14}/>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function ClassSubjects() {
  const { id: classId } = useParams();
  const navigate        = useNavigate();
  const location        = useLocation();
  const queryClient     = useQueryClient();

  const className = location.state?.className || 'Class';

  const [viewMode,    setViewMode]    = useState('grid');
  const [selected,    setSelected]    = useState(new Set());
  console.log("selected",selected);
  const [search,      setSearch]      = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDel,  setPendingDel]  = useState(null); // null=bulk, string=single id

  /* ─── Query ─── */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['classSubjects', classId],
    queryFn:  () => apiGet(`${apiPath.getClassSubjects}/${classId}`),
    enabled:  !!classId,
  });

  const allSubjects = useMemo(() => data?.results?.docs || data?.results || [], [data]);

  const subjects = useMemo(() => {
    if (!search.trim()) return allSubjects;
    const q = search.toLowerCase();
    return allSubjects.filter(s =>
      s.name?.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q)
    );
  }, [allSubjects, search]);

  /* ─── Delete mutation ─── */
  const deleteMutation = useMutation({
    mutationFn: (subjectIds) =>
      apiDelete(`${apiPath.removeSubjectsFromClass}/${classId}`, { subjectIds }),
    onSuccess: (_, subjectIds) => {
      toast.success(subjectIds.length === 1
        ? 'Subject removed successfully'
        : `${subjectIds.length} subjects removed`
      );
      setSelected(new Set());
      setConfirmOpen(false);
      setPendingDel(null);
      queryClient.invalidateQueries({ queryKey: ['classSubjects', classId] });
    },
    onError: (e) => {
      toast.error(e?.response?.data?.message || 'Failed to remove subjects');
    },
  });

  /* ─── Selection ─── */
  const toggleSelect = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected(prev =>
      prev.size === subjects.length
        ? new Set()
        : new Set(subjects.map(s => s._id))
    );
  }, [subjects]);

  /* ─── Delete ─── */
  const handleDeleteSingle = (id) => { setPendingDel(id); setConfirmOpen(true); };
  const handleDeleteBulk   = ()   => { setPendingDel(null); setConfirmOpen(true); };
  const handleConfirm      = ()   => deleteMutation.mutate(pendingDel ? [pendingDel] : Array.from(selected));
  const handleCancel       = ()   => { setConfirmOpen(false); setPendingDel(null); };

  const total       = allSubjects.length;
  const allSelected = subjects.length > 0 && selected.size === subjects.length;
  const someSelected= selected.size > 0 && !allSelected;
  const deleteCount = pendingDel ? 1 : selected.size;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Satoshi:wght@400;500;600;700&display=swap');
        @keyframes csub-spin  { to { transform:rotate(360deg); } }
        @keyframes csub-fade  { from{opacity:0} to{opacity:1} }
        @keyframes csub-pop   { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:none} }
        @keyframes csub-card  { from{opacity:0;transform:scale(.94) translateY(12px)} to{opacity:1;transform:none} }
        @keyframes csub-in    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes csub-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes csub-pulse { 0%,100%{opacity:1} 50%{opacity:.5} }

        .csub-root { animation:csub-in .4s ease; font-family:'Satoshi',sans-serif; }
        .csub-root * { box-sizing:border-box; }

        .csub-back {
          display:inline-flex; align-items:center; gap:7px;
          padding:8px 16px; border-radius:12px; border:none;
          font-size:13px; font-weight:600; cursor:pointer;
          font-family:'Satoshi',sans-serif; transition:all .18s;
          background:rgb(var(--color-surface));
          color:rgb(var(--color-muted));
          border:1.5px solid rgb(var(--color-border));
        }
        .csub-back:hover {
          background:rgba(var(--color-primary),.08);
          color:rgb(var(--color-primary));
          border-color:rgba(var(--color-primary),.3);
          transform:translateX(-2px);
        }

        .csub-view-btn {
          width:38px; height:38px; border-radius:11px; border:none;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all .18s;
        }
        .csub-view-btn.active {
          background:rgb(var(--color-primary));
          color:rgb(var(--color-surface));
          box-shadow:0 4px 14px -4px rgba(var(--color-primary),.5);
        }
        .csub-view-btn.inactive {
          background:transparent;
          color:rgb(var(--color-muted));
          border:1.5px solid rgb(var(--color-border));
        }
        .csub-view-btn.inactive:hover {
          background:rgba(var(--color-primary),.07);
          color:rgb(var(--color-primary));
          border-color:rgba(var(--color-primary),.3);
        }

        .csub-search-wrap { position:relative; flex:1 1 200px; min-width:0; }
        .csub-search-icon {
          position:absolute; left:12px; top:50%; transform:translateY(-50%);
          color:rgb(var(--color-muted)); pointer-events:none;
        }
        .csub-search {
          width:100%; background:rgb(var(--color-surface));
          border:1.5px solid rgb(var(--color-border)); border-radius:13px;
          padding:10px 14px 10px 38px; font-size:13.5px;
          color:rgb(var(--color-text)); outline:none;
          font-family:'Satoshi',sans-serif; font-weight:500; transition:all .18s;
        }
        .csub-search::placeholder { color:rgb(var(--color-muted)); }
        .csub-search:focus {
          border-color:rgb(var(--color-primary));
          box-shadow:0 0 0 3px rgba(var(--color-primary),.12);
          background:rgb(var(--color-bg));
        }

        .csub-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(210px,1fr));
          gap:clamp(10px,2vw,16px);
        }
        .csub-list { display:flex; flex-direction:column; gap:8px; }

        .csub-bulk-bar {
          display:flex; align-items:center; gap:12px; flex-wrap:wrap;
          padding:12px 18px; border-radius:16px; margin-bottom:16px;
          background:linear-gradient(90deg,rgba(var(--color-primary),.12),rgba(var(--color-info),.06));
          border:1.5px solid rgba(var(--color-primary),.28);
          animation:csub-in .2s ease;
        }

        @media (max-width:640px) {
          .csub-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); }
          .csub-hero-stats { display:none !important; }
        }
        @media (max-width:420px) {
          .csub-grid { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      <div
        className="csub-root"
        style={{
          minHeight:'100vh',
          background:cv('bg'),
          color:cv('text'),
          padding:'clamp(14px,3vw,30px)',
        }}
      >
        {/* ── Back ── */}
        <button className="csub-back" onClick={() => navigate(-1)} style={{ marginBottom:22 }}>
          <I.ArrowLeft width={14} height={14}/> Back to Classes
        </button>

        {/* ══ Hero Header ══ */}
        <div style={{
          position:'relative', borderRadius:24, overflow:'hidden',
          background:`linear-gradient(135deg,${cva('primary',.13)} 0%,${cva('info',.07)} 55%,${cva('purple',.05)} 100%)`,
          border:`1px solid ${cva('primary',.18)}`,
          padding:'clamp(20px,3vw,30px)',
          marginBottom:22,
        }}>
          {/* Decorative shapes */}
          <div style={{ position:'absolute', top:-50, right:-50, width:180, height:180, borderRadius:'50%', background:cv('primary'), opacity:.05, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', bottom:-40, left:80, width:120, height:120, borderRadius:'50%', background:cv('info'), opacity:.07, pointerEvents:'none' }}/>
          <div style={{ position:'absolute', top:10, right:'30%', width:50, height:50, borderRadius:'50%', background:cv('purple'), opacity:.06, pointerEvents:'none' }}/>

          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:20, position:'relative', zIndex:1 }}>
            {/* Class avatar */}
            <div style={{
              width:64, height:64, borderRadius:20, flexShrink:0,
              background:`linear-gradient(135deg,${cv('primary')},${cva('info',1)})`,
              color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:900, fontSize:22,
              boxShadow:`0 14px 36px -8px ${cva('primary',.55)}`,
              animation:'csub-float 3s ease-in-out infinite',
            }}>{className}</div>

            <div style={{ flex:1, minWidth:180 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:6,
                padding:'3px 10px', borderRadius:20,
                background:cva('primary',.15), color:cv('primary'),
                fontSize:10.5, fontWeight:700, textTransform:'uppercase',
                letterSpacing:'.1em', marginBottom:8,
                border:`1px solid ${cva('primary',.22)}`,
              }}>
                <I.BookOpen width={10} height={10}/> Academic Class
              </div>
              <h1 style={{
                margin:0, fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:900,
                fontSize:'clamp(20px,4vw,30px)', color:cv('text'),
                letterSpacing:'-1px', lineHeight:1.1,
              }}>
                Class {className} — Subjects
              </h1>
              <p style={{ margin:'6px 0 0', fontSize:13.5, color:cv('muted'), fontWeight:500 }}>
                {isLoading ? 'Loading…' : `${total} subject${total !== 1 ? 's' : ''} assigned to this class`}
              </p>
            </div>

            {/* Total counter */}
            {!isLoading && !isError && (
              <div
                className="csub-hero-stats"
                style={{
                  padding:'16px 24px', borderRadius:18, flexShrink:0,
                  background:cv('surface'),
                  border:`1px solid ${cv('border')}`,
                  boxShadow:`0 4px 22px -6px rgba(0,0,0,.12)`,
                  textAlign:'center',
                }}
              >
                <div style={{
                  fontFamily:"'Cabinet Grotesk',sans-serif",
                  fontWeight:900, fontSize:40, color:cv('text'),
                  letterSpacing:'-2px', lineHeight:1,
                }}>{total}</div>
                <div style={{ fontSize:11, color:cv('muted'), fontWeight:700, marginTop:4, textTransform:'uppercase', letterSpacing:'.08em' }}>
                  Subjects
                </div>
              </div>
            )}
          </div>

          {/* Subject pills preview */}
          {!isLoading && allSubjects.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:18, position:'relative', zIndex:1 }}>
              {allSubjects.slice(0,7).map((s,i) => {
                const { emoji, color } = getSubjectMeta(s.name, i);
                return (
                  <span key={s._id} style={{
                    display:'inline-flex', alignItems:'center', gap:5,
                    padding:'4px 11px', borderRadius:20,
                    background:cva(color,.12), color:cv(color),
                    border:`1px solid ${cva(color,.22)}`,
                    fontSize:12, fontWeight:700,
                  }}>{emoji} {s.name}</span>
                );
              })}
              {allSubjects.length > 7 && (
                <span style={{
                  display:'inline-flex', alignItems:'center',
                  padding:'4px 11px', borderRadius:20,
                  background:cva('text',.05), color:cv('muted'),
                  border:`1px solid ${cv('border')}`,
                  fontSize:12, fontWeight:600,
                }}>+{allSubjects.length - 7} more</span>
              )}
            </div>
          )}
        </div>

        {/* ══ Toolbar ══ */}
        {!isLoading && !isError && allSubjects.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:10, marginBottom:16 }}>
            {/* Search */}
            <div className="csub-search-wrap">
              <div className="csub-search-icon"><I.Search width={15} height={15}/></div>
              <input
                className="csub-search"
                placeholder="Search subjects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Select all */}
            <button
              onClick={toggleSelectAll}
              style={{
                display:'inline-flex', alignItems:'center', gap:6,
                padding:'9px 14px', borderRadius:12, border:'none',
                background: allSelected ? cva('primary',.14) : cva('text',.05),
                color: allSelected ? cv('primary') : cv('muted'),
                fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                transition:'all .15s', whiteSpace:'nowrap',
                outline: allSelected ? `1.5px solid ${cva('primary',.35)}` : '1.5px solid transparent',
              }}
              onMouseEnter={e => { e.currentTarget.style.color=cv('primary'); }}
              onMouseLeave={e => { if(!allSelected) e.currentTarget.style.color=cv('muted'); }}
            >
              {someSelected ? <I.Minus width={13} height={13}/> : <I.SelectAll width={13} height={13}/>}
              {allSelected ? 'Deselect All' : someSelected ? 'Clear' : 'Select All'}
            </button>

            {/* View toggle */}
            <div style={{
              display:'flex', gap:3, padding:3, borderRadius:13,
              background:cva('text',.04), border:`1px solid ${cv('border')}`,
            }}>
              <button className={`csub-view-btn ${viewMode==='grid'?'active':'inactive'}`} onClick={() => setViewMode('grid')} title="Grid view">
                <I.Grid width={15} height={15}/>
              </button>
              <button className={`csub-view-btn ${viewMode==='list'?'active':'inactive'}`} onClick={() => setViewMode('list')} title="List view">
                <I.List width={15} height={15}/>
              </button>
            </div>
          </div>
        )}

        {/* ══ Bulk action bar ══ */}
        {selected.size > 0 && (
          <div className="csub-bulk-bar">
            <div style={{
              width:30, height:30, borderRadius:9, flexShrink:0,
              background:cv('primary'), color:cv('surface'),
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:900, fontSize:13,
              boxShadow:`0 4px 12px -4px ${cva('primary',.5)}`,
            }}>{selected.size}</div>
            <span style={{ fontSize:13.5, fontWeight:600, color:cv('text'), flex:1 }}>
              subject{selected.size > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelected(new Set())}
              style={{
                display:'inline-flex', alignItems:'center', gap:5,
                padding:'6px 12px', borderRadius:9,
                border:`1px solid ${cv('border')}`,
                background:'transparent', color:cv('muted'),
                fontSize:12.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
                transition:'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color=cv('text'); e.currentTarget.style.borderColor=cv('text'); }}
              onMouseLeave={e => { e.currentTarget.style.color=cv('muted'); e.currentTarget.style.borderColor=cv('border'); }}
            >
              <I.X width={12} height={12}/> Clear
            </button>
                     <button
              onClick={handleConfirm}
            className='flex items-center gap-2 bg-red-500 text-white rounded px-2 py-1 text-sm cursor-pointer'
            >
              <I.X width={12} height={12}/> Delete 
            </button>
            
            <button
              onClick={handleDeleteBulk}
              style={{
                display:'inline-flex', alignItems:'center', gap:7,
                padding:'9px 20px', borderRadius:12, border:'none',
                background:`linear-gradient(135deg,${cv('danger')},${cva('orange',1)})`,
                color:'#fff', fontSize:13.5, fontWeight:700,
                cursor:'pointer', fontFamily:"'Cabinet Grotesk',sans-serif",
                boxShadow:`0 6px 18px -4px ${cva('danger',.48)}`,
                transition:'all .15s', whiteSpace:'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter='brightness(1.08)'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter='none'; e.currentTarget.style.transform='none'; }}
            >
              <I.Trash width={14} height={14}/> Remove {selected.size} Subject{selected.size > 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* ══ Loading ══ */}
        {isLoading && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:'110px 0' }}>
            <div style={{
              width:64, height:64, borderRadius:22,
              background:`linear-gradient(135deg,${cva('primary',.14)},${cva('info',.07)})`,
              border:`1px solid ${cva('primary',.2)}`,
              display:'flex', alignItems:'center', justifyContent:'center', color:cv('primary'),
            }}>
              <I.Spinner width={30} height={30}/>
            </div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:700, color:cv('muted'), fontSize:15 }}>
              Loading subjects…
            </div>
          </div>
        )}

        {/* ══ Error ══ */}
        {isError && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:'110px 0' }}>
            <div style={{
              width:64, height:64, borderRadius:22,
              background:cva('danger',.1), color:cv('danger'),
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <I.AlertCircle width={28} height={28}/>
            </div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:18, color:cv('text') }}>
              Failed to load subjects
            </div>
            <div style={{ fontSize:13.5, color:cv('muted') }}>
              {error?.message || 'Something went wrong. Please try again.'}
            </div>
          </div>
        )}

        {/* ══ Empty state ══ */}
        {!isLoading && !isError && allSubjects.length === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:18, padding:'90px 0', textAlign:'center' }}>
            <div style={{
              width:84, height:84, borderRadius:28, fontSize:40,
              background:`linear-gradient(135deg,${cva('primary',.1)},${cva('info',.06)})`,
              border:`1.5px solid ${cva('primary',.14)}`,
              display:'flex', alignItems:'center', justifyContent:'center',
              animation:'csub-float 3s ease-in-out infinite',
            }}>📚</div>
            <div>
              <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:900, fontSize:20, color:cv('text') }}>
                No Subjects Assigned Yet
              </div>
              <div style={{ fontSize:13.5, color:cv('muted'), marginTop:8, maxWidth:320, lineHeight:1.65 }}>
                Go back to Classes and click <strong style={{color:cv('primary')}}>Add Subjects</strong> to assign subjects to Class {className}.
              </div>
            </div>
            <button
              onClick={() => navigate(-1)}
              style={{
                display:'inline-flex', alignItems:'center', gap:8,
                padding:'11px 26px', borderRadius:14, border:'none',
                background:`linear-gradient(135deg,${cv('primary')},${cva('info',1)})`,
                color:'#fff', fontFamily:"'Cabinet Grotesk',sans-serif",
                fontWeight:700, fontSize:14, cursor:'pointer',
                boxShadow:`0 10px 28px -6px ${cva('primary',.5)}`,
                transition:'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.filter='brightness(1.07)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.filter='none'; }}
            >
              <I.ArrowLeft width={14} height={14}/> Go Back & Add Subjects
            </button>
          </div>
        )}

        {/* ══ No search results ══ */}
        {!isLoading && !isError && allSubjects.length > 0 && subjects.length === 0 && (
          <div style={{ textAlign:'center', padding:'70px 0' }}>
            <div style={{ fontSize:36, marginBottom:14 }}>🔍</div>
            <div style={{ fontFamily:"'Cabinet Grotesk',sans-serif", fontWeight:800, fontSize:17, color:cv('text'), marginBottom:7 }}>
              No matches for "{search}"
            </div>
            <div style={{ fontSize:13, color:cv('muted') }}>Try a different keyword</div>
          </div>
        )}

        {/* ══ Grid / List ══ */}
        {!isLoading && !isError && subjects.length > 0 && (
          <div className={viewMode === 'grid' ? 'csub-grid' : 'csub-list'}>
            {subjects.map((subject, idx) =>
              viewMode === 'grid' ? (
                <SubjectCard
                  key={subject._id} subject={subject} index={idx}
                  selected={selected.has(subject._id)}
                  onSelect={toggleSelect} onDeleteSingle={handleDeleteSingle}
                />
              ) : (
                <SubjectRow
                  key={subject._id} subject={subject} index={idx}
                  selected={selected.has(subject._id)}
                  onSelect={toggleSelect} onDeleteSingle={handleDeleteSingle}
                />
              )
            )}
          </div>
        )}

        {/* Count footer */}
        {!isLoading && !isError && subjects.length > 0 && (
          <div style={{ textAlign:'center', marginTop:26, fontSize:12, color:cv('muted'), fontWeight:500 }}>
            Showing <strong style={{color:cv('text')}}>{subjects.length}</strong> of{' '}
            <strong style={{color:cv('text')}}>{total}</strong> subjects
            {search && ` · matching "${search}"`}
          </div>
        )}
      </div>

      {/* ══ Confirm Dialog ══ */}
      <ConfirmDialog
        isOpen={confirmOpen}
        count={deleteCount}
        isPending={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </>
  );

  function handleConfirmDelete() {
    deleteMutation.mutate(pendingDel ? [pendingDel] : Array.from(selected));
  }
}