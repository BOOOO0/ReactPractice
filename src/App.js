import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, {
  useMemo,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from "react";

const reducer = (state, action) => {
  switch (action.type) {
    //API에서 불러온 일기들을 리스트에 추가
    case "INIT": {
      return action.data;
    }
    //새로 작성된 일기를 리스트에 추가
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    //리스트에 있는 일기를 삭제
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetID);
    }
    //리스트에 있는 일기를 수정
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetID ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

const App = () => {
  //const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);
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
    dispatch({ type: "INIT", data: initData });
  };
  useEffect(() => {
    getData();
  }, []);
  // DiaryEditor의 불필요한 렌더링을 방지하기 위해서 onCreate함수 최적화
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    dataId.current += 1;
    //함수형 전달
    //항상 최신의 data를 인자를 통해서 참조할 수 있다
  }, []);
  const onRemove = useCallback((targetID) => {
    //기존의 newDiaryList를 return하던 방식도 없애고
    //const newDiaryList = data.filter((it) => it.id !== targetID);
    //함수형 업데이트 지시
    dispatch({ type: "REMOVE", targetID });
  }, []);
  const onEdit = useCallback((targetID, newContent) => {
    dispatch({ type: "EDIT", targetID, newContent });
  }, []);
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
};

export default App;
