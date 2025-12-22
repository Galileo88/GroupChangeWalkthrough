# How to Generate APP_OVERVIEW.pdf

The APP_OVERVIEW.md and APP_OVERVIEW.html files have been created. To generate the PDF, you have several options:

## Option 1: Using Chrome/Chromium Browser (Recommended)

1. Open `APP_OVERVIEW.html` in Chrome or Chromium
2. Press `Ctrl+P` (or `Cmd+P` on Mac) to open Print dialog
3. Select "Save as PDF" as the destination
4. Click "Save" and name it `APP_OVERVIEW.pdf`

## Option 2: Using wkhtmltopdf (Command Line)

If you have wkhtmltopdf installed:

```bash
wkhtmltopdf \
  --page-width 210mm \
  --page-height 297mm \
  --margin-top 20mm \
  --margin-bottom 20mm \
  --margin-left 15mm \
  --margin-right 15mm \
  APP_OVERVIEW.html \
  APP_OVERVIEW.pdf
```

To install wkhtmltopdf:
- **Ubuntu/Debian**: `sudo apt-get install wkhtmltopdf`
- **macOS**: `brew install wkhtmltopdf`
- **Windows**: Download from https://wkhtmltopdf.org/downloads.html

## Option 3: Using Pandoc

If you have pandoc installed:

```bash
pandoc APP_OVERVIEW.md -o APP_OVERVIEW.pdf \
  --pdf-engine=wkhtmltopdf \
  -V geometry:margin=1in
```

To install pandoc:
- **Ubuntu/Debian**: `sudo apt-get install pandoc`
- **macOS**: `brew install pandoc`
- **Windows**: Download from https://pandoc.org/installing.html

## Option 4: Using md-to-pdf (Node.js)

If you have Chrome installed on your system:

```bash
# First install Chrome/Chromium
# Then install Puppeteer browsers
npx puppeteer browsers install chrome

# Generate PDF
node generate-pdf.js
```

## Option 5: Online Converters

Upload `APP_OVERVIEW.html` or `APP_OVERVIEW.md` to online converters:
- https://www.markdowntopdf.com/
- https://html2pdf.com/
- https://www.sejda.com/html-to-pdf

## Files Available

- **APP_OVERVIEW.md** - Markdown source (editable)
- **APP_OVERVIEW.html** - Styled HTML version (print-ready)
- **APP_OVERVIEW.pdf** - Will be generated using one of the above methods
