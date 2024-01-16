import React, { useState, useEffect } from 'react';
import './Main.scss';
import axios, { all } from 'axios';
import liBoxImg from '../../assets/images/kiosk_credit_icon_in_left_box.png';
import memberLevelImg from '../../assets/images/kiosk_credit_badge_icon.png';
import KioskPage from '../Main/KioskPage/KioskPage';
import WaitingPage from '../Main/WaitingPage/WaitingPage';

const Main = () => {
  const [step, setStep] = useState('readypage');
  const [allItemsData, setAllItemsData] = useState(null);
  const [norentalModal, setNoRentalModal] = useState(false);

  console.log(step, '현재 화면 페이지');

  const urls = [`http://192.168.0.11:28095/creditsale/sell/request`];

  useEffect(() => {
    const fetchData = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(urls[i]);
          const responseData = response?.data;
          const responseStatus = responseData?.status;
          const responseLength = responseData?.length;
          const responseTitle = responseData?.title;

          console.log('이거봐요!!!', responseData, responseTitle);

          if (responseData !== undefined) {
            if (responseTitle === 'userinfo') {
              setStep('kioskpage');
              setAllItemsData(responseData);
            } else if (responseTitle === 'norentalid') {
              setNoRentalModal(true);
              setTimeout(() => {
                setNoRentalModal(false);
              }, 3000);
            }
          }
        } catch (error) {
          console.error('Error fetching dajta:', error);
        }
      }
    };

    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, []);

  return (
    <div>
      {step === 'readypage' && <WaitingPage />}
      {step === 'kioskpage' && (
        <KioskPage setStep={setStep} allItemsData={allItemsData} />
      )}
      {norentalModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap">
              등록되지 않은 태그입니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
