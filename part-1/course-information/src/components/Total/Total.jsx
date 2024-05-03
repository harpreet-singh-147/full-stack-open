const Total = props => {
  const total = props.total.parts.reduce(
    (acc, item) => acc + item.exercises,
    0
  );
  return <p>Number of exercises {total}</p>;
};
export default Total;
