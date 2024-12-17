const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

dropZone.addEventListener("dragover", dragoverFile);
function dragoverFile(event) {
  event.preventDefault();

  if (!event.dataTransfer.types.includes("Files")) {
    return;
  }
}

dropZone.addEventListener("dragenter", dragenterFile);
function dragenterFile(event) {
  event.preventDefault();
}

dropZone.addEventListener("drop", dropFile);
function dropFile(event) {
  event.preventDefault();
  convertFile(event);
}

fileInput.addEventListener("change", changeFile);
function changeFile(event) {
  convertFile(event);
}

async function convertFile(event) {
  const files = event.target.files
    ? event.target.files
    : event.dataTransfer.files;

  if (files.length === 0) {
    return;
  }

  const file = files[0];

  if (file.type !== "application/vnd.ms-excel") {
    return;
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const worksheet = workbook.Sheets["Summary"];

  let data = XLSX.utils.sheet_to_json(worksheet, { range: 12 });

  for (const row of data) {
    // Convert dates to ISO and remove the time(zone).
    const date = new Date(row["Date"]);
    row["Date"] = date.toISOString().split("T")[0];

    // Delete unnecessary columns
    delete row["Additional Information"];
    delete row["Date Processed"];
    delete row["Merchant Address"];

    // Convert currency to number
    row["Amount"] = row["Amount"].replace("$", "");
    row["Amount"] = parseFloat(row["Amount"]);

    // Swap signs to match YNAB
    row["Amount"] = (row["Amount"] * -1.0).toFixed(2);

    // Rename columns to match YNAB
    row["Payee"] = row["Merchant"];
    delete row["Merchant"];
    row["Memo"] = row["Description"];
    delete row["Description"];
  }

  const newWorksheet = XLSX.utils.json_to_sheet(data);
  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Summary");
  const csv = XLSX.write(newWorkbook, { type: "array", bookType: "csv" });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });

  // Update download button and show it
  const downloadButton = document.querySelector("#downloadLink");
  downloadButton.href = URL.createObjectURL(blob);
  downloadButton.download = "ConvertedTransactions.csv";
  downloadButton.style.display = "block";
}
