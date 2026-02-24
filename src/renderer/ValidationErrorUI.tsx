import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/ui/shadcn/alert';
import { AlertTriangle } from 'lucide-react';

/**
 * Deterministic error UI shown when UISpec validation fails.
 * Always renders the same output for the same error list.
 */

interface ValidationErrorUIProps {
    errors: string[];
}

export const ValidationErrorUI: React.FC<ValidationErrorUIProps> = ({ errors }) => (
    <div className="w-full max-w-2xl mx-auto p-8">
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>UISpec Validation Failed</AlertTitle>
            <AlertDescription>
                <p className="mb-3">
                    The generated UI specification contains {errors.length} error{errors.length > 1 ? 's' : ''} and cannot be rendered safely.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.slice(0, 20).map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                    {errors.length > 20 && (
                        <li className="text-muted-foreground">...and {errors.length - 20} more errors</li>
                    )}
                </ul>
            </AlertDescription>
        </Alert>
    </div>
);
