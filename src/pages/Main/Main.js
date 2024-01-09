import React, { useState, useEffect } from 'react';
import './Main.scss';
import liBoxImg from '../../assets/images/kiosk_credit_icon_in_left_box.png';
import gorayBab from '../../assets/images/item/고래밥.jpg';
import memberLevelImg from '../../assets/images/kiosk_credit_badge_icon.png';
const Main = () => {
  const [quantity, setQuantity] = useState([]);
  const [content, setContent] = useState('drink');

  const handleClickButton = name => {
    setContent(name);
  };

  return (
    <div className="container-main">
      {' '}
      <div className="kiosk-content-wrap">
        <div className="kiosk-left-wrap">
          <div>
            <div className="member-tag">무지개</div>
            <img
              className="member-level"
              src={memberLevelImg}
              alt="멤버 레벨"
            />
            <div className="member-name-wrap">
              <div className="hello-message">Hi, Tager!</div>
              <div className="member-name" style={{ marginBottom: '3vh' }}>
                조은혜
              </div>
            </div>

            <div className="member-info-wrap">
              <div className="member-info">
                <img
                  className="libox-img"
                  src={liBoxImg}
                  alt="list 옆 박스 이미지"
                />
                <span className="libox-text">부모님 성함</span>
              </div>
              <div className="member-info">
                <img
                  className="libox-img"
                  src={liBoxImg}
                  alt="list 옆 박스 이미지"
                />
                <span className="libox-text">010-1111-1111</span>
              </div>
              <div className="member-info">
                <img
                  className="libox-img"
                  src={liBoxImg}
                  alt="list 옆 박스 이미지"
                />
                <span className="libox-text">A1b2C3d4</span>
              </div>
            </div>
          </div>
        </div>
        <div className="kiosk-right-wrap">
          <div className="kiosk-button-wrap">
            <button
              className={
                content === 'drink' ? 'kiosk-button on' : 'kiosk-button off'
              }
              onClick={() => {
                handleClickButton('drink');
              }}
            >
              음료수
            </button>
            <button
              className={
                content === 'snack' ? 'kiosk-button on' : 'kiosk-button off'
              }
              onClick={() => {
                handleClickButton('snack');
              }}
            >
              과자
            </button>
            <button
              className={
                content === 'coffee' ? 'kiosk-button on' : 'kiosk-button off'
              }
              onClick={() => {
                handleClickButton('coffee');
              }}
            >
              커피
            </button>
          </div>
          <div className="kiosk-content">
            <div className="kiosk-scroll-area">
              {content === 'drink' && (
                <div className="kiosk-item-wrap">
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>{' '}
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>{' '}
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>{' '}
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                  <button className="kiosk-item-container">
                    <img
                      className="item-img"
                      src={gorayBab}
                      alt="상품 이미지"
                    />
                    <div className="item-name">고래밥</div>
                    <div className="item-price">2,000원</div>
                  </button>
                </div>
              )}
              {content === 'snack' && <div className="kiosk-item-wrap" />}
            </div>
            <div className="kiosk-purchase-wrap">
              <div className="purchase-scroll-area">
                <div className="purchase-item-container">
                  <button className="delete-item-button">아</button>
                  <div className="purchase-item-name">뽀로로 딸기</div>{' '}
                  <div className="purchase-item-button-wrap">
                    <button className="item-num-decrease-button">-</button>
                    <span className="item-num">20</span>
                    <button className="item-num-increase-button">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
