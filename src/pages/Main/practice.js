import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './QuantityControl.scss';

const QuantityControl = () => {
  const [historyInfo, setHistoryInfo] = useState(null);
  const [remainItemNum, setRemainItemNum] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [modifiedQuantity, setModifiedQuantity] = useState([]);
  const [saveQuantity, setSaveQuantity] = useState([]);
  const [totalPrices, setTotalPrices] = useState([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const modalBackground = useRef();
  const urls = [`/data/historydata.json`];

  const handleDelete = (clickseq, clickitemnum) => {
    let url = `http://192.168.0.11:28095/creditsale/history/delete`;
    let newUrl = url + '/' + clickseq + '/' + clickitemnum;
    console.log('삭제 요청newUrl!!!!!!!', newUrl);
    const deleteFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(newUrl);
          const responseData = response?.data;
          const responseStatus = responseData?.status;
          const responseLength = responseData?.length;
          const responseTitle = responseData?.title;
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    deleteFetchUrl();
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

          console.log('히스토리인포!!!', responseData, responseTitle);

          if (responseData !== undefined) {
            if (responseTitle === 'historyinfo') {
              setHistoryInfo(responseData);
              setQuantity(responseData?.data[0]?.itemquentity.map(Number));

              const initialTotalPrices = responseData.data[0].itemquentity.map(
                (quantity, index) => {
                  return quantity * responseData.data[0].price[index];
                },
              );

              // 초기 총합 계산
              const initialTotal = initialTotalPrices.reduce(
                (total, price) => total + price,
                0,
              );

              setTotalPrices(initialTotalPrices);
              setInitialTotal(initialTotal);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, [historyInfo]);

  // useEffect(() => {
  //   const updatedTotal = totalPrices.reduce((total, price) => total + price, 0);
  //   setTotal(updatedTotal);
  // }, [totalPrices, saveQuantity]);

  const handleModify = index => {
    setModifiedQuantity([...quantity]);
    setRemainItemNum(
      historyInfo?.data[0]?.seq[index],
      historyInfo?.data[0]?.itemquentity[index],
    );
  };

  const handleQuantityChange = (index, value) => {
    const newSaveQuantity = [...saveQuantity];
    newSaveQuantity[index] = value;
    setSaveQuantity(newSaveQuantity);
  };

  const handleIncreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    newSaveQuantity[index] = (newSaveQuantity[index] || 0) + 1;
    setSaveQuantity(newSaveQuantity);

    const updatedTotalPrices = [...totalPrices];
    updatedTotalPrices[index] =
      (updatedTotalPrices[index] || 0) - historyInfo?.data[0]?.price[index];
    setTotalPrices(updatedTotalPrices);
  };

  const handleDecreaseQuantity = index => {
    const newSaveQuantity = [...saveQuantity];
    if (newSaveQuantity[index] && newSaveQuantity[index] > 0) {
      newSaveQuantity[index] -= 1;
      setSaveQuantity(newSaveQuantity);

      const updatedTotalPrices = [...totalPrices];
      updatedTotalPrices[index] =
        (updatedTotalPrices[index] || 0) - historyInfo?.data[0]?.price[index];
      setTotalPrices(updatedTotalPrices);
    }
  };

  console.log('savequantity', saveQuantity);

  const handleModify2 = index => {
    const seq = historyInfo?.data[0]?.seq[index];
    const modifiedQuantity = saveQuantity[index];
    console.log('콘솔 나와요!!!', seq, modifiedQuantity);
  };

  const calculateTotalPrice = () => {
    if (!totalPrices || totalPrices.length === 0) {
      return 0;
    }
    const total =
      initialTotal + totalPrices.reduce((total, price) => total + price, 0);
    return total;
  };

  return (
    <div className="kiosk-content">
      <div className="quantity-content">
        <div className="quantity-title-wrap">
          <div className="historyinfo-title hour">시간</div>
          <div className="historyinfo-title name">이름</div>
          <div className="historyinfo-title num">수량</div>
          <div className="historyinfo-title button">버튼</div>
        </div>
        <ul>
          {historyInfo?.data[0]?.seq.map((product, i) => (
            <li className="historyinfo-list" key={i}>
              <div className="historyinfo-item hour">
                {historyInfo?.data[0]?.regdate[i]}
              </div>
              <div className="historyinfo-item name">
                {historyInfo?.data[0]?.itemname[i]}
              </div>
              <div className="historyinfo-item num">
                <button
                  className="quantity-button"
                  onClick={() => handleDecreaseQuantity(i)}
                >
                  -
                </button>
                <input
                  className="num-button-input"
                  type="number"
                  min="0"
                  placeholder={quantity[i]}
                  value={saveQuantity[i] || ''}
                  onChange={e => handleQuantityChange(i, e.target.value)}
                />
                <button
                  className="quantity-button"
                  onClick={() => handleIncreaseQuantity(i)}
                >
                  +
                </button>
              </div>
              <div className="historyinfo-item button">
                <button
                  className="history-change-button"
                  style={{ marginRight: '1vh' }}
                  onClick={() => handleModify2(i)}
                >
                  수정
                </button>
                <button
                  className="history-change-button"
                  onClick={() =>
                    handleDelete(
                      historyInfo?.data[0]?.seq[i],
                      historyInfo?.data[0]?.itemquentity[i],
                    )
                  }
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
        <li className="historyinfo-result">
          <strong>총 합계 가격:</strong> <span>{calculateTotalPrice()}원</span>
        </li>
      </div>
    </div>
  );
};

export default QuantityControl;
