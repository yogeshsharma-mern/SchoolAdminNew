import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
//   getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Search,
  SlidersHorizontal,
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
  Database,
  Loader2,
} from "lucide-react";

/* ── tiny style tokens ── */
const t = {
  card: {
    background: "rgb(var(--color-surface))",
    border: "0.5px solid rgb(var(--color-border))",
    borderRadius: 18,
    overflow: "hidden",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    gap: 10,
    flexWrap: "wrap",
  },
  divider: { height: "0.5px", background: "rgb(var(--color-border))" },
  searchWrap: { position: "relative", display: "flex", alignItems: "center", flex: 1, maxWidth: 260 },
  searchInput: {
    width: "100%",
    padding: "7px 12px 7px 32px",
    fontSize: 12.5,
    borderRadius: 8,
    border: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-bg))",
    color: "rgb(var(--color-text))",
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  actBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    height: 30,
    padding: "0 11px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-bg))",
    color: "rgb(var(--color-text))",
    fontFamily: "inherit",
    transition: "all 0.14s",
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    height: 30,
    padding: "0 11px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "0.5px solid rgb(var(--color-primary))",
    background: "rgb(var(--color-primary))",
    color: "#fff",
    fontFamily: "inherit",
    transition: "opacity 0.14s",
  },
  th: {
    padding: "9px 16px",
    fontSize: 10.5,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    textAlign: "left",
    color: "rgb(var(--color-muted))",
    borderBottom: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-bg))",
    whiteSpace: "nowrap",
    cursor: "pointer",
    userSelect: "none",
  },
  td: {
    padding: "11px 16px",
    fontSize: 13,
    color: "rgb(var(--color-text))",
    verticalAlign: "middle",
    borderBottom: "0.5px solid rgb(var(--color-border))",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 18px",
    flexWrap: "wrap",
    gap: 8,
    background: "rgb(var(--color-bg))",
    borderTop: "0.5px solid rgb(var(--color-border))",
  },
  navBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    height: 28,
    padding: "0 9px",
    borderRadius: 7,
    fontSize: 11.5,
    fontWeight: 500,
    cursor: "pointer",
    border: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-surface))",
    color: "rgb(var(--color-text))",
    fontFamily: "inherit",
    transition: "all 0.13s",
  },
  pageBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 7,
    fontSize: 11.5,
    fontWeight: 500,
    cursor: "pointer",
    border: "0.5px solid transparent",
    background: "transparent",
    color: "rgb(var(--color-text))",
    fontFamily: "inherit",
    transition: "all 0.13s",
  },
  pageSelect: {
    height: 28,
    padding: "0 7px",
    borderRadius: 7,
    fontSize: 11.5,
    border: "0.5px solid rgb(var(--color-border))",
    background: "rgb(var(--color-surface))",
    color: "rgb(var(--color-text))",
    cursor: "pointer",
    outline: "none",
    fontFamily: "inherit",
    marginLeft: 4,
  },
};

export default function ReusableTable({
  columns,
  data,
  paginationState,
  setPaginationState,
  sortingState,
  setSortingState,
  globalFilter,
  setGlobalFilter,
  columnFilters,
  setColumnFilters,
  totalCount,
  tablePlaceholder,
  error,
  isError,
  fetching,
  loading,
  onNew,
}) {
  const [searchFocus, setSearchFocus] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount),
    manualPagination: true,
    state: {
      pagination: paginationState,
      sorting: sortingState,
      columnFilters,
      globalFilter,
    },
    onPaginationChange: setPaginationState,
    onSortingChange: setSortingState,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = paginationState.pageSize;
  const startItem = paginationState.pageIndex * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalCount);

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div style={{ ...t.card, fontFamily: "'DM Sans','Inter',sans-serif" }}>

      {/* ── Header ── */}
      <div style={t.header}>
        {/* Search */}
        <div style={t.searchWrap}>
          <Search style={{ position: "absolute", left: 9, width: 13, height: 13, color: "rgb(var(--color-muted))", pointerEvents: "none" }} />
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))}
            placeholder={tablePlaceholder || "Search…"}
            style={{
              ...t.searchInput,
              borderColor: searchFocus ? "rgb(var(--color-primary))" : "rgb(var(--color-border))",
              boxShadow: searchFocus ? "0 0 0 3px rgba(var(--color-primary),0.1)" : "none",
            }}
            onFocus={() => setSearchFocus(true)}
            onBlur={() => setSearchFocus(false)}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            style={t.actBtn}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgb(var(--color-primary))"; e.currentTarget.style.color = "rgb(var(--color-primary))"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgb(var(--color-border))"; e.currentTarget.style.color = "rgb(var(--color-text))"; }}
          >
            <SlidersHorizontal style={{ width: 13, height: 13 }} />
            Filter
          </button>
          {onNew && (
            <button
              onClick={onNew}
              style={t.addBtn}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.87")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <Plus style={{ width: 12, height: 12 }} />
              Add New
            </button>
          )}
        </div>
      </div>

      <div style={t.divider} />

      {/* ── Loading overlay ── */}
      <div style={{ position: "relative" }}>
        {(loading || fetching) && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.75)", zIndex: 20, minHeight: 80 }}>
            <Loader2 style={{ width: 26, height: 26, color: "rgb(var(--color-primary))", animation: "spin 0.85s linear infinite" }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {/* ── Error ── */}
        {isError && (
          <div style={{ margin: "10px 18px", padding: "9px 13px", borderRadius: 8, fontSize: 12.5, background: "rgba(239,68,68,0.08)", color: "rgb(220,38,38)", border: "0.5px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: 7 }}>
            ⚠️ {error?.message || "Something went wrong while fetching data."}
          </div>
        )}

        {/* ── Table ── */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => {
                    const sorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();
                    return (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ ...t.th, color: sorted ? "rgb(var(--color-primary))" : "rgb(var(--color-muted))", cursor: canSort ? "pointer" : "default" }}
                      >
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && (
                            <span style={{ opacity: sorted ? 1 : 0.4, display: "inline-flex" }}>
                              {sorted === "asc"
                                ? <ArrowUp style={{ width: 10, height: 10 }} />
                                : sorted === "desc"
                                  ? <ArrowDown style={{ width: 10, height: 10 }} />
                                  : <ChevronsUpDown style={{ width: 10, height: 10 }} />}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} style={{ ...t.td, textAlign: "center", padding: "52px 24px", borderBottom: "none" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgb(var(--color-bg))", border: "0.5px solid rgb(var(--color-border))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Database style={{ width: 18, height: 18, color: "rgb(var(--color-muted))" }} />
                      </div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "rgb(var(--color-text))" }}>No results found</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: "rgb(var(--color-muted))" }}>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onMouseEnter={() => setHoveredRow(row.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ background: hoveredRow === row.id ? "rgba(var(--color-primary),0.03)" : "transparent", transition: "background 0.1s" }}
                  >
                    {row.getVisibleCells().map((cell, ci) => (
                      <td
                        key={cell.id}
                        style={{ ...t.td, borderBottom: "0.5px solid rgb(var(--color-border))" }}
                        className={ci === row.getVisibleCells().length - 1 ? "last-row-td" : ""}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalCount > 0 && (
        <div style={t.footer}>
          <span style={{ fontSize: 11.5, color: "rgb(var(--color-muted))" }}>
            Showing{" "}
            <strong style={{ color: "rgb(var(--color-text))", fontWeight: 600 }}>{startItem}–{endItem}</strong>
            {" "}of{" "}
            <strong style={{ color: "rgb(var(--color-text))", fontWeight: 600 }}>{totalCount}</strong>
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Prev */}
            <button
              onClick={() => setPaginationState((old) => ({ ...old, pageIndex: old.pageIndex - 1 }))}
              disabled={!table.getCanPreviousPage()}
              style={{ ...t.navBtn, opacity: !table.getCanPreviousPage() ? 0.35 : 1, cursor: !table.getCanPreviousPage() ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if (table.getCanPreviousPage()) { e.currentTarget.style.borderColor = "rgb(var(--color-primary))"; e.currentTarget.style.color = "rgb(var(--color-primary))"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgb(var(--color-border))"; e.currentTarget.style.color = "rgb(var(--color-text))"; }}
            >
              <ChevronLeft style={{ width: 12, height: 12 }} /> Prev
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((num) => {
              const isActive = num === currentPage;
              return (
                <button
                  key={num}
                  onClick={() => setPaginationState((old) => ({ ...old, pageIndex: num - 1 }))}
                  style={{
                    ...t.pageBtn,
                    background: isActive ? "rgb(var(--color-primary))" : "transparent",
                    color: isActive ? "#fff" : "rgb(var(--color-text))",
                    borderColor: isActive ? "rgb(var(--color-primary))" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "rgba(var(--color-primary),0.08)"; e.currentTarget.style.borderColor = "rgba(var(--color-primary),0.2)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; } }}
                >
                  {num}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setPaginationState((old) => ({ ...old, pageIndex: old.pageIndex + 1 }))}
              disabled={!table.getCanNextPage()}
              style={{ ...t.navBtn, opacity: !table.getCanNextPage() ? 0.35 : 1, cursor: !table.getCanNextPage() ? "not-allowed" : "pointer" }}
              onMouseEnter={(e) => { if (table.getCanNextPage()) { e.currentTarget.style.borderColor = "rgb(var(--color-primary))"; e.currentTarget.style.color = "rgb(var(--color-primary))"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgb(var(--color-border))"; e.currentTarget.style.color = "rgb(var(--color-text))"; }}
            >
              Next <ChevronRight style={{ width: 12, height: 12 }} />
            </button>

            {/* Page size */}
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              style={t.pageSelect}
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>{size} / page</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}