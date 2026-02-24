import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/ui/shadcn/alert';
import { Separator } from '@/ui/shadcn/separator';
import {
    Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from '@/ui/shadcn/table';
import { Info, AlertCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// --- CognifyCallout ---

interface CognifyCalloutProps {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
}

const calloutIconMap = {
    info: Info,
    warning: AlertCircle,
    success: CheckCircle,
    error: XCircle,
} as const;

const calloutVariantMap = {
    info: 'info' as const,
    warning: 'warning' as const,
    success: 'success' as const,
    error: 'destructive' as const,
};

export const CognifyCallout: React.FC<CognifyCalloutProps> = ({ type = 'info', title, message }) => {
    const safeType = (type && calloutIconMap[type]) ? type : 'info';
    const Icon = calloutIconMap[safeType];
    const variant = calloutVariantMap[safeType];

    return (
        <Alert variant={variant} className="my-4">
            <Icon className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
};

// --- CognifyDivider ---

interface CognifyDividerProps {
    style?: 'solid' | 'dashed' | 'dotted';
}

export const CognifyDivider: React.FC<CognifyDividerProps> = ({ style = 'solid' }) => {
    const styleClass = style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : '';
    return (
        <div className={`my-8 ${styleClass}`}>
            <Separator />
        </div>
    );
};

// --- CognifyTable ---

interface CognifyTableProps {
    headers: string[];
    rows: (string | number)[][];
    caption?: string;
    isMockData?: boolean;
}

export const CognifyTable: React.FC<CognifyTableProps> = ({ headers = [], rows = [], caption, isMockData }) => (
    <div className="my-4 relative">
        {isMockData && (
            <div className="absolute -top-2 right-2 z-10 bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Mock Data
            </div>
        )}
        <div className="rounded-xl border border-border overflow-hidden">
            <Table>
                {caption && <caption className="text-xs text-zinc-500 mt-2">{caption}</caption>}
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        {headers.map((header, idx) => (
                            <TableHead key={idx} className="font-medium">{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {row.map((cell, colIdx) => (
                                <TableCell key={colIdx}>{cell}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);

// --- ErrorCallout ---
// Deterministic fallback for unknown component types.

interface ErrorCalloutProps {
    type: string;
    message?: string;
}

export const ErrorCallout: React.FC<ErrorCalloutProps> = ({ type, message }) => (
    <Alert variant="destructive" className="my-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Unknown Component: {type}</AlertTitle>
        <AlertDescription>
            {message || `The component type "${type}" is not in the allowlist and cannot be rendered.`}
        </AlertDescription>
    </Alert>
);
