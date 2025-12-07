// Add course
async function addCourse(event) {
  event.preventDefault();

  const courseCode = document.querySelector("#courseCode").value.trim();
  const courseName = document.querySelector("#courseName").value.trim();
  const credits = document.querySelector("#credits").value.trim();

  if (!courseCode || !courseName || !credits) {
    showPopup("All fields required!", "error");
    return;
  }

  if (isNaN(credits) || credits < 1) {
    showPopup("Credits must be a valid number", "error");
    return;
  }

  try {
  const res = await apiCall(
    "/courses/add",
    "POST",
      { courseCode, courseName, credits: parseInt(credits) },
      true
    );

    if (res._id) {
      showPopup("Course Added Successfully!", "success");
      // Reset form
      document.querySelector("#courseCode").value = "";
      document.querySelector("#courseName").value = "";
      document.querySelector("#credits").value = "";
      // Reload courses list
      loadExistingCourses();
    } else {
      showPopup(res.message || "Failed to add course", "error");
    }
  } catch (err) {
    console.error("Add course error:", err);
    showPopup("Failed to add course", "error");
  }
}

// Load and display existing courses
async function loadExistingCourses() {
  try {
    const courses = await apiCall("/courses", "GET", null, true);
    const container = document.getElementById("coursesList");
    if (!container) return;

    if (!courses || courses.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:#86868B;padding:40px;font-size:14px;'>No courses added yet</p>";
      return;
    }

    container.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          ${courses
            .map((course) => {
              return `
                <tr>
                  <td><strong style="color:#1D1D1F;">${course.courseCode}</strong></td>
                  <td>${course.courseName}</td>
                  <td>${course.credits}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    `;
  } catch (err) {
    console.error("Load courses error:", err);
    showPopup("Failed to load courses", "error");
  }
}

// Load courses for marks dropdown
async function loadCoursesForMarks() {
  try {
    const courses = await apiCall("/courses", "GET", null, true);
    const courseSelect = document.getElementById("courseSelect");
    if (!courseSelect) return;

    if (!courses || courses.length === 0) {
      courseSelect.innerHTML = "<option value=''>No courses available</option>";
      return;
    }

    courseSelect.innerHTML = "<option value=''>-- Select a Course --</option>";
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = `${course.courseCode} - ${course.courseName}`;
      courseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Load courses error:", err);
    showPopup("Failed to load courses", "error");
  }
}

// Load students enrolled in selected course
async function loadStudentsForCourse() {
  try {
    const courseSelect = document.getElementById("courseSelect");
    const studentSelect = document.getElementById("studentSelect");
    
    if (!courseSelect || !studentSelect) return;

    const courseId = courseSelect.value;
    
    if (!courseId) {
      studentSelect.innerHTML = "<option value=''>-- Select a Course First --</option>";
      studentSelect.disabled = true;
      return;
    }

    // Show loading state
    studentSelect.innerHTML = "<option value=''>Loading students...</option>";
    studentSelect.disabled = true;

    const students = await apiCall(`/students/course/${courseId}`, "GET", null, true);

    if (!students || students.length === 0) {
      studentSelect.innerHTML = "<option value=''>No students enrolled in this course</option>";
      studentSelect.disabled = true;
      return;
    }

    studentSelect.innerHTML = "<option value=''>-- Select a Student --</option>";
    students.forEach((student) => {
      const option = document.createElement("option");
      option.value = student._id;
      option.textContent = `${student.name} (${student.roll}) - ${student.department}`;
      studentSelect.appendChild(option);
    });

    studentSelect.disabled = false;
  } catch (err) {
    console.error("Load students error:", err);
    showPopup("Failed to load students", "error");
    const studentSelect = document.getElementById("studentSelect");
    if (studentSelect) {
      studentSelect.innerHTML = "<option value=''>Error loading students</option>";
      studentSelect.disabled = true;
    }
  }
}

// Add marks
async function addMarks() {
  try {
    const studentId = document.getElementById("studentSelect").value.trim();
    const courseId = document.getElementById("courseSelect").value.trim();
    const marks = document.getElementById("marks").value.trim();

    if (!studentId || !courseId || !marks) {
      showPopup("Please select course, student, and enter marks!", "error");
      return;
    }

    const marksNum = parseFloat(marks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
      showPopup("Marks must be between 0 and 100", "error");
      return;
    }

    const res = await apiCall(
      "/marks/add",
      "POST",
      { studentId, courseId, marks: marksNum },
      true
    );

    if (res._id) {
      showPopup("Marks added successfully!", "success");
      // Reset form
      document.getElementById("marks").value = "";
      // Optionally reload students to show updated data
      loadStudentsForCourse();
    } else {
      showPopup(res.message || "Failed to add marks", "error");
    }
  } catch (err) {
    console.error("Add marks error:", err);
    showPopup("Failed to add marks", "error");
  }
}

// Load courses for attendance dropdown
async function loadCoursesForAttendance() {
  try {
    const courses = await apiCall("/courses", "GET", null, true);
    const courseSelect = document.getElementById("courseSelectAttendance");
    if (!courseSelect) return;

    if (!courses || courses.length === 0) {
      courseSelect.innerHTML = "<option value=''>No courses available</option>";
      return;
    }

    courseSelect.innerHTML = "<option value=''>-- Select a Course --</option>";
    courses.forEach((course) => {
      const option = document.createElement("option");
      option.value = course._id;
      option.textContent = `${course.courseCode} - ${course.courseName}`;
      courseSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Load courses error:", err);
    showPopup("Failed to load courses", "error");
  }
}

// Load students enrolled in selected course for attendance
async function loadStudentsForAttendance() {
  try {
    const courseSelect = document.getElementById("courseSelectAttendance");
    const studentSelect = document.getElementById("studentSelectAttendance");
    
    if (!courseSelect || !studentSelect) return;

    const courseId = courseSelect.value;
    
    if (!courseId) {
      studentSelect.innerHTML = "<option value=''>-- Select a Course First --</option>";
      studentSelect.disabled = true;
      return;
    }

    // Show loading state
    studentSelect.innerHTML = "<option value=''>Loading students...</option>";
    studentSelect.disabled = true;

    const students = await apiCall(`/students/course/${courseId}`, "GET", null, true);

    if (!students || students.length === 0) {
      studentSelect.innerHTML = "<option value=''>No students enrolled in this course</option>";
      studentSelect.disabled = true;
      return;
    }

    studentSelect.innerHTML = "<option value=''>-- Select a Student --</option>";
    students.forEach((student) => {
      const option = document.createElement("option");
      option.value = student._id;
      option.textContent = `${student.name} (${student.roll}) - ${student.department}`;
      studentSelect.appendChild(option);
    });

    studentSelect.disabled = false;
  } catch (err) {
    console.error("Load students error:", err);
    showPopup("Failed to load students", "error");
    const studentSelect = document.getElementById("studentSelectAttendance");
    if (studentSelect) {
      studentSelect.innerHTML = "<option value=''>Error loading students</option>";
      studentSelect.disabled = true;
    }
  }
}

// Mark attendance
async function markAttendance() {
  try {
    const studentId = document.getElementById("studentSelectAttendance").value.trim();
    const date = document.getElementById("date").value.trim();
    const status = document.getElementById("status").value;

    if (!studentId || !date || !status) {
      showPopup("Please select course, student, date, and status!", "error");
      return;
    }

    // Date validation is handled by HTML5 date input, but double-check
    if (!date) {
      showPopup("Please select a date", "error");
      return;
    }

    const res = await apiCall(
      "/attendance/mark",
      "POST",
      { studentId, date, status },
      true
    );

    if (res._id) {
      showPopup("Attendance marked successfully!", "success");
      // Reset form (keep course and date, reset student and status)
      document.getElementById("studentSelectAttendance").value = "";
      document.getElementById("status").value = "present";
      // Reload students for the selected course
      loadStudentsForAttendance();
    } else {
      showPopup(res.message || "Failed to mark attendance", "error");
    }
  } catch (err) {
    console.error("Mark attendance error:", err);
    showPopup("Failed to mark attendance", "error");
  }
}

// Add notice
async function addNotice() {
  try {
    const title = document.getElementById("title").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!title || !message) {
      showPopup("Title and message are required!", "error");
      return;
    }

    const res = await apiCall(
      "/notices/add",
      "POST",
      { title, message },
    true
  );

    if (res._id) {
      showPopup("Notice posted successfully!", "success");
      // Reset form
      document.getElementById("title").value = "";
      document.getElementById("message").value = "";
    } else {
      showPopup(res.message || "Failed to post notice", "error");
    }
  } catch (err) {
    console.error("Add notice error:", err);
    showPopup("Failed to post notice", "error");
  }
}

// Load notices for staff
async function loadNotices() {
  try {
    const notices = await apiCall("/notices", "GET", null, true);
    const container = document.getElementById("noticesList");
    if (!container) return;

    if (!notices || notices.length === 0) {
      container.innerHTML = "<p style='text-align:center;color:#999;padding:40px;'>No notices posted yet</p>";
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

// Set today's date as default for attendance and load notices
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  if (dateInput && !dateInput.value) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  // Load notices if on notices page
  if (window.location.pathname.includes("notices.html")) {
    loadNotices();
  }

  // Load courses if on addMarks page
  if (window.location.pathname.includes("addMarks.html")) {
    loadCoursesForMarks();
  }

  // Load courses if on attendance page
  if (window.location.pathname.includes("attendance.html")) {
    loadCoursesForAttendance();
  }

  // Load existing courses if on addCourse page
  if (window.location.pathname.includes("addCourse.html")) {
    loadExistingCourses();
  }
});
