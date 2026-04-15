const express = require('express');
const router = express.Router();

const Result = require('../models/Result');
const Student = require('../models/Student');

// GET FULL TRANSCRIPT WITH SEMESTERS + CGPA
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    // ✅ Validate student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // ✅ Get all results
    const results = await Result.find({ student: studentId })
      .populate('course')
      .sort({ session: 1, semester: 1 });

    if (!results.length) {
      return res.json({
        student,
        transcript: [],
        cgpa: "0.00"
      });
    }

    // 🧠 GROUP RESULTS BY SESSION + SEMESTER
    const grouped = {};

    results.forEach(r => {
      const key = `${r.session}-${r.semester}`;

      if (!grouped[key]) {
        grouped[key] = {
          session: r.session,
          semester: r.semester,
          courses: [],
          totalPoints: 0,
          totalUnits: 0
        };
      }

      grouped[key].courses.push(r);

      if (r.course && r.course.unit) {
        grouped[key].totalPoints += r.points * r.course.unit;
        grouped[key].totalUnits += r.course.unit;
      }
    });

    // 🧠 BUILD FINAL TRANSCRIPT
    let overallPoints = 0;
    let overallUnits = 0;

    const transcript = Object.values(grouped).map(sem => {
      const gpa = sem.totalUnits === 0
        ? 0
        : (sem.totalPoints / sem.totalUnits);

      overallPoints += sem.totalPoints;
      overallUnits += sem.totalUnits;

      return {
        session: sem.session,
        semester: sem.semester,
        gpa: gpa.toFixed(2),
        totalUnits: sem.totalUnits,
        courses: sem.courses
      };
    });

    // 🧠 CGPA
    const cgpa = overallUnits === 0
      ? "0.00"
      : (overallPoints / overallUnits).toFixed(2);

    // 🧠 Grade summary
    const gradeSummary = {};
    results.forEach(r => {
      gradeSummary[r.grade] = (gradeSummary[r.grade] || 0) + 1;
    });

    // ✅ FINAL RESPONSE
    res.json({
      student: {
        id: student._id,
        name: student.name,
        matricNo: student.matricNo,
        department: student.department,
        level: student.level
      },
      transcript,
      cgpa,
      gradeSummary
    });

  } catch (err) {
    console.error('Transcript Error:', err);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
});

const PDFDocument = require('pdfkit');

// DOWNLOAD PDF TRANSCRIPT
router.get('/:studentId/pdf', async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);
    const results = await Result.find({
      student: req.params.studentId,
      status: 'approved' // ✅ ONLY APPROVED RESULTS
}).populate('course');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const doc = new PDFDocument();

    // headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transcript-${student.matricNo}.pdf`
    );

    doc.pipe(res);

    // 🧾 TITLE
    doc.fontSize(20).text('UNIUTY UNIVERSITY', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text('OFFICIAL TRANSCRIPT', { align: 'center' });

    doc.moveDown();

    // 👤 STUDENT INFO
    doc.fontSize(12).text(`Name: ${student.name}`);
    doc.text(`Matric No: ${student.matricNo}`);
    doc.text(`Department: ${student.department}`);
    doc.text(`Level: ${student.level}`);

    doc.moveDown();

    // 📚 RESULTS TABLE
    let totalPoints = 0;
    let totalUnits = 0;

    results.forEach(r => {
      doc.text(
        `${r.course.code} - ${r.course.title} | Score: ${r.score} | Grade: ${r.grade}`
      );

      totalPoints += r.points * r.course.unit;
      totalUnits += r.course.unit;
    });

    doc.moveDown();

    // 📊 GPA
    const gpa = totalUnits === 0 ? 0 : (totalPoints / totalUnits).toFixed(2);

    doc.fontSize(14).text(`CGPA: ${gpa}`, { align: 'right' });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});
module.exports = router;