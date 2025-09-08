import React, { lazy, useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';
import LoginPage from './pages/Main/Admin/LoginPage/LoginPage';
import AdminPage from './pages/Main/Admin/AdminPage/AdminPage';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsLoggedIn } from './store/Feature/userSlice';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
