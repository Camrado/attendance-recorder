const { StatusCodes } = require('http-status-codes');
const Student = require('../models/Student');
const { Edupage } = require('edupage-api');

const getTimetable = async (req, res) => {
  const { date } = req.params;
  const { studentId, password } = req.student;

  const student = await Student.findById(studentId);

  const edupage = new Edupage();
  await edupage.login(student.username, password);

  const timetable = await edupage.getTimetableForDate(new Date(date));
  const lessons = timetable.lessons;

  edupage.exit;

  const formattedLessons = [];

  for (let lesson of lessons) {
    const tempLesson = {
      period: lesson.period.short,
      subject: lesson.subject.name,
      group: lesson.groupnames[0]
    };

    formattedLessons.push(tempLesson);
  }

  res.status(StatusCodes.OK).json({ msg: `Here is the timetable for ${date}`, lessons: formattedLessons });
};

module.exports = {
  getTimetable
};
