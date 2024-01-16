import React, { useState, useEffect } from 'react';
import './AdminPage.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../store/Feature/userSlice';

const AdminPage = () => {
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [changeItemNum, setChangeItemNum] = useState([]);
  const [saveQuantity, setSaveQuantity] = useState([]);
  const [saveParameter, setSaveParameter] = useState([]);
  const urls = [`http://192.168.0.11:28095/creditsale/stock/request`];

  const handleQuantityChange = (index, value) => {
    const newSaveQuantity = [...saveQuantity];
    newSaveQuantity[index] = value;
    const newstockdata = [...stockData?.data[0]?.itemnumber];
    newstockdata[index] = stockData?.data[0]?.itemnumber[index];
    setSaveQuantity(newSaveQuantity);
    console.log('newstockdata', newstockdata);
    // setSaveParameter({ newstockdata: newSaveQuantity });
  };

  useEffect(() => {
    const fetchData = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(urls[i]);
          const responseData = response?.data;
          const responseTitle = responseData?.title;
          console.log('어드민인포!!!', responseData, responseTitle);
          if (responseData !== undefined) {
            if (responseTitle === 'stockinfo') {
              setStockData(responseData);
              setQuantity(responseData?.data[0]?.itemstock?.map(Number));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, [stockData]);

  // console.log('stockdata', stockData);
  // console.log('quantity', quantity);
  // console.log('saveQuantity', saveQuantity);

  // console.log('saveParameter', saveParameter);

  // 구매 요청을 위한 url 생성
  let quantityArr = [];
  //key 값이랑 value 값을 '/key/value' 형태로 연결한다.
  const sendArr3 = saveParameter => {
    for (const [key, value] of Object.entries(saveParameter)) {
      if (value !== undefined) {
        quantityArr.push(`/${stockData?.data[0]?.itemnumber[key]}/${value}`);
      }
    }
    return quantityArr;
  };

  const finalUrl = sendArr3(saveQuantity);
  let contacturl = 'http://192.168.0.11:28095/creditsale/stock';

  const getfinalUrl = finalUrl => {
    for (let i = 0; i < finalUrl.length; i++) {
      contacturl += finalUrl[i];
    }
    return contacturl;
  };

  const saveDataFetchUrl = getfinalUrl(finalUrl);
  console.log('마지막으로 요청보낼 url', saveDataFetchUrl);
  const saveButtonFunction = () => {
    const modifyFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(saveDataFetchUrl);
          const responseData = response?.data;
          const responseTitle = responseData?.title;
          console.log('통신한 답장', responseData);
          if (responseTitle === 'saveok') {
            console.log('전송 완료!!!!!', responseData);
          } else if (responseTitle === 'savefail') {
            console.log('error남');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    modifyFetchUrl();
  };

  // console.log('sendArr3', sendArr3(saveQuantity));

  const changeItemType = itemtype => {
    if (itemtype === 'drink') {
      return '음료';
    } else if (itemtype === 'coffee') {
      return '커피';
    } else if (itemtype === 'snack') {
      return '과자';
    } else return '기타';
  };

  const handleIncreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    newSaveQuantity[index] = (newSaveQuantity[index] || 0) + 1;
    setSaveQuantity(newSaveQuantity);
    // const updatedTotalPrices = [...totalPrices];
    // updatedTotalPrices[index] =
    //   (updatedTotalPrices[index] || 0) - historyInfo?.data[0]?.price[index];
    // setTotalPrices(updatedTotalPrices);
  };

  const handleDecreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    if (newSaveQuantity[index] && newSaveQuantity[index] > 0) {
      newSaveQuantity[index] -= 1;
      setSaveQuantity(newSaveQuantity);
      // const updatedTotalPrices = [...totalPrices];
      // updatedTotalPrices[index] =
      //   (updatedTotalPrices[index] || 0) - historyInfo?.data[0]?.price[index];
      // setTotalPrices(updatedTotalPrices);
    }
  };
  return (
    <div className="container-main">
      <div className="admin-content">
        {/* <div>어드민페이</div>
        <Link to="/">처음으로</Link> */}
        <Link to="/">
          <button className="buttonhome-admin" />
        </Link>

        <div className="admin-inner-all-wrap">
          <div className="admin-inner-wrap">
            <div className="admin-title-wrap">
              <div
                className="admin-title"
                style={{ marginRight: '5vh', paddingLeft: '5vh' }}
              >
                {' '}
                <div className="admin-item hour">품명</div>
                <div className="admin-item name">이름</div>
                <div className="admin-item num">수량</div>
              </div>
              <div className="admin-title">
                {' '}
                <div className="admin-item hour">품명</div>
                <div className="admin-item name">이름</div>
                <div className="admin-item num">수량</div>
              </div>
            </div>
            <div>
              <div className="admin-content-wrap">
                {stockData?.data[0]?.itemname?.map((product, i) => (
                  <div className="admininfo-list" key={i}>
                    <span className="admininfo-item hour">
                      {changeItemType(stockData?.data[0]?.itemtype[i])}
                    </span>
                    <span className="admininfo-item name">
                      {stockData?.data[0]?.itemname[i]}
                    </span>
                    <div className="admininfo-item num">
                      <button
                        className="admininfo-button decrease"
                        onClick={() => handleDecreaseQuantity(i)}
                      />
                      <input
                        className="num-button-input increase"
                        type="number"
                        min="0"
                        placeholder={quantity[i]}
                        value={saveQuantity[i] || ''}
                        onChange={e => handleQuantityChange(i, e.target.value)}
                      />
                      <button
                        className="admininfo-button increase"
                        onClick={() => handleIncreaseQuantity(i)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="save-button"
              onClick={() => saveButtonFunction()}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
