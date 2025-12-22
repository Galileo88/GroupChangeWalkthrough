import { mdToPdf } from 'md-to-pdf';
import { readFileSync } from 'fs';

async function generatePdf() {
  try {
    console.log('Converting APP_OVERVIEW.md to PDF...');

    const pdf = await mdToPdf(
      { path: 'APP_OVERVIEW.md' },
      {
        dest: 'APP_OVERVIEW.pdf',
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
          },
          displayHeaderFooter: true,
          headerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center;"></div>',
          footerTemplate: '<div style="font-size: 9px; width: 100%; text-align: center; color: #666;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
          printBackground: true
        },
        stylesheet_encoding: 'utf-8',
        stylesheet: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          h1 {
            color: #1a1a1a;
            font-size: 2.2em;
            margin-top: 0.5em;
            margin-bottom: 0.5em;
            padding-bottom: 0.3em;
            border-bottom: 3px solid #3d5a66;
          }

          h2 {
            color: #3d5a66;
            font-size: 1.6em;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
            padding-bottom: 0.2em;
            border-bottom: 2px solid #00e5b4;
          }

          h3 {
            color: #527584;
            font-size: 1.3em;
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
            margin-bottom: 0.8em;
          }

          hr {
            border: none;
            border-top: 1px solid #e0e0e0;
            margin: 1.5em 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            font-size: 0.9em;
          }

          thead {
            background-color: #3d5a66;
            color: white;
          }

          th {
            padding: 10px 12px;
            text-align: left;
            font-weight: 600;
            font-size: 0.85em;
          }

          td {
            padding: 8px 12px;
            border-bottom: 1px solid #e0e0e0;
          }

          tbody tr:nth-child(even) {
            background-color: #f8f9fa;
          }

          strong, b {
            color: #3d5a66;
            font-weight: 600;
          }

          ul, ol {
            margin-left: 1.5em;
            margin-bottom: 0.8em;
          }

          li {
            margin-bottom: 0.4em;
          }

          code {
            background-color: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.85em;
            color: #e74c3c;
          }

          pre {
            background-color: #f8f9fa;
            padding: 12px;
            border-radius: 5px;
            border-left: 4px solid #00e5b4;
            overflow-x: auto;
            margin: 0.8em 0;
            font-size: 0.85em;
          }

          pre code {
            background-color: transparent;
            padding: 0;
            color: #333;
          }

          blockquote {
            border-left: 4px solid #00e5b4;
            padding-left: 1em;
            margin: 0.8em 0;
            color: #666;
            font-style: italic;
          }
        `
      }
    );

    if (pdf) {
      console.log('✅ PDF created successfully: APP_OVERVIEW.pdf');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
}

generatePdf();
