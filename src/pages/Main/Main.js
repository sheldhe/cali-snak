import React, { useState, useEffect } from 'react';
import './Main.scss';
import axios, { all } from 'axios';
import liBoxImg from '../../assets/images/kiosk_credit_icon_in_left_box.png';
import memberLevelImg from '../../assets/images/kiosk_credit_badge_icon.png';
import KioskPage from '../Main/KioskPage/KioskPage';
import WaitingPage from '../Main/WaitingPage/WaitingPage';

const Main = ({ isUserLoggedIn }) => {
  const [step, setStep] = useState('readypage');
  const [allItemsData, setAllItemsData] = useState(null);

  console.log(step, '현재 화면 페이지');

  const urls = [`http://192.168.0.11:28095/creditsale/sell/request`];

  const fetchDataFromUrls = async () => {
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await axios.get(urls[i]);
        const responseData = response?.data;
        const responseStatus = responseData?.status;
        const responseLength = responseData?.length;
        const responseTitle = responseData?.title;

        // console.log('이거봐요!!!', responseData, responseTitle);

        if (responseData !== undefined) {
          if (responseTitle === 'userinfo') {
            setStep('kioskpage');
            setAllItemsData(responseData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

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
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, []);

  return (
    <div>
      {step === 'readypage' && <WaitingPage isUserLoggedIn={isUserLoggedIn} />}
      {step === 'kioskpage' && (
        <KioskPage setStep={setStep} allItemsData={allItemsData} />
      )}
    </div>
  );
};

export default Main;
