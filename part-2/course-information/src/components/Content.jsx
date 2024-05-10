const Content = ({ parts }) => {
  const totalExercises = parts.reduce(
    (total, part) => total + part.exercises,
    0
  );

  return (
    <section>
      {parts.map(part => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
      <p>
        <strong>total of {totalExercises} exercises</strong>
      </p>
    </section>
  );
};
export default Content;

const Part = ({ name, exercises }) => {
  return (
    <p>
      {name} {exercises}
    </p>
  );
};
