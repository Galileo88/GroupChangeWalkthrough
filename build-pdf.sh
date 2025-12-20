#!/bin/bash
# Convert FLOW_MAPPING.md to HTML and PDF with preserved styling

echo "Converting Markdown to HTML..."
node convert.js

echo "Converting HTML to PDF..."
wkhtmltopdf \
  --page-width 210mm \
  --page-height 650mm \
  --margin-top 10mm \
  --margin-bottom 10mm \
  --margin-left 15mm \
  --margin-right 15mm \
  FLOW_MAPPING.html \
  FLOW_MAPPING.pdf

echo "✅ Conversion complete!"
echo "   HTML: FLOW_MAPPING.html"
echo "   PDF:  FLOW_MAPPING.pdf"
