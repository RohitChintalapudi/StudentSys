function getGradePoint(grade) {
  switch (grade) {
    case "A":
      return 10;
    case "B":
      return 8;
    case "C":
      return 6;
    case "D":
      return 4;
    default:
      return 0;
  }
}

function calculateGPA(marksEntries) {
  let totalCredits = 0;
  let totalPoints = 0;

  marksEntries.forEach((entry) => {
    const gradePoint = getGradePoint(entry.grade);
    const credits = entry.courseId.credits;

    totalCredits += credits;
    totalPoints += gradePoint * credits;
  });

  if (totalCredits === 0) return 0;
  return (totalPoints / totalCredits).toFixed(2);
}

module.exports = { calculateGPA };
