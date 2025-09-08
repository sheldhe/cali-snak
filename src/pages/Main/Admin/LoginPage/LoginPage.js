import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './LoginPage.scss';
import { login } from '../../../../store/Feature/userSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginAlert, setLoginAlert] = useState('');
  const [userValue, setUserValue] = useState({
    username: '',
    password: '',
  });

  const getUserInfo = e => {
    const { name, value } = e.target;
    setUserValue({ ...userValue, [name]: value });
  };

  //로그인 버튼을 누르면 나타날 이벤트와 관련된 함수
  const handleLogin = e => {
    e.preventDefault();
    fetch(
      `http://192.168.0.1:28095/creditsale/login/${userValue.username}/${userValue.password}`,
    )
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.data[0].result === 'true') {
          console.log('로그인 성공!');
          dispatch(login({ username: userValue.username }));
          navigate('/admin');
        } else {
          console.log('실패');
          setLoginAlert('아이디 / 비밀번호를 다시 확인해주세요.');
        }
      })
      .catch(error => {
        console.log('로그인 요청 실패:', error);
        setLoginAlert('로그인 요청에 실패했습니다.');
      });
  };

  return (
    <div className="container-login">
      <h1> CALICLUB KIOSK </h1>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="user-input"
          type="text"
          name="username"
          placeholder="사용자 이름을 입력하세요."
          minLength="5"
          maxLength="30"
          title="사용자 이름 입력"
          onChange={getUserInfo}
          value={userValue.username}
        />
        <input
          className="user-input"
          type="password"
          name="password"
          placeholder="비밀번호를 입력하세요."
          maxLength="30"
          title="비밀번호입력"
          autoComplete="off"
          onChange={getUserInfo}
          value={userValue.password}
        />
        <div className="login-alert">{loginAlert}</div>
        <Link to="/">
          {' '}
          <button className="login-button" style={{ marginRight: '1vh' }}>
            처음으로
          </button>
        </Link>
        <button className="login-button" type="submit">
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
