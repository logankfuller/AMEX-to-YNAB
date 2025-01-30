
# Amex → YNAB Converter

## Description

**Amex → YNAB Converter** is a lightweight, client-side web tool that helps users convert American Express transaction files (`.xls`) into YNAB-compatible CSV files. If you're tracking finances with YNAB (You Need a Budget) and exporting statements from American Express, this tool streamlines the process.

---

## Why Vanilla JS/CSS/HTML?

In an age where frameworks dominate web development, this project is intentionally built using **vanilla JavaScript**, **CSS**, and **HTML**. For small projects that don't require complex features or scaling, frameworks can add unnecessary overhead. Keeping it simple ensures better performance and readability.

---

## Features

- **File Drag-and-Drop:** Simply drag and drop your `.xls` file.
- **Excel-to-CSV Conversion:** Converts `.xls` files into `.csv` format compatible with YNAB.
- **Date Standardization:** Adjusts dates to ISO format (YYYY-MM-DD).
- **Column Cleanup:** Removes unnecessary columns from Amex files.
- **Automatic Amount Adjustment:** Swaps the transaction signs to match YNAB's import format.

---

## Usage

1. **Download Transactions:**
   - Export your transactions as a `.xls` file from the American Express website.
2. **Upload the File:**
   - Drag and drop the file onto the tool or click to upload.
3. **Download the Converted File:**
   - The tool generates a clean `.csv` file ready for YNAB.

---

## Installation

No installation required! The project runs fully in the browser.

### Run Locally
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/amex-to-ynab.git
   cd amex-to-ynab
   ```
2. Open `index.html` in your browser.

---

## File Structure

```
📂 amex-to-ynab
│-- 📄 index.html       # Main HTML page
│-- 📄 favicon.ico      # Favicon
│-- 📂 js
│   ├── main.js         # JavaScript logic for file handling
│   └── xlsx.full.min.js # XLSX library (for parsing Excel files)
│-- 📂 css
    └── main.css        # External stylesheet
```

---

## Dependencies

- **[SheetJS](https://git.sheetjs.com/SheetJS/sheetjs)**: Parses and manipulates Excel `.xls` files.

---

## Contributing

Contributions are welcome! To get started:
1. Fork this repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add a new feature"
   ```
4. Push to the branch and open a Pull Request.

---

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

---

## Acknowledgments

Thanks to [SheetJS](https://git.sheetjs.com/SheetJS/sheetjs) for the excellent library and the YNAB team for building a great budgeting tool.

---
