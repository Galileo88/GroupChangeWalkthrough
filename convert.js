// ============================================================
// IMPORTS
// ============================================================

import { marked } from 'marked';
import fs from 'fs';
import path from 'path';

// ============================================================
// MARKDOWN TO HTML CONVERSION
// ============================================================

// Read the markdown file
const mdContent = fs.readFileSync('FLOW_MAPPING.md', 'utf8');

// Convert markdown to HTML
const htmlContent = marked.parse(mdContent);

// ============================================================
// HTML TEMPLATE WITH STYLING
// ============================================================

// Create a complete HTML document with styling
const styledHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Flow Mapping</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            color: #1a1a1a;
            font-size: 2.5em;
            margin-bottom: 0.5em;
            padding-bottom: 0.3em;
            border-bottom: 3px solid #0066cc;
        }

        h2 {
            color: #2c3e50;
            font-size: 1.8em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            padding-bottom: 0.2em;
            border-bottom: 2px solid #3498db;
        }

        h3 {
            color: #34495e;
            font-size: 1.4em;
            margin-top: 1.2em;
            margin-bottom: 0.5em;
        }

        p {
            margin-bottom: 1em;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        thead {
            background-color: #0066cc;
            color: white;
        }

        th {
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 0.95em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        td {
            padding: 12px 15px;
            border-bottom: 1px solid #e0e0e0;
        }

        tbody tr:hover {
            background-color: #f5f9fc;
        }

        tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        tbody tr:nth-child(even):hover {
            background-color: #f0f4f8;
        }

        strong, b {
            color: #0066cc;
            font-weight: 600;
        }

        ul, ol {
            margin-left: 2em;
            margin-bottom: 1em;
        }

        li {
            margin-bottom: 0.5em;
        }

        code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        /* Print-specific styles */
        @media print {
            body {
                padding: 20px;
            }

            * {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            h1, h2, h3 {
                page-break-before: avoid !important;
                page-break-after: avoid !important;
                break-before: avoid !important;
                break-after: avoid !important;
            }

            table {
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
                page-break-after: avoid !important;
                break-before: avoid !important;
                break-inside: avoid !important;
                break-after: avoid !important;
            }

            tr, td, th {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        }

        /* Checkmarks for validation section */
        .validation-list {
            list-style: none;
            margin-left: 0;
        }

        .validation-list li::before {
            content: "✅ ";
            margin-right: 0.5em;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

// ============================================================
// FILE OUTPUT
// ============================================================

// Write the HTML file
fs.writeFileSync('FLOW_MAPPING.html', styledHTML, 'utf8');
