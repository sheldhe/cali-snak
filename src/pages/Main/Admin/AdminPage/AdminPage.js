import React, { useState, useEffect } from 'react';
import './AdminPage.scss';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../../store/Feature/userSlice';
import { check } from 'prettier';

const AdminPage = () => {
  const [stockData, setStockData] = useState(null);
  const [saveQuantity, setSaveQuantity] = useState([]);
  const [modifyModal, setModifyModal] = useState(false);
  const [modifyFailModal, setModifyFailModal] = useState(false);
  const [paraQuantity, setParaQuantity] = useState([]);

  const urls = [`http://192.168.0.1:28095/creditsale/stock/request`];
  // admin id pw admin, 91658867
  // const urls = ['data/stock.json'];

  //'저장'을 눌렀을 때 개수가 바뀐 아이템과 그 개수를 파라미터로 붙여 요청해야한다.(saveStockFetchUrl 부분)
  //받아온 전체 데이터를 stockdata에 저장, 그 중에서 재고 수량을 quantity에 저장한다.

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
              setSaveQuantity(responseData?.data[0]?.itemstock?.map(Number));
              setParaQuantity(responseData?.data[0]?.itemstock?.map(Number));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, []);

  // console.log('stockdata', stockData);
  // console.log('quantity', quantity);
  // console.log('saveQuantity', saveQuantity);
  // console.log('saveParameter', saveParameter);

  //input onchange 이벤트를 감지한다.
  const handleQuantityChange = (index, value) => {
    const newSaveQuantity = [...saveQuantity];
    const newParaQuantity = [...paraQuantity];

    if (newSaveQuantity[index] !== parseInt(value, 10)) {
      newSaveQuantity[index] = value;
      newParaQuantity[index] = { index, value: parseInt(value, 10) || 0 };
      setSaveQuantity(newSaveQuantity);
      setParaQuantity(newParaQuantity);
    }
  };
  const handleIncreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    const newParaQuantity = [...paraQuantity];

    newSaveQuantity[index] = (parseInt(newSaveQuantity[index], 10) || 0) + 1;
    if (newParaQuantity[index]?.value !== newSaveQuantity[index]) {
      newParaQuantity[index] = { index, value: newSaveQuantity[index] };
      setParaQuantity(newParaQuantity);
    }
    setSaveQuantity(newSaveQuantity);
  };

  const handleDecreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    const newParaQuantity = [...paraQuantity];

    //10진법으로 바꿨을때 존재하면
    //10진법으로 바꾼 것
    if (parseInt(newSaveQuantity[index], 10) > 0) {
      newSaveQuantity[index] = parseInt(newSaveQuantity[index], 10) - 1;
      if (newParaQuantity[index]?.value !== newSaveQuantity[index]) {
        newParaQuantity[index] = { index, value: newSaveQuantity[index] };
        setParaQuantity(newParaQuantity);
      }
      setSaveQuantity(newSaveQuantity);
    }
  };

  const filteredParaQuantity = paraQuantity.filter(
    item => typeof item === 'object' && item !== null,
  );

  const formattedParaQuantity = filteredParaQuantity.reduce((acc, curr) => {
    return `${acc}${stockData?.data[0]?.itemnumber[curr.index]}/${curr.value}/`;
  }, '');

  // ${stockData?.data[0]?.itemnumber[key]}
  //getfinalUrl : 값 저장해서 보내는 최종 url
  //=>'재고seq이름 /재고수'를 파라미터로 뒤에 붙인다.
  let contacturl = 'http://192.168.0.1:28095/creditsale/stock/';
  const getfinalUrl = contacturl + formattedParaQuantity;

  console.log('getfinalUrl2', getfinalUrl);

  const saveButtonFunction = () => {
    const modifyFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(getfinalUrl);
          const responseData = response?.data;
          const responseTitle = responseData?.title;
          console.log('통신한 답장', responseData);
          if (responseTitle === 'saveok') {
            setModifyModal(true);
            setTimeout(() => {
              setModifyModal(false);
            }, 2000);
          } else if (responseTitle === 'savefail') {
            setModifyFailModal(true);
            setTimeout(() => {
              setModifyFailModal(false);
            }, 2000);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    modifyFetchUrl();
  };

  const changeItemType = itemtype => {
    if (itemtype === 'drink') {
      return '음료';
    } else if (itemtype === 'coffee') {
      return '커피';
    } else if (itemtype === 'snack') {
      return '과자';
    } else return '기타';
  };

  return (
    <div className="container-main">
      <div className="admin-content">
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
                        value={saveQuantity[i] || 0}
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
      {modifyModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap2 modify-finish">
              수정이 완료되었습니다.
              <button
                className="purchase-finish-close-button"
                onClick={() => setModifyModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      {modifyFailModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap2 modify-fail">
              수정에 실패하였습니다.
              <button
                className="purchase-finish-close-button"
                onClick={() => setModifyFailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}{' '}
    </div>
  );
};

export default AdminPage;
