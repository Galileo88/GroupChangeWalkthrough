# PDF Resources

This directory contains PDF files that are bundled with the application for distribution.

## Files

- `2025LegalQuickGuide.pdf` - Legal quick reference guide
- `FLOW_MAPPING.pdf` - Practitioner enrollment flow diagram
- `PractitionerTypesSpecialties.pdf` - Practitioner types and specialties reference

## How It Works

### Development Mode
In dev mode, PDFs are accessed directly from this `resources/` folder.

### Production Builds
When building the application for distribution, these PDFs are automatically included in the application bundle via the `bundle.resources` configuration in `tauri.conf.json`.

## Adding New PDFs

1. Place the PDF file in this directory
2. Reference it in the HTML with a relative path: `'./filename.pdf'`
3. The build process will automatically bundle it with the application

## Important Notes

- PDFs in this folder are also kept in `tauri-app/src/` for frontend access
- Both locations are necessary:
  - `src-tauri/resources/` - For backend opening (bundled with app)
  - `src/` - For potential frontend display (bundled with frontend)
- Do not remove PDFs from either location without updating both
