'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

interface FileUploadProps {
 acceptedTypes: string[];
 maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ acceptedTypes = [], maxSizeMB = 5 }) => {
 const [dragActive, setDragActive] = useState(false);
 const [uploadedFile, setUploadedFile] = useState<string | null>(null);

 const handleDrag = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (e.type === "dragenter" || e.type === "dragover") {
 setDragActive(true);
 } else if (e.type === "dragleave") {
 setDragActive(false);
 }
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 e.stopPropagation();
 setDragActive(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 setUploadedFile(e.dataTransfer.files[0].name);
 }
 };

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 e.preventDefault();
 if (e.target.files && e.target.files[0]) {
 setUploadedFile(e.target.files[0].name);
 }
 };

 if (uploadedFile) {
 return (
 <div className="p-6 border border-emerald-200 bg-emerald-50 rounded-2xl flex items-center gap-4">
 <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
 <div>
 <h4 className="font-medium text-emerald-900 ">Upload Complete</h4>
 <p className="text-sm text-emerald-700 ">{uploadedFile}</p>
 </div>
 </div>
 );
 }

 return (
 <div
 className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-colors cursor-pointer
 ${dragActive ? 'border-blue-500 bg-blue-50 ' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100 '}`}
 onDragEnter={handleDrag}
 onDragLeave={handleDrag}
 onDragOver={handleDrag}
 onDrop={handleDrop}
 onClick={() => document.getElementById('file-upload')?.click()}
 >
 <input
 id="file-upload"
 type="file"
 className="hidden"
 accept={acceptedTypes.join(',')}
 onChange={handleChange}
 />
 <UploadCloud className="w-10 h-10 text-zinc-400 mb-4" />
 <p className="text-lg font-medium text-zinc-900 mb-1">
 Drag and drop your file here
 </p>
 <p className="text-sm text-zinc-500 ">
 Supports {acceptedTypes.join(', ')} up to {maxSizeMB}MB
 </p>
 </div>
 );
};
