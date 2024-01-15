import React, { useState, useEffect } from 'react';
import './AdminPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../store/Feature/userSlice';

const AdminPage = () => {
  return (
    <div className="container-admin">
      <div>어드민페이</div>
      <Link to="/">처음으로</Link>
    </div>
  );
};

export default AdminPage;
