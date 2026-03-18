"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useI18n } from "@/i18n/context";

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

interface TableIndexEntry {
  name: string;
  row_count: number;
  column_count: number;
  type: "dimension" | "fact";
}

interface ColumnDef {
  name: string;
  type: string;
}

interface TableData {
  table_name: string;
  row_count: number;
  sample_size: number;
  columns: ColumnDef[];
  rows: Record<string, unknown>[];
}

/* ────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────── */

const TYPE_COLORS: Record<string, string> = {
  DATE: "#2979ff",
  VARCHAR: "#00c853",
  DOUBLE: "#ff9100",
  BIGINT: "#e040fb",
  INTEGER: "#00e5ff",
  BOOLEAN: "#ffc107",
  TIMESTAMP: "#2979ff",
};

function typeBadgeColor(type: string): string {
  return TYPE_COLORS[type.toUpperCase()] ?? "#8b8fa3";
}

function isNumericType(type: string): boolean {
  const t = type.toUpperCase();
  return ["DOUBLE", "FLOAT", "INTEGER", "INT", "BIGINT", "DECIMAL", "NUMERIC"].includes(t);
}

function formatCellValue(value: unknown, colType: string): string {
  if (value == null) return "—";
  if (isNumericType(colType)) {
    const num = Number(value);
    if (isNaN(num)) return String(value);
    if (colType.toUpperCase() === "BIGINT" || colType.toUpperCase() === "INTEGER") {
      return num.toLocaleString();
    }
    // For doubles, show up to 4 decimal places
    if (Math.abs(num) >= 1000) return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    if (Math.abs(num) < 0.01) return num.toFixed(6);
    return num.toFixed(4);
  }
  return String(value);
}

/* ────────────────────────────────────────────────
   Loading Skeleton
   ──────────────────────────────────────────────── */

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-8 bg-[#1e2235] rounded w-1/3" />
      <div className="h-6 bg-[#1e2235] rounded w-1/4" />
      <div className="space-y-2 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 bg-[#1e2235] rounded" />
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────── */

export default function DataExplorer() {
  const { t } = useI18n();

  // State
  const [tableIndex, setTableIndex] = useState<TableIndexEntry[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableDataCache, setTableDataCache] = useState<Record<string, TableData>>({});
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [loadingTable, setLoadingTable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Fetch table index
  useEffect(() => {
    setLoadingIndex(true);
    fetch("/data/tables/index.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load table index");
        return res.json();
      })
      .then((json) => {
        const tables: TableIndexEntry[] = json.tables ?? [];
        setTableIndex(tables);
        // Auto-select first table with data
        const firstWithData = tables.find((t) => t.row_count > 0);
        if (firstWithData) setSelectedTable(firstWithData.name);
      })
      .catch(() => setError("Could not load table index"))
      .finally(() => setLoadingIndex(false));
  }, []);

  // Fetch table data when selection changes
  const fetchTableData = useCallback(
    async (tableName: string) => {
      if (tableDataCache[tableName]) return;
      setLoadingTable(true);
      setError(null);
      try {
        const res = await fetch(`/data/tables/${tableName}.json`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load table data");
        const json: TableData = await res.json();
        setTableDataCache((prev) => ({ ...prev, [tableName]: json }));
      } catch {
        setError(`Could not load data for ${tableName}`);
      } finally {
        setLoadingTable(false);
      }
    },
    [tableDataCache]
  );

  useEffect(() => {
    if (selectedTable) {
      // Reset filters on table switch
      setGlobalFilter("");
      setColumnFilters([]);
      setSorting([]);
      fetchTableData(selectedTable);
    }
  }, [selectedTable, fetchTableData]);

  // Group tables
  const dimensions = useMemo(
    () => tableIndex.filter((t) => t.type === "dimension"),
    [tableIndex]
  );
  const facts = useMemo(
    () => tableIndex.filter((t) => t.type === "fact"),
    [tableIndex]
  );

  // Current table data
  const currentData = selectedTable ? tableDataCache[selectedTable] : null;

  // TanStack Table setup
  const columnHelper = createColumnHelper<Record<string, unknown>>();

  const columns = useMemo(() => {
    if (!currentData) return [];
    return currentData.columns.map((col) =>
      columnHelper.accessor((row) => row[col.name], {
        id: col.name,
        header: col.name,
        cell: (info) => formatCellValue(info.getValue(), col.type),
        meta: { type: col.type },
        filterFn: "includesString",
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  const tableData = useMemo(() => currentData?.rows ?? [], [currentData]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  // Table list sidebar item
  const renderTableItem = (entry: TableIndexEntry) => {
    const isActive = selectedTable === entry.name;
    const isEmpty = entry.row_count === 0;
    const dotColor = entry.type === "dimension" ? "#00c853" : "#2979ff";

    return (
      <button
        key={entry.name}
        onClick={() => {
          if (!isEmpty) {
            setSelectedTable(entry.name);
            setMobileDropdownOpen(false);
          }
        }}
        disabled={isEmpty}
        className={`
          w-full text-left px-3 py-2 rounded-md text-xs transition-all duration-150 flex items-center gap-2
          ${isActive ? "bg-[#2979ff]/15 text-white border border-[#2979ff]/30" : ""}
          ${!isActive && !isEmpty ? "text-[#8b8fa3] hover:text-[#b0b4c8] hover:bg-[#1e2235]" : ""}
          ${isEmpty ? "text-[#3a3e52] cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: isEmpty ? "#3a3e52" : dotColor }}
        />
        <span className="truncate flex-1 font-mono">{entry.name}</span>
        <span className={`text-[10px] font-mono flex-shrink-0 ${isEmpty ? "text-[#3a3e52]" : "text-[#5a5e72]"}`}>
          {entry.row_count.toLocaleString()}
        </span>
      </button>
    );
  };

  // Sort indicator
  const SortIcon = ({ direction }: { direction: false | "asc" | "desc" }) => (
    <span className="ml-1 inline-flex flex-col text-[8px] leading-none">
      <span className={direction === "asc" ? "text-[#2979ff]" : "text-[#3a3e52]"}>&#9650;</span>
      <span className={direction === "desc" ? "text-[#2979ff]" : "text-[#3a3e52]"}>&#9660;</span>
    </span>
  );

  const selectedEntry = tableIndex.find((t) => t.name === selectedTable);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* ── Mobile: Dropdown ── */}
        <div className="md:hidden border-b border-border p-3">
          <button
            onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-[#1e2235] rounded-md text-sm text-foreground"
          >
            <span className="font-mono">
              {selectedTable ?? t("dataExplorer.selectTable")}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {mobileDropdownOpen && (
            <div className="mt-2 max-h-60 overflow-y-auto space-y-0.5">
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#5a5e72] font-semibold">
                {t("dataExplorer.dimensions")}
              </div>
              {dimensions.map(renderTableItem)}
              <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#5a5e72] font-semibold mt-2">
                {t("dataExplorer.facts")}
              </div>
              {facts.map(renderTableItem)}
            </div>
          )}
        </div>

        {/* ── Desktop: Sidebar ── */}
        <div className="hidden md:block w-[220px] border-r border-border bg-[#0f1119] flex-shrink-0 overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h3 className="text-xs font-semibold text-foreground tracking-wide">
              {t("dataExplorer.title")}
            </h3>
            <p className="text-[10px] text-[#5a5e72] mt-0.5">
              {tableIndex.length} {t("dataExplorer.tables")}
            </p>
          </div>

          <div className="p-2 space-y-0.5">
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#5a5e72] font-semibold">
              {t("dataExplorer.dimensions")}
            </div>
            {dimensions.map(renderTableItem)}

            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-[#5a5e72] font-semibold mt-3">
              {t("dataExplorer.facts")}
            </div>
            {facts.map(renderTableItem)}
          </div>
        </div>

        {/* ── Data Table View ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {loadingIndex && (
            <div className="p-6">
              <TableSkeleton />
            </div>
          )}

          {!loadingIndex && !selectedTable && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-4xl mb-3 opacity-20">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-[#5a5e72]">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" />
                    <line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                    <line x1="15" y1="3" x2="15" y2="21" />
                  </svg>
                </div>
                <p className="text-sm text-[#5a5e72]">{t("dataExplorer.selectTable")}</p>
              </div>
            </div>
          )}

          {selectedTable && (
            <>
              {/* Header */}
              <div className="p-4 border-b border-border bg-[#0f1119]/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: selectedEntry?.type === "dimension" ? "#00c853" : "#2979ff",
                        }}
                      />
                      <h3 className="text-sm font-semibold font-mono text-foreground">
                        {selectedTable}
                      </h3>
                      {selectedEntry && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2235] text-[#5a5e72] font-mono">
                          {selectedEntry.type === "dimension" ? "DIM" : "FACT"}
                        </span>
                      )}
                    </div>
                    {currentData && (
                      <p className="text-[11px] text-[#5a5e72] mt-1 font-mono">
                        {currentData.row_count.toLocaleString()} {t("dataExplorer.rows")}
                        {currentData.sample_size < currentData.row_count && (
                          <span className="text-[#2979ff]">
                            {" "}
                            ({t("dataExplorer.showing")
                              .replace("{count}", currentData.sample_size.toLocaleString())
                              .replace("{total}", currentData.row_count.toLocaleString())})
                          </span>
                        )}
                        <span className="mx-2 text-[#3a3e52]">|</span>
                        {currentData.columns.length} cols
                      </p>
                    )}
                  </div>

                  {/* Global filter */}
                  {currentData && currentData.rows.length > 0 && (
                    <div className="relative">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#5a5e72]"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={t("dataExplorer.filter")}
                        className="pl-8 pr-3 py-1.5 bg-[#1e2235] border border-border rounded-md text-xs text-foreground placeholder-[#5a5e72] focus:outline-none focus:border-[#2979ff]/50 w-full sm:w-56 font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Column type badges */}
                {currentData && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {currentData.columns.map((col) => (
                      <span
                        key={col.name}
                        className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#1e2235] font-mono"
                      >
                        <span className="text-[#8b8fa3]">{col.name}</span>
                        <span style={{ color: typeBadgeColor(col.type) }}>{col.type}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Table Content */}
              <div className="flex-1 overflow-auto">
                {loadingTable && (
                  <div className="p-6">
                    <TableSkeleton />
                  </div>
                )}

                {error && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-[#ff1744]">{error}</p>
                  </div>
                )}

                {!loadingTable && !error && currentData && currentData.rows.length === 0 && (
                  <div className="flex-1 flex items-center justify-center p-12">
                    <div className="text-center">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-[#3a3e52] mb-3">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                        <polyline points="13 2 13 9 20 9" />
                      </svg>
                      <p className="text-sm text-[#5a5e72]">{t("dataExplorer.noData")}</p>
                    </div>
                  </div>
                )}

                {!loadingTable && !error && currentData && currentData.rows.length > 0 && (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          {table.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                              {/* Header row */}
                              <tr className="border-b border-border bg-[#0f1119]">
                                {headerGroup.headers.map((header) => {
                                  const colType = (header.column.columnDef.meta as { type: string } | undefined)?.type ?? "";
                                  return (
                                    <th
                                      key={header.id}
                                      onClick={header.column.getToggleSortingHandler()}
                                      className={`
                                        px-3 py-2.5 font-medium cursor-pointer select-none whitespace-nowrap
                                        text-[#8b8fa3] hover:text-foreground transition-colors
                                        border-r border-border last:border-r-0
                                        ${isNumericType(colType) ? "text-right" : "text-left"}
                                      `}
                                      style={{ minWidth: "80px" }}
                                    >
                                      <div className={`flex items-center gap-1 ${isNumericType(colType) ? "justify-end" : ""}`}>
                                        <span className="font-mono">
                                          {flexRender(header.column.columnDef.header, header.getContext())}
                                        </span>
                                        <SortIcon direction={header.column.getIsSorted()} />
                                      </div>
                                    </th>
                                  );
                                })}
                              </tr>
                              {/* Column filter row */}
                              <tr className="border-b border-border bg-[#0d0f17]">
                                {headerGroup.headers.map((header) => (
                                  <th key={`filter-${header.id}`} className="px-2 py-1 border-r border-border last:border-r-0">
                                    <input
                                      type="text"
                                      value={(header.column.getFilterValue() as string) ?? ""}
                                      onChange={(e) => header.column.setFilterValue(e.target.value)}
                                      className="w-full px-1.5 py-0.5 bg-[#1e2235] border border-transparent rounded text-[10px] text-foreground placeholder-[#3a3e52] focus:outline-none focus:border-[#2979ff]/30 font-mono"
                                      placeholder="..."
                                    />
                                  </th>
                                ))}
                              </tr>
                            </React.Fragment>
                          ))}
                        </thead>
                        <tbody>
                          {table.getRowModel().rows.map((row, rowIdx) => (
                            <tr
                              key={row.id}
                              className={`
                                border-b border-border/50 transition-colors hover:bg-[#1e2235]/60
                                ${rowIdx % 2 === 0 ? "bg-transparent" : "bg-[#0f1119]/30"}
                              `}
                            >
                              {row.getVisibleCells().map((cell) => {
                                const colType = (cell.column.columnDef.meta as { type: string } | undefined)?.type ?? "";
                                return (
                                  <td
                                    key={cell.id}
                                    className={`
                                      px-3 py-2 font-mono whitespace-nowrap border-r border-border/30 last:border-r-0
                                      ${isNumericType(colType) ? "text-right text-[#e8eaed]" : "text-left text-[#b0b4c8]"}
                                    `}
                                  >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-border bg-[#0f1119]/50 gap-2">
                      <p className="text-[10px] text-[#5a5e72] font-mono">
                        {t("dataExplorer.showing")
                          .replace("{count}", String(table.getFilteredRowModel().rows.length))
                          .replace("{total}", String(tableData.length))}{" "}
                        {t("dataExplorer.rows")}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => table.setPageIndex(0)}
                          disabled={!table.getCanPreviousPage()}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &laquo;
                        </button>
                        <button
                          onClick={() => table.previousPage()}
                          disabled={!table.getCanPreviousPage()}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &lsaquo;
                        </button>

                        {/* Page numbers */}
                        {(() => {
                          const pageCount = table.getPageCount();
                          const currentPage = table.getState().pagination.pageIndex;
                          const pages: number[] = [];
                          const maxVisible = 5;

                          let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
                          const end = Math.min(pageCount, start + maxVisible);
                          if (end - start < maxVisible) start = Math.max(0, end - maxVisible);

                          for (let i = start; i < end; i++) pages.push(i);

                          return pages.map((page) => (
                            <button
                              key={page}
                              onClick={() => table.setPageIndex(page)}
                              className={`
                                px-2 py-1 rounded text-[11px] font-mono transition-colors
                                ${
                                  page === currentPage
                                    ? "bg-[#2979ff] text-white"
                                    : "bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8]"
                                }
                              `}
                            >
                              {page + 1}
                            </button>
                          ));
                        })()}

                        <button
                          onClick={() => table.nextPage()}
                          disabled={!table.getCanNextPage()}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &rsaquo;
                        </button>
                        <button
                          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                          disabled={!table.getCanNextPage()}
                          className="px-2 py-1 rounded text-[11px] font-mono bg-[#1e2235] text-[#8b8fa3] hover:bg-[#262a40] hover:text-[#b0b4c8] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          &raquo;
                        </button>

                        <span className="text-[10px] text-[#5a5e72] font-mono ml-2">
                          {t("dataExplorer.page")} {table.getState().pagination.pageIndex + 1} {t("dataExplorer.of")} {table.getPageCount()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
