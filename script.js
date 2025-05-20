document.addEventListener("DOMContentLoaded", function () {
  // Load any saved assignments on page load
  loadAssignments();

  const form = document.getElementById("assignmentForm");
  if (!form) {
    console.error("Form not found!");
    return;
  }

  // Listen for form submission
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh
    console.log("Form submitted!");

    // Retrieve values from the form
    const subject = document.getElementById("subject").value.trim();
    const name = document.getElementById("assignmentName").value.trim();
    const status = document.querySelector(".status-selector")?.value || "Not Started";
    const dueDate = document.getElementById("dueDate").value;

    // Check if any required field is empty
    if (!subject || !name || !dueDate) {
      alert("Please fill all fields!");
      return;
    }

    // Calculate days left
    const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(dueDate);
      due.setHours(0, 0, 0, 0);
      const timeDiff = due - today;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Build and insert the new row
    const tableBody = document.getElementById("assignmentTableBody");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${subject}</td>
      <td>${name}</td>
      <td>
        <select class="status-selector" onchange="updateStatus(this)">
          <option value="Not Started" ${status === "Not Started" ? "selected" : ""}>Not Started</option>
          <option value="In Progress" ${status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${status === "Completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>
      <td>${dueDate}</td>
      <td>${daysLeft}</td>
      <td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>
    `;
    applyRowStyles(row, status);
    tableBody.appendChild(row);
    saveAssignments();

    form.reset();
  });
});

// Save assignments in localStorage as an array of objects
function saveAssignments() {
  let data = [];
  document.querySelectorAll("#assignmentTableBody tr").forEach((row) => {
    let assignment = {
      subject: row.cells[0].innerText,
      name: row.cells[1].innerText,
      status: row.querySelector(".status-selector").value,
      dueDate: row.cells[3].innerText,
      daysLeft: row.cells[4].innerText,

    };
    data.push(assignment);
  });
  localStorage.setItem("assignments", JSON.stringify(data));
}

// Load assignments from localStorage and rebuild the table
function loadAssignments() {
  const savedAssignments = localStorage.getItem("assignments");
if (!savedAssignments) return;

try {
const assignments = JSON.parse(savedAssignments);
if (!Array.isArray(assignments)) throw new Error("Invalid format");

    const tableBody = document.getElementById("assignmentTableBody");
    tableBody.innerHTML = ""; // Clear the table before adding rows

    assignments.forEach((assignment) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${assignment.subject}</td>
        <td>${assignment.name}</td>
        <td>
          <select class="status-selector" onchange="updateStatus(this)">
            <option value="Not Started" ${assignment.status === "Not Started" ? "selected" : ""}>Not Started</option>
            <option value="In Progress" ${assignment.status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option value="Completed" ${assignment.status === "Completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
        <td>${assignment.dueDate}</td>
        <td>${assignment.daysLeft}</td>
        <td><button class="delete-btn" onclick="deleteRow(this)">Delete</button></td>
      `;
      applyRowStyles(row, assignment.status);
      tableBody.appendChild(row);
    });
  }
  catch (error) {
      console.error("Error loading assignments:", error);
      localStorage.removeItem("assignments"); // Optional: Clear invalid data
    }
}

// Update the assignment's status and styling when changed
function updateStatus(selectElement) {
  const row = selectElement.closest("tr");
  const status = selectElement.value;
  applyRowStyles(row, status);
  saveAssignments();
}

// Delete a row from the table and update localStorage
function deleteRow(btn) {
  const row = btn.parentNode.parentNode;
  row.remove();
  saveAssignments();
}

// Apply row styling based on the assignment status
function applyRowStyles(row) {
  const statusSelect = row.querySelector(".status-selector");
  const status = statusSelect.value; // Get current status from dropdown
  const dueDateText = row.cells[3].innerText.trim();
  const daysLeftText = row.cells[4].innerText.trim();

  // Calculate due date and days left
  const dueDate = new Date(dueDateText);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  // Reset the styling on the status select element
  statusSelect.style.backgroundColor = "";
  statusSelect.style.color = "";

  // Apply conditional styling to the status button only:
  if (status === "Completed") {
    statusSelect.style.backgroundColor = "blue";
    statusSelect.style.color = "black";
  } else if (status === "In Progress") {
    statusSelect.style.backgroundColor = "yellow";
    statusSelect.style.color = "black";
  } else if (status === "Not Started") {
    statusSelect.style.backgroundColor = "red";
    statusSelect.style.color = "black";
  }
}

