import React, { useState, useEffect } from "react";

// const TextView = React.memo(({ text }) => {
//   useEffect(() => {
//     console.log(`Update :: Text : ${text}`);
//   });
//   return <div>{text}</div>;
// });
// const CountView = React.memo(({ count }) => {
//   useEffect(() => {
//     console.log(`Update :: Count : ${count}`);
//   });
//   return <div>{count}</div>;
// });
const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA Update - count: ${count}`);
  });
  return <div>{count}</div>;
});
// JS에서 객체의 비교는 얕은 비교를 통해서 이루어짐
// JS는 객체, 함수, 배열 같은 비원시타입은 주소를 통해서 얕은 비교를 한다
// 값이 같은 객체도 a === b 는 false이다
const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CounterB Update - count: ${obj.count}`);
  });
  return <div>{obj.count}</div>;
};
const areEqual = (prevProps, nextProps) => {
  //   if (prevProps.obj.count === nextProps.obj.count) {
  //     return true;
  //   }
  //   return false;
  return prevProps.obj.count === nextProps.obj.count;
};
const MemoizedCounterB = React.memo(CounterB, areEqual);
const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });
  //   const [text, setText] = useState("");
  return (
    <div style={{ padding: 50 }}>
      {/* <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input value={text} onChange={(e) => setText(e.target.value)}></input>
      </div> */}
      <div>
        <h2>Counter A</h2>
        <CounterA count={count} />
        <button onClick={() => setCount(count)}>A button</button>
      </div>
      <div>
        <h2>Counter B</h2>
        <MemoizedCounterB obj={obj} />
        <button onClick={() => setObj({ count: obj.count })}>B button</button>
      </div>
    </div>
  );
};

export default OptimizeTest;
