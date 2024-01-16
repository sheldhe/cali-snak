import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuantityControl.scss';

const QuantityControl = ({ allItemsData }) => {
  //91658867
  const [historyInfo, setHistoryInfo] = useState(null);
  const [remainItemNum, setRemainItemNum] = useState(null);
  const [quantity, setQuantity] = useState([]);
  const [modifiedQuantity, setModifiedQuantity] = useState([]);
  const [saveQuantity, setSaveQuantity] = useState([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [saveOK, setSaveOk] = useState(null);
  const [itemnum, setItemNum] = useState(null);
  const [modifyModal, setModifyModal] = useState(false);
  const [modifyFailModal, setModifyFailModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [delteFailModal, setDeleteFailModal] = useState(false);

  const modalBackground = useRef();

  const urls = [`http://192.168.0.11:28095/creditsale/history/request`];

  //삭제 기능 구현
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
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };
    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, [historyInfo, saveOK]);

  const findSameIndexes = (historyInfo, allItemsData) => {
    return historyInfo?.data[0]?.itemname?.map(selecteditem => {
      return allItemsData?.data[0]?.item?.itemname.indexOf(selecteditem);
    });
  };
  //담겨저 있는 리스트에서 전체 리스트의 index를 구한다. -> 성공 [2,17,8,9] 이런식으로 나옴
  const matchingIndexes = findSameIndexes(historyInfo, allItemsData);

  console.log('matchingIndexes', matchingIndexes);
  // console.log('quantity', quantity);

  let pricearrrr = [];
  const initialTotalPrices = (allItemsData, matchingIndexes) => {
    for (let i = 0; i < matchingIndexes?.length; i++) {
      pricearrrr.push(
        Number(allItemsData?.data[0]?.item?.itemprice[matchingIndexes[i]]),
      );
    }
    return pricearrrr;
  };

  // console.log('언제나와', initialTotalPrices(allItemsData, matchingIndexes));
  const priceitemarr = initialTotalPrices(allItemsData, matchingIndexes);
  console.log('priceitemarr', priceitemarr);

  let listarr6 = [];
  const makePriceArr = (matchingIndexes, allItemsData) => {
    for (let i = 0; i < allItemsData.length; i++) {
      listarr6.push(allItemsData.data[0].item.itemprice[matchingIndexes[i]]);
    }
    return listarr6;
  };

  const result = makePriceArr(matchingIndexes, allItemsData);

  console.log('listarr임!!', makePriceArr(matchingIndexes, allItemsData));
  console.log('historyinfo', historyInfo);

  // console.log('resultt!!!', makePriceArr(matchingIndexes, allItemsData));
  const handleQuantityChange = (index, value) => {
    const newSaveQuantity = [...saveQuantity];
    newSaveQuantity[index] = value;
    setSaveQuantity(newSaveQuantity);
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

  console.log('savequantity', saveQuantity);
  console.log('saveok', saveOK);

  const handleModify2 = index => {
    const seq = historyInfo?.data[0]?.seq[index];
    const modifiedQuantity = saveQuantity[index];

    const modifyurl =
      'http://192.168.0.11:28095/creditsale/history/update/' +
      seq +
      '/' +
      modifiedQuantity;
    console.log('수정 요청 보낼 url', modifyurl);

    const modifyFetchUrl = async () => {
      for (let i = 0; i < urls.length; i++) {
        try {
          const response = await axios.get(modifyurl);
          const responseData = response?.data;
          const responseStatus = responseData?.status;
          const responseLength = responseData?.length;
          const responseTitle = responseData?.title;
          console.log('통신 완료!!!!!', responseData);
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
  // const calculateTotalPrice = () => {
  //   if (!totalPrices || totalPrices.length === 0) {
  //     return 0;
  //   }
  //   const total =
  //     initialTotal + totalPrices.reduce((total, price) => total + price, 0);
  //   return total;
  // };

  // creditsale/history/update/seq/수량(변경)

  let answer = 0;
  const totalprice = (priceitemarr, quantity) => {
    for (let i = 0; i < priceitemarr.length; i++) {
      answer += pricearrrr[i] * quantity[i];
    }
    return answer;
  };

  const answer3 = totalprice(priceitemarr, quantity);

  console.log('answer3', answer3);

  return (
    <div className="kiosk-content">
      <div className="quantity-content">
        {historyInfo?.data[0]?.itemname[0] === 'No data' ? (
          ' '
        ) : (
          <>
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
                      placeholder={quantity[i]}
                      value={saveQuantity[i] || ''}
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
              <strong className="total-title">총 금액</strong>
              <span className="total-result">{answer3}원</span>
            </li>
          </>
        )}
      </div>

      {modifyModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap">수정이 완료되었습니다.</div>
          </div>
        </div>
      )}
      {/* {deleteModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap">삭제가 완료되었습니다.</div>
          </div>
        </div>
      )} */}
      {modifyFailModal && (
        <div className="modal-container">
          <div className="purchase-result-modal-container">
            <div className="purchase-finish-wrap">수정에 실패하였습니다.</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantityControl;
