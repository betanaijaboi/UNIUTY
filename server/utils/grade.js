function getGrade(score) {
  if (score >= 70) return { grade: 'A', points: 5 };
  if (score >= 60) return { grade: 'B', points: 4 };
  if (score >= 50) return { grade: 'C', points: 3 };
  if (score >= 45) return { grade: 'D', points: 2 };
  if (score >= 40) return { grade: 'E', points: 1 };
  return { grade: 'F', points: 0 };
}

module.exports = getGrade;