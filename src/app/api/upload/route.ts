import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { csvStore, ParsedData } from '@/lib/data/store';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const text = await file.text();

        // Parse CSV
        const parseResult = Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
        });

        if (parseResult.errors.length > 0) {
            console.warn("CSV Parse warnings:", parseResult.errors);
        }

        const rows = parseResult.data as any[];
        const columns = parseResult.meta.fields || [];
        const rowCount = rows.length;

        // Compute basic stats
        const stats: Record<string, any> = {};
        for (const col of columns) {
            let numCount = 0;
            let sum = 0;
            let min = Infinity;
            let max = -Infinity;

            for (const row of rows) {
                const val = row[col];
                if (typeof val === 'number') {
                    numCount++;
                    sum += val;
                    if (val < min) min = val;
                    if (val > max) max = val;
                }
            }

            if (numCount > 0) {
                stats[col] = {
                    type: 'numeric',
                    min: min,
                    max: max,
                    avg: sum / numCount,
                    validNumberCount: numCount
                };
            } else {
                // assume categorical/string
                let uniqueValues = new Set();
                for (let i = 0; i < rows.length; i++) {
                    uniqueValues.add(rows[i][col]);
                    if (uniqueValues.size > 20) break; // limit tracking
                }

                stats[col] = {
                    type: 'categorical',
                    uniqueValuesCount: uniqueValues.size > 20 ? '20+' : uniqueValues.size,
                    sampleValues: Array.from(uniqueValues).slice(0, 5)
                };
            }
        }

        // Create a summary string
        const summary = `File "${file.name}" uploaded successfully.
Rows: ${rowCount}
Columns: ${columns.join(', ')}

Column Details:
${Object.entries(stats).map(([col, s]) => {
            if (s.type === 'numeric') {
                return `- ${col} (Numeric): min=${s.min}, max=${s.max}, avg=${s.avg.toFixed(2)}`;
            } else {
                return `- ${col} (Categorical/String): ${s.uniqueValuesCount} unique values. Examples: ${s.sampleValues.join(', ')}`;
            }
        }).join('\n')}

First 3 rows of data:
${JSON.stringify(rows.slice(0, 3), null, 2)}
`;

        const id = crypto.randomUUID();

        const parsedData: ParsedData = {
            id,
            filename: file.name,
            columns,
            rowCount,
            summary,
            data: rows
        };

        // Store securely in memory
        csvStore.set(id, parsedData);

        return NextResponse.json({
            success: true,
            fileId: id,
            summary: summary,
            filename: file.name
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
