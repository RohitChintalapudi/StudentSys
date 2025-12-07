// Load student dashboard data
async function loadDashboard() {
  try {
    // Get student info
    const student = await apiCall("/students/me", "GET", null, true);
    if (!student || !student._id) {
      showPopup("Failed to load student data", "error");
      return;
    }

    const studentId = student._id;

    // Load courses
    const courses = await apiCall("/courses", "GET", null, true);
    const enrolledCourses = student.courses || [];
    const coursesListEl = document.getElementById("coursesList");
    if (coursesListEl) {
      if (enrolledCourses.length === 0) {
        coursesListEl.innerHTML = "<p style='color:#86868B;font-size:14px;'>No courses enrolled yet</p>";
      } else {
        coursesListEl.innerHTML = enrolledCourses
          .map((c) => `<div style='padding:10px;background:#F5F5F7;border-radius:8px;margin:6px 0;font-size:14px;color:#1D1D1F;'>${c.courseName || c.courseCode || "Course"}</div>`)
          .join("");
      }
    }

    // Load GPA from transcript
    const transcript = await apiCall(`/transcript/${studentId}`, "GET", null, true);
    const gpaCard = document.getElementById("gpaCard");
    const gpaEl = document.getElementById("gpaVal");
    if (gpaEl && gpaCard) {
      gpaEl.textContent = transcript.gpa || "0.00";
      gpaCard.classList.add("gradient-card");
      // Ensure text color is black
      gpaEl.style.color = "#1D1D1F";
      const gpaSmall = gpaCard.querySelector("small");
      if (gpaSmall) gpaSmall.style.color = "#86868B";
      const gpaH4 = gpaCard.querySelector("h4");
      if (gpaH4) gpaH4.style.color = "#1D1D1F";
    }

    // Load attendance percentage
    const attData = await apiCall(`/attendance/percentage/${studentId}`, "GET", null, true);
    const attCard = document.getElementById("attCard");
    const attEl = document.getElementById("attVal");
    if (attEl && attCard) {
      const percentage = attData.percentage || 0;
      attEl.textContent = percentage.toFixed(1) + "%";
      attCard.classList.add("gradient-card-alt");
      // Ensure text color is black
      attEl.style.color = "#1D1D1F";
      const attSmall = attCard.querySelector("small");
      if (attSmall) attSmall.style.color = "#86868B";
      const attH4 = attCard.querySelector("h4");
      if (attH4) attH4.style.color = "#1D1D1F";
    }

    // Load recent marks
    const marks = await apiCall(`/marks/${studentId}`, "GET", null, true);
    const marksContainer = document.getElementById("marksContainer");
    if (marksContainer) {
      if (!marks || marks.length === 0) {
        marksContainer.innerHTML = "<p style='color:#86868B;font-size:14px;'>No marks available yet</p>";
      } else {
        marksContainer.innerHTML = marks
          .slice(0, 5)
          .map((m) => {
            const courseName = m.courseId?.courseName || "Course";
            const gradeColor = m.grade === "A" ? "#34C759" : m.grade === "B" ? "#007AFF" : m.grade === "C" ? "#FF9500" : "#FF3B30";
            return `
              <div style='display:flex;justify-content:space-between;align-items:center;padding:14px;background:#F5F5F7;border-radius:10px;margin:8px 0;border:0.5px solid #D2D2D7;'>
                <div>
                  <strong style='font-size:15px;color:#1D1D1F;'>${courseName}</strong>
                  <div style='font-size:12px;color:#86868B;margin-top:2px;'>${m.courseId?.courseCode || ""}</div>
                </div>
                <div style='text-align:right;'>
                  <div style='font-size:18px;font-weight:600;color:${gradeColor};'>${m.marks}%</div>
                  <div style='font-size:12px;color:#86868B;'>Grade: ${m.grade}</div>
                </div>
              </div>
            `;
          })
          .join("");
      }
    }
  } catch (err) {
    console.error("Dashboard load error:", err);
    showPopup("Failed to load dashboard data", "error");
  }
}

// Load marks page
async function loadMarks() {
  try {
    const student = await apiCall("/students/me", "GET", null, true);
    if (!student || !student._id) {
      showPopup("Failed to load student data", "error");
      return;
    }

    const marks = await apiCall(`/marks/${student._id}`, "GET", null, true);
    const container = document.getElementById("marksContainer");
    if (!container) return;

    if (!marks || marks.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:#86868B;padding:40px;font-size:14px;'>No marks available yet</p>";
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Marks</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          ${marks
            .map((m) => {
              const gradeColor = m.grade === "A" ? "#34C759" : m.grade === "B" ? "#007AFF" : m.grade === "C" ? "#FF9500" : "#FF3B30";
              return `
                <tr>
                  <td>${m.courseId?.courseCode || "N/A"}</td>
                  <td>${m.courseId?.courseName || "N/A"}</td>
                  <td><strong>${m.marks}%</strong></td>
                  <td><span style='color:${gradeColor};font-weight:600;'>${m.grade}</span></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error("Marks load error:", err);
    showPopup("Failed to load marks", "error");
  }
}

// Load attendance page
async function loadAttendance() {
  try {
    const student = await apiCall("/students/me", "GET", null, true);
    if (!student || !student._id) {
      showPopup("Failed to load student data", "error");
      return;
    }

    const attendance = await apiCall(`/attendance/${student._id}`, "GET", null, true);
    const percentage = await apiCall(`/attendance/percentage/${student._id}`, "GET", null, true);
    const container = document.getElementById("attendanceContainer");
    if (!container) return;

    if (!attendance || attendance.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:#86868B;padding:40px;font-size:14px;'>No attendance records yet</p>";
      return;
    }

    const pct = percentage.percentage || 0;

    container.innerHTML = `
      <div class="gradient-card" style='text-align:center;padding:24px;border-radius:12px;margin-bottom:24px;'>
        <div style='font-size:13px;opacity:0.9;margin-bottom:8px;font-weight:500;'>Overall Attendance</div>
        <div style='font-size:40px;font-weight:600;'>${pct.toFixed(1)}%</div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${attendance
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((a) => {
              const statusColor = a.status === "present" ? "#34C759" : "#FF3B30";
              const statusText = a.status === "present" ? "✓ Present" : "✗ Absent";
              return `
                <tr>
                  <td>${new Date(a.date).toLocaleDateString()}</td>
                  <td><span style='color:${statusColor};font-weight:600;'>${statusText}</span></td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error("Attendance load error:", err);
    showPopup("Failed to load attendance", "error");
  }
}

// Enroll in course
async function enrollCourse() {
  try {
    const courseSelect = document.getElementById("courseList");
    const courseId = courseSelect.value;

    if (!courseId) {
      showPopup("Please select a course", "error");
      return;
    }

    const res = await apiCall("/students/enroll", "POST", { courseId }, true);

    if (res._id || res.courses) {
      showPopup("Course enrolled successfully!", "success");
      setTimeout(() => {
        loadCourseList();
      }, 1000);
    } else {
      showPopup(res.message || "Failed to enroll", "error");
    }
  } catch (err) {
    console.error("Enroll error:", err);
    showPopup("Failed to enroll in course", "error");
  }
}

// Load course list for enrollment
async function loadCourseList() {
  try {
    const courses = await apiCall("/courses", "GET", null, true);
    const student = await apiCall("/students/me", "GET", null, true);
    const enrolledIds = (student.courses || []).map((c) => c._id || c.toString());

    const select = document.getElementById("courseList");
    if (!select) return;

    if (!courses || courses.length === 0) {
      select.innerHTML = "<option>No courses available</option>";
      return;
    }

    select.innerHTML = "<option value=''>Select a course...</option>";
    courses.forEach((course) => {
      const isEnrolled = enrolledIds.includes(course._id.toString());
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = `${course.courseCode} - ${course.courseName} ${isEnrolled ? "(Enrolled)" : ""}`;
      option.disabled = isEnrolled;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Course list load error:", err);
  }
}

// Load transcript
async function loadTranscript() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    let studentId = urlParams.get("id");

    if (!studentId) {
      const student = await apiCall("/students/me", "GET", null, true);
      if (!student || !student._id) {
        showPopup("Failed to load student data", "error");
        return;
      }
      studentId = student._id;
    }

    const transcript = await apiCall(`/transcript/${studentId}`, "GET", null, true);
    const container = document.getElementById("transcriptBox");
    if (!container) return;

    container.innerHTML = `
      <div style='margin-bottom:28px;'>
        <h3 style='margin-bottom:16px;font-size:20px;font-weight:600;color:#1D1D1F;'>Student Information</h3>
        <div style='background:#F5F5F7;padding:20px;border-radius:10px;border:0.5px solid #D2D2D7;'>
          <p style='margin-bottom:8px;font-size:15px;color:#1D1D1F;'><strong>Name:</strong> ${transcript.studentDetails.name}</p>
          <p style='margin-bottom:8px;font-size:15px;color:#1D1D1F;'><strong>Roll Number:</strong> ${transcript.studentDetails.roll}</p>
          <p style='margin:0;font-size:15px;color:#1D1D1F;'><strong>Department:</strong> ${transcript.studentDetails.department}</p>
        </div>
      </div>

      <div style='display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:20px;margin-bottom:28px;'>
        <div class="gradient-card" style='padding:24px;border-radius:12px;text-align:center;'>
          <div style='font-size:13px;opacity:0.9;margin-bottom:8px;font-weight:500;'>GPA</div>
          <div style='font-size:36px;font-weight:600;'>${transcript.gpa}</div>
        </div>
        <div class="gradient-card-alt" style='padding:24px;border-radius:12px;text-align:center;'>
          <div style='font-size:13px;opacity:0.9;margin-bottom:8px;font-weight:500;'>Attendance</div>
          <div style='font-size:36px;font-weight:600;'>${transcript.attendancePercentage}%</div>
        </div>
      </div>

      <div>
        <h3 style='margin-bottom:16px;font-size:20px;font-weight:600;color:#1D1D1F;'>Course Performance</h3>
        <table>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credits</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            ${transcript.marks
              .map((m) => {
                const gradeColor = m.grade === "A" ? "#34C759" : m.grade === "B" ? "#007AFF" : m.grade === "C" ? "#FF9500" : "#FF3B30";
                return `
                  <tr>
                    <td>${m.courseCode}</td>
                    <td>${m.course}</td>
                    <td>${m.credits}</td>
                    <td><strong>${m.marks}%</strong></td>
                    <td><span style='color:${gradeColor};font-weight:600;'>${m.grade}</span></td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (err) {
    console.error("Transcript load error:", err);
    showPopup("Failed to load transcript", "error");
  }
}

// Download transcript PDF
async function downloadTranscript() {
  try {
    const student = await apiCall("/students/me", "GET", null, true);
    if (!student || !student._id) {
      showPopup("Failed to get student ID", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showPopup("Please login first", "error");
      return;
    }

    // Create a temporary form to download with Bearer token
    const form = document.createElement("form");
    form.method = "GET";
    form.action = `http://localhost:5000/transcript/pdf/${student._id}`;
    form.style.display = "none";
    
    // Add token as hidden input (backend will extract from Authorization header)
    // Since we can't set headers in GET form, we'll use a different approach
    // Create a link with download attribute and fetch with proper headers
    const response = await fetch(`http://localhost:5000/transcript/pdf/${student._id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to download transcript");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcript_${student.roll || student._id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    showPopup("Transcript downloaded successfully!", "success");
  } catch (err) {
    console.error("Download error:", err);
    showPopup("Failed to download transcript", "error");
  }
}

// Download transcript prompt (for transcript page)
async function downloadTranscriptPrompt() {
  await downloadTranscript();
}

// Load notices
async function loadNotices() {
  try {
    const notices = await apiCall("/notices", "GET", null, true);
    const container = document.getElementById("noticeContainer");
    if (!container) return;

    if (!notices || notices.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:#999;padding:40px;'>No notices available</p>";
      return;
    }

    container.innerHTML = notices
      .map((notice) => {
        const date = new Date(notice.date).toLocaleDateString();
        return `
          <div style='padding:18px;background:#F5F5F7;border-left:3px solid #007AFF;border-radius:10px;margin-bottom:12px;border:0.5px solid #D2D2D7;'>
            <div style='display:flex;justify-content:space-between;align-items:start;margin-bottom:10px;'>
              <h4 style='margin:0;color:#1D1D1F;font-size:16px;font-weight:600;'>${notice.title}</h4>
              <small style='color:#86868B;font-size:12px;'>${date}</small>
            </div>
            <p style='margin:0;color:#1D1D1F;line-height:1.6;font-size:14px;'>${notice.message}</p>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error("Notices load error:", err);
    showPopup("Failed to load notices", "error");
  }
}

// GPA Calculator functions
let subjectCount = 0;

function addSubject() {
  subjectCount++;
  const container = document.getElementById("subjectsContainer");
  if (!container) return;

  const subjectDiv = document.createElement("div");
  subjectDiv.className = "subject-row";
  subjectDiv.id = `subject-${subjectCount}`;
  subjectDiv.style.cssText = "display:flex;gap:12px;align-items:start;margin-bottom:16px;padding:16px;background:#F5F5F7;border-radius:10px;border:1px solid #D2D2D7;";

  subjectDiv.innerHTML = `
    <div style="flex:2;">
      <label style="display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:#1D1D1F;">Subject Name</label>
      <input type="text" class="subject-name" placeholder="e.g., Mathematics" style="margin:0;">
    </div>
    <div style="flex:1;">
      <label style="display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:#1D1D1F;">Grade Points (0-10)</label>
      <input type="number" class="subject-grade-points" placeholder="8.5" min="0" max="10" step="0.1" style="margin:0;" oninput="calculateGPA()">
    </div>
    <div style="flex:1;">
      <label style="display:block;margin-bottom:6px;font-size:13px;font-weight:500;color:#1D1D1F;">Credits</label>
      <input type="number" class="subject-credits" placeholder="3" min="0" step="0.5" style="margin:0;" oninput="calculateGPA()">
    </div>
    <div style="flex:0 0 auto;display:flex;align-items:center;justify-content:center;padding-top:28px;">
      <button type="button" onclick="removeSubject(${subjectCount})" style="width:40px;height:40px;padding:0;background:#FF3B30;color:white;border:none;border-radius:8px;cursor:pointer;font-size:18px;font-weight:600;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;">✕</button>
    </div>
  `;

  container.appendChild(subjectDiv);
  
  // Add event listeners for real-time calculation
  const gradePointsInput = subjectDiv.querySelector(".subject-grade-points");
  const creditsInput = subjectDiv.querySelector(".subject-credits");
  
  if (gradePointsInput) gradePointsInput.addEventListener("input", calculateGPA);
  if (creditsInput) creditsInput.addEventListener("input", calculateGPA);
  
  // Add hover effect to delete button
  const deleteBtn = subjectDiv.querySelector("button");
  if (deleteBtn) {
    deleteBtn.addEventListener("mouseenter", function() {
      this.style.transform = "scale(1.1)";
      this.style.background = "#FF2D20";
    });
    deleteBtn.addEventListener("mouseleave", function() {
      this.style.transform = "scale(1)";
      this.style.background = "#FF3B30";
    });
  }
}

function removeSubject(id) {
  const subjectDiv = document.getElementById(`subject-${id}`);
  if (subjectDiv) {
    subjectDiv.remove();
    calculateGPA();
  }
}

function clearAll() {
  const container = document.getElementById("subjectsContainer");
  if (container) {
    container.innerHTML = "";
    subjectCount = 0;
    calculateGPA();
  }
}

function calculateGPA() {
  const subjects = document.querySelectorAll(".subject-row");
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach((subject) => {
    const gradePointsInput = subject.querySelector(".subject-grade-points");
    const creditsInput = subject.querySelector(".subject-credits");

    if (gradePointsInput && creditsInput) {
      const gradePoints = parseFloat(gradePointsInput.value) || 0;
      const credits = parseFloat(creditsInput.value) || 0;

      // Validate: Grade points should be between 0-10, credits should be > 0
      if (gradePoints >= 0 && gradePoints <= 10 && credits > 0) {
        totalPoints += gradePoints * credits;
        totalCredits += credits;
      }
    }
  });

  // Update display
  const totalCreditsEl = document.getElementById("totalCredits");
  const totalPointsEl = document.getElementById("totalPoints");
  const calculatedGPEl = document.getElementById("calculatedGPA");

  if (totalCreditsEl) {
    totalCreditsEl.textContent = totalCredits.toFixed(1);
  }

  if (totalPointsEl) {
    totalPointsEl.textContent = totalPoints.toFixed(2);
  }

  // Calculate GPA: Σ(Grade Points × Credits) / Total Credits (Scale: 0-10)
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  if (calculatedGPEl) {
    calculatedGPEl.textContent = gpa;
    
    // Color code based on GPA (0-10 scale)
    const gpaNum = parseFloat(gpa);
    if (gpaNum >= 9) {
      calculatedGPEl.style.color = "#34C759"; // Green - Excellent
    } else if (gpaNum >= 7) {
      calculatedGPEl.style.color = "#007AFF"; // Blue - Good
    } else if (gpaNum >= 5) {
      calculatedGPEl.style.color = "#FF9500"; // Orange - Average
    } else {
      calculatedGPEl.style.color = "#FF3B30"; // Red - Needs Improvement
    }
  }
}

// Auto-load functions based on page
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  
  if (path.includes("dashboard.html")) {
    loadDashboard();
  } else if (path.includes("marks.html")) {
    loadMarks();
  } else if (path.includes("attendance.html")) {
    loadAttendance();
  } else if (path.includes("enroll.html")) {
    loadCourseList();
  } else if (path.includes("transcript.html")) {
    loadTranscript();
  } else if (path.includes("notices.html")) {
    loadNotices();
  } else if (path.includes("gpaCalculator.html")) {
    // Add one subject by default when page loads
    addSubject();
  }
});
