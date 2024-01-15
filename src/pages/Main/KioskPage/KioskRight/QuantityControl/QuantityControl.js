import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuantityControl.scss';

const QuantityControl = () => {
  const [historyInfo, setHistoryInfo] = useState(null);
  const [modifyModal, setModifyModal] = useState(false);
  const [remainItemNum, setRemainItemNum] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [saveNewQuantity, setSaveNewQuantity] = useState([...quantity]);
  const modalBackground = useRef();
  const urls = [`http://192.168.0.11:28095/creditsale/history/request`];

  // const decreaseQuantity = index => {
  //   const updatedQuantity = [...saveNewQuantity];
  //   let arr = [];

  //   for (let i = 0; i < updatedQuantity.length; i++) {
  //     arr.push(Number(updatedQuantity[i]));
  //   }
  //   if (arr[index] > 0) {
  //     arr[index] -= 1;
  //     console.log('줄어드나볼까?', arr);
  //     setSaveNewQuantity(arr);
  //   }
  // };

  const increaseQuantity = index => {
    const updatedQuantity = [...quantity];
    let newArr = updatedQuantity.map(Number);
    newArr[index] += 1;
    setQuantity(newArr);
    setSaveNewQuantity(newArr);
  };

  // const increaseQuantity = index => {
  //   const updatedQuantity = [...quantity];
  //   let arr = [];

  //   for (let i = 0; i < updatedQuantity.length; i++) {
  //     arr.push(Number(updatedQuantity[i]));
  //   }
  //   if (arr[index] > 0) {
  //     arr[index] += 1;
  //     console.log('늘어나라?', arr);
  //     setSaveNewQuantity(...arr);
  //   }
  // };
  //삭제 기능 구현현
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
              setQuantity(responseData?.data[0]?.itemquentity);
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

  const ItemModifyButton = i => {
    setRemainItemNum(
      historyInfo?.data[0]?.seq[i],
      historyInfo?.data[0]?.itemquentity[i],
    );
  };
  // creditsale/history/update/seq/수량(변경)

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
                  className="num-button decrease"
                  // onClick={() => decreaseQuantity(i)}
                >
                  -
                </button>
                <input
                  className="num-button-input"
                  type="number"
                  min="0"
                  placeholder={
                    saveNewQuantity ? saveNewQuantity[i] : Number(quantity[i])
                  }
                />
                <button
                  className="num-button increase"
                  onClick={() => increaseQuantity(i)}
                >
                  +
                </button>
              </div>
              <div className="historyinfo-item button">
                <button
                  className="history-change-button"
                  style={{ marginRight: '1vh' }}
                  onClick={() =>
                    ItemModifyButton(historyInfo?.data[0]?.itemquentity[i])
                  }
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
          <strong>총 합계</strong> <span> 총 합계</span>
        </li>
      </div>
      {/* {modifyModal && (
        <div className="quantity-modal-container">
          <div
            className="quantity-modify-modal"
            ref={modalBackground}
            onClick={e => {
              if (e.target === modalBackground.current) {
                setModifyModal(false);
              }
            }}
          >
            <div className="quantity-modal-content">
              <button
                className="quantity-modal-close"
                onClick={() => {
                  setModifyModal(false);
                }}
              >
                x
              </button>
              <form className="quantity-form">
                <input
                  className="quantity-input"
                  type="text"
                  placeholder={remainItemNum[1]}
                />
                개로 수정하기
              </form>
              <button className="quantity-modify-button">확인</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuantityControl;
