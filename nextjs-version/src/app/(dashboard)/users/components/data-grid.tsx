"use client"

import React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface Column<T> {
    id: string
    label: string
    width: string
    icon?: React.ReactNode
    accessor: (item: T) => React.ReactNode
}

interface DataGridProps<T> {
    columns: Column<T>[]
    data: T[]
    onRowClick?: (item: T) => void
    getRowId: (item: T) => string | number
    selectedIds?: Set<string | number>
    onSelectionChange?: (selectedIds: Set<string | number>) => void
}

export function DataGrid<T>({
    columns,
    data,
    onRowClick,
    getRowId,
    selectedIds = new Set(),
    onSelectionChange,
}: DataGridProps<T>) {
    const gridTemplateColumns = [
        '40px', // checkbox column
        ...columns.map(col => col.width),
        '1fr', // empty space at end
    ].join(' ')

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allIds = new Set(data.map(item => getRowId(item)))
            onSelectionChange?.(allIds)
        } else {
            onSelectionChange?.(new Set())
        }
    }

    const handleSelectRow = (id: string | number, checked: boolean) => {
        const newSelected = new Set(selectedIds)
        if (checked) {
            newSelected.add(id)
        } else {
            newSelected.delete(id)
        }
        onSelectionChange?.(newSelected)
    }

    const allSelected = data.length > 0 && data.every(item => selectedIds.has(getRowId(item)))
    const someSelected = data.some(item => selectedIds.has(getRowId(item))) && !allSelected

    return (
        <div className="w-full">
            <div
                className="grid-container"
                style={
                    {
                        display: 'grid',
                        gridTemplateColumns,
                        '--grid-border-color': 'oklch(0.93 0 0)',
                    } as React.CSSProperties
                }
            >
                {/* Header Row */}
                <div className="grid-header-cell border-b" style={{ borderColor: 'var(--grid-border-color)' }}>
                    <Checkbox
                        checked={allSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                        {...(someSelected && { 'data-state': 'indeterminate' } as any)}
                    />
                </div>

                {columns.map(column => (
                    <div
                        key={column.id}
                        className="grid-header-cell border-b flex items-center gap-2 px-3 py-2"
                        style={{ borderColor: 'var(--grid-border-color)' }}
                    >
                        {column.icon && <span className="text-muted-foreground">{column.icon}</span>}
                        <span className="font-semibold text-sm">{column.label}</span>
                    </div>
                ))}

                <div className="grid-header-cell border-b" style={{ borderColor: 'var(--grid-border-color)' }}></div>

                {/* Data Rows */}
                {data.map(item => {
                    const rowId = getRowId(item)
                    const isSelected = selectedIds.has(rowId)

                    return (
                        <React.Fragment key={rowId}>
                            <div
                                className={cn(
                                    "grid-cell border-b flex items-center justify-center",
                                    onRowClick && "cursor-pointer"
                                )}
                                style={{ borderColor: 'var(--grid-border-color)' }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                            >
                                <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => handleSelectRow(rowId, !!checked)}
                                    aria-label={`Select row ${rowId}`}
                                />
                            </div>

                            {columns.map((column, colIndex) => (
                                <div
                                    key={column.id}
                                    className={cn(
                                        "grid-cell border-b px-3 py-2",
                                        onRowClick && "cursor-pointer hover:bg-accent/50 transition-colors"
                                    )}
                                    style={{ borderColor: 'var(--grid-border-color)' }}
                                    onClick={() => onRowClick?.(item)}
                                >
                                    {column.accessor(item)}
                                </div>
                            ))}

                            <div
                                className={cn(
                                    "grid-cell border-b",
                                    onRowClick && "cursor-pointer hover:bg-accent/50 transition-colors"
                                )}
                                style={{ borderColor: 'var(--grid-border-color)' }}
                                onClick={() => onRowClick?.(item)}
                            ></div>
                        </React.Fragment>
                    )
                })}
            </div>

            <style jsx>{`
        .grid-header-cell {
          background: oklch(1 0 0);
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
        }

        .grid-cell {
          background: oklch(1 0 0);
          font-size: 13px;
          min-height: 48px;
          display: flex;
          align-items: center;
        }
      `}</style>
        </div>
    )
}
