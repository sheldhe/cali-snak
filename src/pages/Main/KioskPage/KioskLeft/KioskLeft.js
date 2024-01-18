import React, { useState, useEffect } from 'react';
import './KioskLeft.scss';
import { Link, useNavigate } from 'react-router-dom';
import liBoxImg from '../../../../assets/images/kiosk_credit_icon_in_left_box.png';
import memberLevelImg from '../../../../assets/images/kiosk_credit_badge_icon.png';
import { AnimatePresence, motion } from 'framer-motion';

const KioskLeft = ({ allItemsData }) => {
  const [modifyModal, setModifyModal] = useState(false);
  return (
    <div className="kiosk-left-wrap">
      <div>
        <div className="member-tag">
          <motion.img
            className="member-level"
            src={memberLevelImg}
            alt="멤버 레벨"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.3,
              ease: 'easeInOut',
            }}
          />
        </div>
        <div className="member-name-wrap">
          <div className="hello-message">Hi, Tager!</div>
          <div className="member-name">{allItemsData?.data[0]?.username}</div>
          <div className="member-tag-number">
            {allItemsData?.data[0]?.tagvalue}
          </div>
        </div>

        <div className="member-info-wrap">
          <div className="member-info">
            <img
              className="libox-img"
              src={liBoxImg}
              alt="list 옆 박스 이미지"
            />
            <span className="libox-text">
              {' '}
              부모님 이름 : {allItemsData?.data[0]?.parentname}
            </span>
          </div>
          <div className="member-info">
            <img
              className="libox-img"
              src={liBoxImg}
              alt="list 옆 박스 이미지"
            />
            <span className="libox-text">
              {' '}
              전화번호 : {allItemsData?.data[0]?.phonenumber.slice(0, 3)}-
              {allItemsData?.data[0]?.phonenumber.slice(3, 7)} -
              {allItemsData?.data[0]?.phonenumber.slice(
                7,
                allItemsData?.data[0]?.phonenumber.length,
              )}
            </span>
          </div>
        </div>
      </div>
      {modifyModal && <div> 모달있다 </div>}
    </div>
  );
};

export default KioskLeft;
