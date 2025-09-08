import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storageSession from 'redux-persist/es/storage/session';
import userSlice from './Feature/userSlice';
// import { persistReducer } from 'redux-persist';

const reducers = combineReducers({
  user: userSlice,
});

const persistConfig = {
  key: 'root', //reducer의 어느 지점에서부터 저장할지
  storage: storageSession, //sessionstorage에 저장
  whitelist: ['user'], //blacklist : 제외할 것 지정
  purge: ['user'],
};

const persistedReducer = persistReducer(persistConfig, reducers);
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export default store;

//combineReducer는 redux의 API로 여러개의 reducer를 하나의 root reducer로 합쳐준다.
// 기존 코드에서는 configureStore 내부에서 이 기능을 처리해주기 때문에 굳이 사용하지 않았지만,
//persistReducer에 하나의 reducer를 전달하고, 반환받은 enhanced reducer를 configureStore에 전달하기 때문에
//여기서는 combineReducer를 사용하였다.
// const reducers = combineReducers({
//   reducer: { user: userSlice.reducer },
// });

// const persistConfig = { key: 'root', storage, whitelist: ['user'] }; //로컬스토리지를 사용할 것이기 때문에 storage를 적어주었다.

//persistReducer : reducer를 반환하는 API이다. 인자로 받은 config 객체를 reducer 함수에 적용해
//enhanced reducer를 반환한다.
//whitelist: 유지하고 싶은 값을 배열로 전달한다.
//blacklist: 유지하고 싶지 않은 값을 배열로 전달한다.
//reducer : 어떠한 reducer가 들어갈 수 있지만, 보통은 combineReducers로부터 반환받은, 즉 하나로 합쳐진
//root Reducer를 값으로 넣어준다.
// const persistedReducer = persistReducer(persistConfig, reducers);

// const store = configureStore({
//   reducer: persistedReducer,
// });

// export default store;
