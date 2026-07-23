import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Search } from "lucide-react";


export default function DataTable({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search records...",
  actions,
  pageSize = 8,
}) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Filter search
  const filteredData = query.trim()
    ? data.filter((item) => {
        if (searchKey) {
          const val = item[searchKey];
          return val?.toString().toLowerCase().includes(query.toLowerCase());
        }
        return Object.values(item).some((val) =>
          val?.toString().toLowerCase().includes(query.toLowerCase())
        );
      })
    : data;

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal === bVal) return 0;
    if (aVal === null || aVal === undefined) return 1;
    if (bVal === null || bVal === undefined) return -1;

    const result = aVal < bVal ? -1 : 1;
    return sortConfig.direction === "asc" ? result : -result;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
          />
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Table Surface */}
      <div className="liquid-glass border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-muted-foreground font-semibold uppercase text-[11px] tracking-wider">
                {columns.map((col) => (
                  <th
                    key={col.key || col.header}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`py-3.5 px-4 ${
                      col.sortable ? "cursor-pointer hover:text-foreground select-none" : ""
                    } ${col.align === "right" ? "text-right" : ""}`}
                  >
                    <div
                      className={`flex items-center gap-1 ${
                        col.align === "right" ? "justify-end" : ""
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && sortConfig.key === col.key && (
                        <span>
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-12 text-center text-muted-foreground text-xs"
                  >
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr
                    key={row.id || row.uid || idx}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key || col.header}
                        className={`py-3.5 px-4 ${
                          col.align === "right" ? "text-right" : ""
                        }`}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
              {sortedData.length} records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/5"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
