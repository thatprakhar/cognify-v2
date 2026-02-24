'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/card';
import { RadioGroup, RadioGroupItem } from '@/ui/shadcn/radio-group';
import { Label } from '@/ui/shadcn/label';
import { Input } from '@/ui/shadcn/input';
import {
    Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from '@/ui/shadcn/select';
import { UploadCloud, CheckCircle2, Check } from 'lucide-react';
import { useExperienceContext } from '@/components/experience/ExperienceContext';

// --- CognifyQuiz ---

interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

interface CognifyQuizProps {
    questions: QuizQuestion[];
}

export const CognifyQuiz: React.FC<CognifyQuizProps> = ({ questions = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState<string | undefined>(undefined);
    const [answered, setAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const question = questions[currentIndex];
    if (!question) return null;

    const handleAnswer = () => {
        if (selected === undefined) return;
        const selectedIdx = parseInt(selected);
        setAnswered(true);
        if (selectedIdx === question.correct) {
            setScore(s => s + 1);
        }
        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(c => c + 1);
                setSelected(undefined);
                setAnswered(false);
            } else {
                setShowResult(true);
            }
        }, 1500);
    };

    if (showResult) {
        return (
            <Card className="text-center">
                <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                    <p className="text-muted-foreground">
                        You scored {score} out of {questions.length}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center text-sm text-muted-foreground font-medium">
                    <span>Question {currentIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <RadioGroup value={selected} onValueChange={setSelected} disabled={answered}>
                    {question.options?.map((opt, idx) => {
                        let extraClass = '';
                        if (answered) {
                            if (idx === question.correct) extraClass = 'border-emerald-500 bg-emerald-50';
                            else if (String(idx) === selected) extraClass = 'border-red-500 bg-red-50';
                            else extraClass = 'opacity-50';
                        }
                        return (
                            <div
                                key={idx}
                                className={`flex items-center space-x-3 p-4 rounded-xl border transition-all ${extraClass}`}
                            >
                                <RadioGroupItem value={String(idx)} id={`q-${currentIndex}-opt-${idx}`} />
                                <Label htmlFor={`q-${currentIndex}-opt-${idx}`} className="flex-1 cursor-pointer">
                                    {opt}
                                </Label>
                            </div>
                        );
                    })}
                </RadioGroup>
                {!answered && (
                    <Button onClick={handleAnswer} disabled={selected === undefined} className="w-full">
                        Submit Answer
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

// --- CognifyForm ---

interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'number' | 'select' | 'textarea';
    options?: string[];
    required?: boolean;
}

interface CognifyFormProps {
    fields: FormField[];
    submitLabel: string;
}

export const CognifyForm: React.FC<CognifyFormProps> = ({ fields = [], submitLabel }) => {
    const [submitted, setSubmitted] = useState(false);
    const { submitClarification } = useExperienceContext();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Extract form data
        const formData = new FormData(e.currentTarget);
        const data: Record<string, string> = {};
        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        submitClarification(data);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <Card className="text-center bg-emerald-50 border-emerald-200">
                <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-emerald-800 mb-2">Success!</h3>
                    <p className="text-emerald-600">Your form was submitted successfully.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {fields.map((field, idx) => (
                        <div key={idx} className="flex flex-col gap-1.5">
                            <Label htmlFor={field.name}>
                                {field.label} {field.required && <span className="text-destructive">*</span>}
                            </Label>
                            {field.type === 'select' ? (
                                <Select required={field.required} name={field.name}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options?.map((opt, i) => (
                                            <SelectItem key={i} value={opt || `option-${i}`}>{opt || '—'}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    id={field.name}
                                    name={field.name}
                                    required={field.required}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            ) : (
                                <Input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    required={field.required}
                                />
                            )}
                        </div>
                    ))}
                    <Button type="submit" className="w-full mt-4">
                        {submitLabel}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// --- CognifyFileUpload ---

interface CognifyFileUploadProps {
    acceptedTypes: string[];
    maxSizeMB?: number;
}

export const CognifyFileUpload: React.FC<CognifyFileUploadProps> = ({ acceptedTypes = [], maxSizeMB = 5 }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setUploadedFile(e.dataTransfer.files[0].name);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setUploadedFile(e.target.files[0].name);
    };

    if (uploadedFile) {
        return (
            <Card className="border-emerald-200 bg-emerald-50">
                <CardContent className="p-6 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div>
                        <h4 className="font-medium text-emerald-900">Upload Complete</h4>
                        <p className="text-sm text-emerald-700">{uploadedFile}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div
            className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-border bg-muted/30 hover:bg-muted/50'
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('cognify-file-upload')?.click()}
        >
            <input
                id="cognify-file-upload"
                type="file"
                className="hidden"
                accept={acceptedTypes.join(',')}
                onChange={handleChange}
            />
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-foreground mb-1">Drag and drop your file here</p>
            <p className="text-sm text-muted-foreground">
                Supports {acceptedTypes.join(', ')} up to {maxSizeMB}MB
            </p>
        </div>
    );
};

// --- CognifySlider ---

interface CognifySliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    defaultValue?: number;
}

export const CognifySlider: React.FC<CognifySliderProps> = ({ label = '', min = 0, max = 100, step = 1, defaultValue }) => {
    const [value, setValue] = useState(defaultValue ?? min);

    return (
        <div className="w-full py-4">
            <div className="flex justify-between items-center mb-2">
                <Label>{label}</Label>
                <span className="text-sm font-bold text-blue-600">{value}</span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{min}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

// --- CognifyProgressTracker ---

interface CognifyProgressTrackerProps {
    steps: string[];
    currentStep: number;
}

export const CognifyProgressTracker: React.FC<CognifyProgressTrackerProps> = ({ steps = [], currentStep = 0 }) => (
    <div className="w-full my-6">
        <div className="flex items-center justify-between relative">
            {/* Background track */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0" />
            {/* Progress track */}
            <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 z-0 transition-all duration-500 ease-in-out"
                style={{ width: `${(Math.min(currentStep, steps.length - 1) / Math.max(1, steps.length - 1)) * 100}%` }}
            />
            {steps.map((stepLabel, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;
                let circleClass = 'bg-background border-border text-muted-foreground';
                if (isCompleted) circleClass = 'bg-blue-600 border-blue-600 text-white';
                else if (isCurrent) circleClass = 'bg-background border-blue-600 text-blue-600 ring-4 ring-blue-100';

                return (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm transition-colors duration-300 ${circleClass}`}>
                            {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-xs font-medium absolute top-10 whitespace-nowrap ${isCurrent ? 'text-blue-600' : 'text-muted-foreground'}`}>
                            {stepLabel}
                        </span>
                    </div>
                );
            })}
        </div>
    </div>
);
