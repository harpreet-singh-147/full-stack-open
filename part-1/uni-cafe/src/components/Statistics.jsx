const Statistics = ({ stats: { good, neutral, bad } }) => {
  const all = [good, neutral, bad].reduce((acc, item) => acc + item, 0);
  const weightedFeedback = good * 1 + neutral * 0 + bad * -1;
  const average = all > 0 ? weightedFeedback / all : 0;
  const goodFeedbackPercentage = all > 0 ? (good / all) * 100 : 0;

  return (
    <>
      <h2>Statistics</h2>
      {all === 0 ? (
        <>No feedback given</>
      ) : (
        <table>
          <tbody>
            <StatisticsLine text='good' value={good} />
            <StatisticsLine text='neutral' value={neutral} />
            <StatisticsLine text='bad' value={bad} />
            <StatisticsLine text='all' value={all} />
            <StatisticsLine text='average' value={average} />
            <StatisticsLine text='positive' value={goodFeedbackPercentage} />
          </tbody>
        </table>
      )}
    </>
  );
};
export default Statistics;

const StatisticsLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    {text === 'positive' ? <td>{value}%</td> : <td>{value}</td>}
  </tr>
);
