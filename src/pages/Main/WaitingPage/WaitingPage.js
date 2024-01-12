import React from 'react';
import { Link } from 'react-router-dom';
import './WaitingPage.scss';
import axios from 'axios';
import WaitingPageAdmin from '../../../assets/images/ReadyPage/kiosk_credit_main_admin_bottom.png';

const WaitingPage = ({ isUserLoggedIn }) => {
  return (
    <div className="container-main waiting">
      <Link to={isUserLoggedIn ? 'admin' : 'login'}>
        <img
          className="admin-page-logo"
          src={WaitingPageAdmin}
          alt="관리자 페이지 로고"
        />
      </Link>
      <div className="ask-tag-message">구매를 위해 태그해주세요</div>
    </div>
  );
};

export default WaitingPage;
