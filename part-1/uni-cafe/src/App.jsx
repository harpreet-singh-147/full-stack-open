import { useState } from 'react';
import Button from './components/Button';
import Statistics from './components/Statistics';

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleClick = feedback => {
    if (feedback === 'good') {
      setGood(good + 1);
    } else if (feedback === 'neutral') {
      setNeutral(neutral + 1);
    } else if (feedback === 'bad') {
      setBad(bad + 1);
    }
  };

  return (
    <>
      <h1>Give Feedback</h1>
      <Button onClick={() => handleClick('good')} text='good' />
      <Button onClick={() => handleClick('neutral')} text='nuetral' />
      <Button onClick={() => handleClick('bad')} text='bad' />
      <section>
        <Statistics stats={{ good, neutral, bad }} />
      </section>
    </>
  );
};

export default App;
