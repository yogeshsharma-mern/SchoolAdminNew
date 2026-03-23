import React, { useEffect } from "react";
import { X } from "lucide-react";

/* ── style tokens — all via CSS vars so every theme works ── */
const S = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    padding: "16px",
    overflowY: "auto",
  },
  modal: {
    background: "rgb(var(--color-surface))",
    border: "0.5px solid rgb(var(--color-border))",
    borderRadius: 20,
    width: "100%",
    maxWidth: 480,
    overflow: "hidden",
    boxShadow:
      "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
    fontFamily: "'DM Sans','Inter',sans-serif",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "20px 22px 16px",
    borderBottom: "0.5px solid rgb(var(--color-border))",
    gap: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    flexShrink: 0,
    background: "rgba(var(--color-primary),0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: "rgb(var(--color-text))",
    letterSpacing: "-0.01em",
    lineHeight: 1.3,
    margin: 0,
  },
  subtitle: {
    fontSize: 12,
    color: "rgb(var(--color-muted))",
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    flexShrink: 0,
    border: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-bg))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "rgb(var(--color-muted))",
    transition: "all 0.15s",
    marginTop: 2,
    padding: 0,
  },
  body: {
    padding: "20px 22px",
  },
  footer: {
    padding: "13px 22px",
    borderTop: "0.5px solid rgb(var(--color-border))",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    background: "rgb(var(--color-bg))",
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 480,
}) {
  /* close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={S.backdrop}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ ...S.modal, maxWidth }}>

        {/* Header */}
        <div style={S.header}>
          {icon && (
            <div style={S.iconWrap}>
              {icon}
            </div>
          )}
          <div style={S.titleBlock}>
            <p style={S.title}>{title}</p>
            {subtitle && <p style={S.subtitle}>{subtitle}</p>}
          </div>
          <button
            style={S.closeBtn}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.28)";
              e.currentTarget.style.color = "rgb(239,68,68)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgb(var(--color-bg))";
              e.currentTarget.style.borderColor = "rgb(var(--color-border))";
              e.currentTarget.style.color = "rgb(var(--color-muted))";
            }}
          >
            <X style={{ width: 12, height: 12 }} />
          </button>
        </div>

        {/* Body */}
        <div style={S.body}>{children}</div>

        {/* Footer — render if provided, else default Cancel + confirm slot */}
        {footer && <div style={S.footer}>{footer}</div>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ModalFooter — convenience sub-component for action buttons
   Usage:
     <Modal footer={
       <ModalFooter onCancel={close} onConfirm={submit} label="Save" />
     } ...>
   ───────────────────────────────────────────────────────────── */
export function ModalFooter({
  onCancel,
  onConfirm,
  label = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  danger = false,
}) {
  const confirmBg = danger ? "rgb(var(--color-danger))" : "rgb(var(--color-primary))";

  return (
    <>
      <button
        onClick={onCancel}
        style={{
          height: 34,
          padding: "0 16px",
          borderRadius: 9,
          fontSize: 12.5,
          fontWeight: 500,
          border: "0.5px solid rgb(var(--color-border))",
          background: "transparent",
          color: "rgb(var(--color-muted))",
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.14s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "rgb(var(--color-text))";
          e.currentTarget.style.background = "rgb(var(--color-surface))";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgb(var(--color-muted))";
          e.currentTarget.style.background = "transparent";
        }}
      >
        {cancelLabel}
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        style={{
          height: 34,
          padding: "0 18px",
          borderRadius: 9,
          fontSize: 12.5,
          fontWeight: 600,
          border: "none",
          background: confirmBg,
          color: "#fff",
          cursor: loading ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: loading ? 0.65 : 1,
          transition: "opacity 0.14s",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
        }}
        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.87"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = loading ? "0.65" : "1"; }}
      >
        {loading && (
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.35)",
              borderTopColor: "#fff",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
            }}
          />
        )}
        {label}
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    </>
  );
}