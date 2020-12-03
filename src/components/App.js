import React, { useState, useEffect } from "react";

async function asyncFunc() {
  return Promise.resolve(37);
}

const App = () => {
  const [answer, setAnswer] = useState(42);
  useEffect(async () => {
    const age = await asyncFunc();
    setAnswer(age);
  }, []);
  return <h2>Hello React {answer}</h2>;
};
export default App;
