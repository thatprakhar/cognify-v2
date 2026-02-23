import React from 'react';

interface TableProps {
 headers: string[];
 rows: (string | number)[][];
}

export const Table: React.FC<TableProps> = ({ headers = [], rows = [] }) => {
 return (
 <div className="w-full overflow-x-auto border border-zinc-200 rounded-xl">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-zinc-50 border-b border-zinc-200 ">
 {headers.map((header, idx) => (
 <th
 key={idx}
 className="px-4 py-3 text-sm font-medium text-zinc-600 whitespace-nowrap"
 >
 {header}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="divide-y divide-zinc-200 ">
 {rows.map((row, rowIdx) => (
 <tr key={rowIdx} className="hover:bg-zinc-50/50 transition-colors">
 {row.map((cell, colIdx) => (
 <td
 key={colIdx}
 className="px-4 py-3 text-sm text-zinc-800 "
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
