const dropZone = document.querySelector("#dropZone");
const fileInput = document.querySelector("#fileInput");

const dateToggle = document.querySelector("#enableDateFilter");
const dateRangeContainer = document.querySelector("#dateRangeContainer");

document.addEventListener("dragover", dragover);
function dragover(event) {
  event.preventDefault();

  if (!dropZone.contains(event.target)) {
    document.body.style.cursor = "not-allowed";
    event.dataTransfer.dropEffect = "none";
  }
}

dropZone.addEventListener("dragover", dragoverFile);
function dragoverFile(event) {
  event.preventDefault();
}

dropZone.addEventListener("dragenter", dragenterFile);
function dragenterFile(event) {
  event.preventDefault();
}

dropZone.addEventListener("drop", dropFile);
function dropFile(event) {
  event.preventDefault();

  if (event.dataTransfer.files[0].type !== "application/vnd.ms-excel") {
    const errorMessage = document.querySelector("#errorMessage");
    errorMessage.textContent =
      "Please upload a Excel (.xls) file downloaded from American Express.";
    errorMessage.style.display = "block";

    const downloadButton = document.querySelector("#downloadLink");
    downloadButton.style.display = "none";

    return;
  } else {
    const errorMessage = document.querySelector("#errorMessage");
    errorMessage.style.display = "none";
  }

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

  const startDate = document.querySelector("#startDate").value;
  const endDate = document.querySelector("#endDate").value;

  if (dateToggle.checked) {
    data = filterTransactionsByDate(data, startDate, endDate);
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

function filterTransactionsByDate(transactions, startDate, endDate) {
  if (!startDate && !endDate) return transactions;

  const start = new Date(startDate);
  const end = new Date(endDate);

  return transactions.filter((transaction) => {
    const txDate = new Date(transaction.Date);
    // If only start, then filter all transactions after start date. If only end, then filter all transactions before end date.
    // If both start and end, then filter all transactions between start and end date.
    if (startDate && !endDate) {
      return txDate >= start;
    } else if (!startDate && endDate) {
      return txDate <= end;
    } else {
      return txDate >= start && txDate <= end;
    }
  });
}

dateToggle.addEventListener("change", handleDateFilterToggle);
function handleDateFilterToggle(e) {
  const checkbox = e.target;

  if (checkbox.checked) {
    dateRangeContainer.style.display = "flex";
  } else {
    dateRangeContainer.style.display = "none";
  }
}
