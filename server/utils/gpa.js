function calculateGPA(results) {
  let totalPoints = 0;
  let totalUnits = 0;

  results.forEach(r => {
    totalPoints += r.points * r.course.unit;
    totalUnits += r.course.unit;
  });

  if (totalUnits === 0) return 0;

  return (totalPoints / totalUnits).toFixed(2);
}

module.exports = calculateGPA;