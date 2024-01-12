import React, { useState, useEffect } from 'react';
import './AdminPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../store/Feature/userSlice';

const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // 로그아웃 처리 로직을 구현합니다.
    // 로그아웃이 완료되면 로그인 페이지(`/login`)로 이동합니다.
    navigate('/');
  };
  return (
    <div className="container-admin">
      <div>어드민페이</div>
      <Link to="/">
        <button onclick={handleLogout}>얍</button>
      </Link>
    </div>
  );
};

export default AdminPage;
