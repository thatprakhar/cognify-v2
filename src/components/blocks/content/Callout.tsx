import React from 'react';
import { Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface CalloutProps {
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message: string;
}

export const Callout: React.FC<CalloutProps> = ({ type = 'info', title, message }) => {
    const config = {
        info: {
            icon: Info,
            classes: "bg-blue-50 text-blue-900 border-blue-200 ",
            iconClass: "text-blue-500"
        },
        warning: {
            icon: AlertCircle,
            classes: "bg-amber-50 text-amber-900 border-amber-200 ",
            iconClass: "text-amber-500"
        },
        success: {
            icon: CheckCircle,
            classes: "bg-emerald-50 text-emerald-900 border-emerald-200 ",
            iconClass: "text-emerald-500"
        },
        error: {
            icon: XCircle,
            classes: "bg-red-50 text-red-900 border-red-200 ",
            iconClass: "text-red-500"
        }
    };

    const safeType = (type && config[type as keyof typeof config]) ? (type as keyof typeof config) : 'info';
    const { icon: Icon, classes, iconClass } = config[safeType];

    return (
        <div className={`p-4 rounded-xl border flex gap-3 ${classes} my-4`}>
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
            <div>
                <h4 className="font-semibold text-sm mb-1">{title}</h4>
                <p className="text-sm opacity-90">{message}</p>
            </div>
        </div>
    );
};
