import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuantityControl.scss';
import { check } from 'prettier';

const QuantityControl = ({ allItemsData }) => {
  //91658867
  const [historyInfo, setHistoryInfo] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [saveOK, setSaveOk] = useState(null);
  const [modifyModal, setModifyModal] = useState(false);
  const [modifyFailModal, setModifyFailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [checkquantity, setCheckQuantity] = useState([]);
  const [totalquantity, setTotalQuantity] = useState(null);

  const urls = [`http://192.168.0.1:28095/creditsale/history/request`];

  useEffect(() => {
    const fetchData = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(urls[i]);
          const responseData = response?.data;
          const responseTitle = responseData?.title;
          console.log('히스토리인포!!!', responseData, responseTitle);

          if (responseData !== undefined) {
            if (responseTitle === 'historyinfo') {
              setHistoryInfo(responseData);
              setQuantity(responseData?.data[0]?.itemquentity.map(Number));
              setCheckQuantity(responseData?.data[0]?.itemquentity.map(Number));
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    fetchData();
  }, [modifyModal, modifyFailModal, deleteModal]);

  //상품 가격을 구하기
  //1.1. 담겨저 있는 리스트에서 전체 리스트의 index를 구한다. -> 성공 [2,17,8,9] 이런식으로 나옴
  const findSameIndexes = (historyInfo, allItemsData) => {
    return historyInfo?.data[0]?.itemname?.map(selecteditem => {
      return allItemsData?.data[0]?.item?.itemname.indexOf(selecteditem);
    });
  };

  const matchingIndexes = findSameIndexes(historyInfo, allItemsData);
  console.log('matchingIndexes', matchingIndexes);

  //1.2.가격 배열을 구한다. allitems에서 matchingindexes 해당하는 것 꺼내오기
  let pricearrrr = [];
  const initialTotalPrices = (allItemsData, matchingIndexes) => {
    for (let i = 0; i < matchingIndexes?.length; i++) {
      pricearrrr.push(
        Number(allItemsData?.data[0]?.item?.itemprice[matchingIndexes[i]]),
      );
    }
    return pricearrrr;
  };

  //1.3. 최종 가격 배열
  const priceitemarr = initialTotalPrices(allItemsData, matchingIndexes);
  console.log('priceitemarr', priceitemarr);

  //값 변화하는 것 체크하는 handle 함수
  const handleQuantityChange = (index, value) => {
    const newCheckQuantity = [...checkquantity];
    if (newCheckQuantity[index] !== parseInt(value, 10)) {
      newCheckQuantity[index] = value;
      setCheckQuantity(newCheckQuantity);
    }
  };

  //수량 늘리기
  const handleIncreaseQuantity = index => {
    const newCheckQuantity = [...checkquantity];
    newCheckQuantity[index] = (parseInt(newCheckQuantity[index], 10) || 0) + 1;
    setCheckQuantity(newCheckQuantity);
  };

  //수량 줄이기
  const handleDecreaseQuantity = index => {
    const newCheckQuantity = [...checkquantity];
    if (parseInt(newCheckQuantity[index], 10) > 0) {
      newCheckQuantity[index] = parseInt(newCheckQuantity[index], 10) - 1;
      setCheckQuantity(newCheckQuantity);
    }
  };

  // console.log('savequantity', saveQuantity);
  console.log('checkquantity', checkquantity);

  //수정 기능
  const handleModify = index => {
    const seq = historyInfo?.data[0]?.seq[index];
    const modifiedQuantity = checkquantity[index];

    const modifyurl =
      'http://192.168.0.1:28095/creditsale/history/update/' +
      seq +
      '/' +
      modifiedQuantity;
    console.log('수정 요청 보낼 url', modifyurl);

    const modifyFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(modifyurl);
          const responseData = response?.data;
          const responseTitle = responseData?.title;
          if (responseTitle === 'saveok') {
            console.log('수정이 완료되었습니다!!!');
            setSaveOk(responseTitle);
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

  //삭제 기능
  const handleDelete = (clickseq, clickitemnum) => {
    let url = `http://192.168.0.1:28095/creditsale/history/delete`;
    let newUrl = url + '/' + clickseq + '/' + clickitemnum;
    console.log('삭제 요청newUrl!!!!!!!', newUrl);
    const deleteFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(newUrl);
          const responseData = response?.data;
          const responseTitle = responseData?.title;

          if (responseTitle === 'saveok') {
            setDeleteModal(true);
            setTimeout(() => {
              setDeleteModal(false);
            }, 2000);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    deleteFetchUrl();
  };

  //전체 금액 합
  let answer = 0;
  const totalprice = (priceitemarr, quantity) => {
    for (let i = 0; i < priceitemarr.length; i++) {
      answer += pricearrrr[i] * quantity[i];
    }
    return answer;
  };

  // console.log(quantity, 'quantity');

  const totalPriceNum = totalprice(priceitemarr, quantity);
  return (
    <div className="kiosk-content">
      <div className="quantity-content">
        {historyInfo?.data[0]?.itemname[0] === 'No data' ? (
          <div className="no-purchase-history">구매 내역이 없습니다.</div>
        ) : (
          <>
            <div className="history-info-message">
              {' '}
              *개수를 바꿀 때 개수 조정 후{' '}
              <strong>해당 칸의 '수정' 버튼을 눌러주세요. </strong>
              여러 상품 개수를 바꿀 때도 상품마다{' '}
              <strong>해당 칸에 있는 수정버튼</strong>을 눌러줘야 합니다.
            </div>
            <div className="quantity-title-wrap">
              <div className="historyinfo-title hour">시간</div>
              <div className="historyinfo-title name">이름</div>
              <div className="historyinfo-title price">가격</div>
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
                  <div className="historyinfo-item price">
                    {priceitemarr[i]}
                  </div>
                  <div className="historyinfo-item num">
                    <button
                      className="quantity-button decrease"
                      onClick={() => handleDecreaseQuantity(i)}
                    />
                    <input
                      className="num-button-input"
                      type="number"
                      min="0"
                      // placeholder={quantity[i]}
                      value={checkquantity[i] || 0}
                      onChange={e => handleQuantityChange(i, e.target.value)}
                    />
                    <button
                      className="quantity-button increase"
                      onClick={() => handleIncreaseQuantity(i)}
                    />
                  </div>
                  <div className="historyinfo-item button">
                    <button
                      className="history-change-button"
                      style={{ marginRight: '1vh' }}
                      onClick={() => handleModify(i)}
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
              <strong className="total-title">총 금액</strong>
              <span className="total-result">{totalPriceNum}원</span>
            </li>
          </>
        )}
      </div>

      {modifyModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap modify-success">
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
            <div className="purchase-finish-wrap modify-fail">
              {' '}
              <button
                className="purchase-finish-close-button"
                onClick={() => setModifyFailModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap2 delete-success">
              삭제에 성공하였습니다.
              <button
                className="purchase-finish-close-button"
                onClick={() => setDeleteModal(false)}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityControl;
