import React from 'react';

interface TableProps {
    headers: string[];
    rows: (string | number)[][];
}

export const Table: React.FC<TableProps> = ({ headers, rows }) => {
    return (
        <div className="w-full overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className="px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 whitespace-nowrap"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors">
                            {row.map((cell, colIdx) => (
                                <td
                                    key={colIdx}
                                    className="px-4 py-3 text-sm text-zinc-800 dark:text-zinc-300"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
