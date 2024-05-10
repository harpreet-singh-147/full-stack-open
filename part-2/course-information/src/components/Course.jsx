import Header from './Header';
import Content from './Content';

const Course = ({ course }) => {
  return (
    <main>
      <Header heading={course.name} />
      <Content parts={course.parts} />
    </main>
  );
};
export default Course;
