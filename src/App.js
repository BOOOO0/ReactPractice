import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, { useMemo, useEffect, useRef, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const dataId = useRef(0);
  // 호출 후 key값 id값이 지랄나는 이유
  // index.js 에서 React.StrcitMode가 렌더링을 두번씩 시켜서
  // 20번 증가한 후에 20번 또 증가하면서 id 들어갔기 때문
  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(initData);
  };
  useEffect(() => {
    getData();
  }, []);
  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };
  const onRemove = (targetID) => {
    const newDiaryList = data.filter((it) => it.id !== targetID);
    setData(newDiaryList);
  };
  const onEdit = (targetID, newContent) => {
    setData(
      data.map((it) =>
        it.id === targetID ? { ...it, content: newContent } : it
      )
    );
  };
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);
  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;
  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onEdit={onEdit} onRemove={onRemove} />
    </div>
  );
}

export default App;