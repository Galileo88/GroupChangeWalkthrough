import { marked } from 'marked';
import fs from 'fs';

// Read the markdown file
const mdContent = fs.readFileSync('APP_OVERVIEW.md', 'utf8');

// Convert markdown to HTML
const htmlContent = marked.parse(mdContent);

// Create a complete HTML document with styling
const styledHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Group Change Walkthrough Application - Overview</title>
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
            border-bottom: 3px solid #3d5a66;
        }

        h2 {
            color: #3d5a66;
            font-size: 1.8em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            padding-bottom: 0.2em;
            border-bottom: 2px solid #00e5b4;
        }

        h3 {
            color: #527584;
            font-size: 1.4em;
            margin-top: 1.2em;
            margin-bottom: 0.5em;
        }

        h4 {
            color: #2a3f4a;
            font-size: 1.1em;
            margin-top: 1em;
            margin-bottom: 0.4em;
        }

        p {
            margin-bottom: 1em;
        }

        hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 2em 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        thead {
            background-color: #3d5a66;
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
            color: #3d5a66;
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
            color: #e74c3c;
        }

        pre {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #00e5b4;
            overflow-x: auto;
            margin: 1em 0;
        }

        pre code {
            background-color: transparent;
            padding: 0;
            color: #333;
        }

        blockquote {
            border-left: 4px solid #00e5b4;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
            font-style: italic;
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

            h1, h2, h3, h4 {
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

        /* Gainwell brand colors */
        .accent {
            color: #00e5b4;
        }

        .primary {
            color: #3d5a66;
        }
    </style>
</head>
<body>
${htmlContent}
</body>
</html>`;

// Write the HTML file
fs.writeFileSync('APP_OVERVIEW.html', styledHTML, 'utf8');

console.log('✅ HTML file created successfully: APP_OVERVIEW.html');
