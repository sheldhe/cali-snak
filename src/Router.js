import React, { lazy, useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';
import LoginPage from './pages/Main/Admin/LoginPage/LoginPage';
import AdminPage from './pages/Main/Admin/AdminPage/AdminPage';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn } from './store/Feature/userSlice';

const Router = () => {
  const dispatch = useDispatch();
  const isUserLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    // 새로고침 시에 토큰을 검사하여 로그인 상태를 설정합니다.
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 토큰을 가져옵니다.
    if (token) {
      dispatch(selectIsLoggedIn(true));
    }
  }, [dispatch]);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main isUserLoggedIn={isUserLoggedIn} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
