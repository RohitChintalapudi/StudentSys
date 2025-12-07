const PDFDocument = require("pdfkit");

function generateTranscriptPDF(transcript, res) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: `Transcript - ${transcript.studentDetails.name}`,
      Author: "Student Record Management System",
      Subject: "Academic Transcript",
    },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=transcript_${transcript.studentDetails.roll}.pdf`
  );

  doc.pipe(res);

  // Header Section with Background
  doc
    .rect(0, 0, doc.page.width, 100)
    .fill("#007AFF");
  
  // Institution Name
  doc
    .fillColor("#FFFFFF")
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("STUDENT RECORD MANAGEMENT SYSTEM", 50, 25, {
      align: "center",
      width: doc.page.width - 100,
    });

  // Date
  doc
    .fontSize(9)
    .text(
      `Generated on: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      50,
      75,
      {
        align: "center",
        width: doc.page.width - 100,
      }
    );

  // Reset color
  doc.fillColor("#000000");

  // Student Information Section
  let yPos = 120;
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .text("STUDENT INFORMATION", 50, yPos);

  yPos += 25;

  // Student Details Box
  const boxWidth = doc.page.width - 100;
  const boxHeight = 80;
  doc
    .rect(50, yPos, boxWidth, boxHeight)
    .stroke("#D2D2D7")
    .fill("#F5F5F7");

  // Student Details
  doc.fillColor("#1D1D1F").fontSize(12).font("Helvetica");

  const details = [
    { label: "Name", value: transcript.studentDetails.name },
    { label: "Roll Number", value: transcript.studentDetails.roll },
    { label: "Department", value: transcript.studentDetails.department },
  ];

  let detailY = yPos + 15;
  details.forEach((detail) => {
    doc
      .font("Helvetica-Bold")
      .text(`${detail.label}:`, 60, detailY, { width: 150 })
      .font("Helvetica")
      .text(detail.value, 220, detailY, { width: 300 });
    detailY += 18;
  });

  yPos += boxHeight + 30;

  // Academic Performance Summary
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("ACADEMIC PERFORMANCE SUMMARY", 50, yPos);

  yPos += 25;

  // Summary Box
  const summaryBoxWidth = (boxWidth - 20) / 2;
  const summaryBoxHeight = 60;

  // GPA Box
  doc
    .rect(50, yPos, summaryBoxWidth, summaryBoxHeight)
    .fill("#E3F2FD")
    .stroke("#007AFF");

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#007AFF")
    .text("CUMULATIVE GPA", 50, yPos + 10, {
      align: "center",
      width: summaryBoxWidth,
    });

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(transcript.gpa || "0.00", 50, yPos + 25, {
      align: "center",
      width: summaryBoxWidth,
    });

  // Attendance Box
  doc
    .rect(50 + summaryBoxWidth + 20, yPos, summaryBoxWidth, summaryBoxHeight)
    .fill("#FFF3E0")
    .stroke("#FF9500");

  doc
    .fontSize(11)
    .font("Helvetica")
    .fillColor("#FF9500")
    .text("ATTENDANCE PERCENTAGE", 50 + summaryBoxWidth + 20, yPos + 10, {
      align: "center",
      width: summaryBoxWidth,
    });

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text(`${transcript.attendancePercentage}%`, 50 + summaryBoxWidth + 20, yPos + 25, {
      align: "center",
      width: summaryBoxWidth,
    });

  yPos += summaryBoxHeight + 30;

  // Course Performance Section
  doc
    .fontSize(16)
    .font("Helvetica-Bold")
    .fillColor("#000000")
    .text("COURSE-WISE PERFORMANCE", 50, yPos);

  yPos += 25;

  // Check if there are marks
  if (!transcript.marks || transcript.marks.length === 0) {
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#86868B")
      .text("No course records available.", 50, yPos);
    doc.end();
    return;
  }

  // Table Header
  const tableTop = yPos;
  const rowHeight = 25;
  const colWidths = {
    code: 100,
    name: 200,
    credits: 70,
    marks: 70,
    grade: 60,
  };

  // Header Background
  doc
    .rect(50, tableTop, boxWidth, rowHeight)
    .fill("#007AFF")
    .stroke("#007AFF");

  // Header Text
  doc.fillColor("#FFFFFF").fontSize(10).font("Helvetica-Bold");

  let xPos = 55;
  doc.text("CODE", xPos, tableTop + 8, { width: colWidths.code });
  xPos += colWidths.code;
  doc.text("COURSE NAME", xPos, tableTop + 8, { width: colWidths.name });
  xPos += colWidths.name;
  doc.text("CREDITS", xPos, tableTop + 8, { width: colWidths.credits, align: "center" });
  xPos += colWidths.credits;
  doc.text("MARKS", xPos, tableTop + 8, { width: colWidths.marks, align: "center" });
  xPos += colWidths.marks;
  doc.text("GRADE", xPos, tableTop + 8, { width: colWidths.grade, align: "center" });

  // Table Rows
  doc.fillColor("#000000").fontSize(10).font("Helvetica");
  let currentY = tableTop + rowHeight;

  transcript.marks.forEach((mark, index) => {
    // Alternate row colors
    if (index % 2 === 0) {
      doc
        .rect(50, currentY, boxWidth, rowHeight)
        .fill("#F5F5F7")
        .stroke("#D2D2D7");
    } else {
      doc
        .rect(50, currentY, boxWidth, rowHeight)
        .fill("#FFFFFF")
        .stroke("#D2D2D7");
    }

    // Grade color
    let gradeColor = "#000000";
    if (mark.grade === "A") gradeColor = "#34C759";
    else if (mark.grade === "B") gradeColor = "#007AFF";
    else if (mark.grade === "C") gradeColor = "#FF9500";
    else if (mark.grade === "D" || mark.grade === "F") gradeColor = "#FF3B30";

    xPos = 55;
    doc.fillColor("#1D1D1F").text(mark.courseCode || "N/A", xPos, currentY + 8, {
      width: colWidths.code,
    });
    xPos += colWidths.code;
    doc.text(mark.course || "N/A", xPos, currentY + 8, { width: colWidths.name });
    xPos += colWidths.name;
    doc.text(String(mark.credits || 0), xPos, currentY + 8, {
      width: colWidths.credits,
      align: "center",
    });
    xPos += colWidths.credits;
    doc.text(String(mark.marks || 0), xPos, currentY + 8, {
      width: colWidths.marks,
      align: "center",
    });
    xPos += colWidths.marks;
    doc.fillColor(gradeColor).font("Helvetica-Bold").text(mark.grade || "N/A", xPos, currentY + 8, {
      width: colWidths.grade,
      align: "center",
    });

    currentY += rowHeight;

    // Check if we need a new page
    if (currentY > doc.page.height - 100) {
      doc.addPage();
      currentY = 50;
    }
  });

  // Footer
  const footerY = doc.page.height - 50;
  doc
    .fontSize(8)
    .font("Helvetica")
    .fillColor("#86868B")
    .text(
      "This is an official transcript generated by Student Record Management System.",
      50,
      footerY,
      {
        align: "center",
        width: doc.page.width - 100,
      }
    );

  doc.end();
}

module.exports = generateTranscriptPDF;
