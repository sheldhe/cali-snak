import React, { useState, useEffect } from 'react';
import './Main.scss';
import axios from 'axios';
import liBoxImg from '../../assets/images/kiosk_credit_icon_in_left_box.png';
import memberLevelImg from '../../assets/images/kiosk_credit_badge_icon.png';

const Main = () => {
  const [content, setContent] = useState('drink');
  //전체 상품 데이터를 저장한다.
  const [allItemsData, setAllItemsData] = useState(null);
  //선택된 상품의 itemcode를 저장한다.
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [matchingIndexes2, setMatchingIndexes2] = useState([]);
  const [quantity, setQuantity] = useState([]);

  // 화면 구분 : 음료수, 과자, 커피
  const handleClickButton = name => {
    setContent(name);
  };
  const urls = [`http://192.168.0.11:28095/creditsale/sell/request`];
  // const urls = [`data/data.json`];

  const fetchDataFromUrls = async () => {
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await axios.get(urls[i]);
        const responseData = response?.data;
        const responseStatus = responseData?.status;
        const responseLength = responseData?.length;
        const responseTitle = responseData?.title;

        if (i === 0) {
          console.log(responseData);
        }
        if (responseData !== undefined) {
          if (responseTitle === 'userinfo') {
            setAllItemsData(responseData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  useEffect(() => {
    fetchDataFromUrls();
  }, []);

  // 1. 구매하고 싶은 아이템을 클릭한다.
  // 2. itemnumber를 찾아 index를 구한다.
  // 3.1. 중복되는 index가 없을 경우 - 이 index로 새로운 리스트를 만든다.
  // 3.2. index가 중복된 경우 - 개수를 늘려준다.

  const handleItemClick = itemcode => {
    //1.1 기존에 저장한 selecteditems를 가져온다. [0004,0005] 이렇게
    const updatedSelectedItems = [...selectedItems2];
    //1.2 이 배열 요소를 클릭한 요소의 itemcode랑 비교해서 일치하는게 있나 본다.
    const index = updatedSelectedItems.indexOf(itemcode);

    //1.3 일치하는 게 없을때
    if (index === -1) {
      updatedSelectedItems.push(itemcode);
      setQuantity({ ...quantity, [itemcode]: 1 });
    } else {
      //1.4. 이미 배열에 있을 경우 개수를 증가시킨다.
      const updatedQuantity = {
        ...quantity,
        [itemcode]: quantity[itemcode] + 1,
      };
      setQuantity(updatedQuantity);
    }
    setSelectedItems2(updatedSelectedItems);
  };

  useEffect(() => {
    setMatchingIndexes2(matchingIndexes);
  }, [selectedItems2]);

  //아이템 코드로 아이템 전체 데이터를 찾는다.
  //전체 데이터인 itemsData에서 장바구니에 담은 데이터 index를 찾는다.
  //상품수는 따로 저장한다.배열에서 해당 값 개수 세어서 저장한다.
  //selectedItems는 itemcode를 뜻하고
  //matchingIndexes는 상품 정보 가져올 index를 뜻한다.
  //matchingData로 map을 돌림

  const findSameIndexes = (selectedItems, allItemsData) => {
    return selectedItems?.map(itemNumber => {
      return allItemsData?.data[0]?.item.itemnumber.indexOf(itemNumber);
    });
  };

  const matchingIndexes = findSameIndexes(selectedItems2, allItemsData);

  console.log('matchingIndexes', matchingIndexes);
  console.log('selecteddata2', selectedItems2);

  //선택할때마다 index 같은 것 추가하기
  useEffect(() => {
    setMatchingIndexes2(matchingIndexes);
  }, [selectedItems2]);

  // 개수 줄이기 : 1까지만 줄이는 것 가능하게
  const handleDecreaseQuantity = index => {
    //[0003, 0004, 0005] 이런식으로 들어있을때
    //해당 코드 값을 구하고, 수량은 {0003:'1'} 이런식으로 되어있으니
    //quantity[0003]해서 수량을 구한다.
    const selectedItemCode = selectedItems2[index];
    const currentQuantity = quantity[selectedItemCode] || 0;

    //현재 수량이 1보다 크면
    //0003:2 -> 0003:1 이렇게 기존 quantity는 유지한 채 값을 1개 줄인다.
    //1이 최대이다.
    if (currentQuantity > 1) {
      const updatedQuantity = {
        ...quantity,
        [selectedItemCode]: currentQuantity - 1,
      };
      setQuantity(updatedQuantity);
    }
  };

  //증가하는 것도 마찬가지로 같은 방법으로 한다.
  const handleIncreaseQuantity = index => {
    const selectedItemCode = selectedItems2[index];
    const currentQuantity = quantity[selectedItemCode] || 0;
    const updatedQuantity = {
      ...quantity,
      [selectedItemCode]: currentQuantity + 1,
    };
    setQuantity(updatedQuantity);
  };

  const handleDelete = itemcode => {
    let copy = [...matchingIndexes2];
    copy.splice(itemcode, 1);
    return copy;
    // const updatedSelectedItems = [...selectedItems2];
    // const selectedItemCode = selectedItems2[index];
    // setSelectedItems2(selectedItems2.filter(el => el !== itemId));
  };

  const calculateTotalPrice = () => {
    let total = 0;
    matchingIndexes.forEach((data, i) => {
      const itemIndex = Number(data);
      const itemPrice = Number(
        allItemsData?.data[0]?.item.itemprice[itemIndex],
      );
      const itemQuantity = quantity[selectedItems2[i]] || 0;
      total += itemPrice * itemQuantity;
    });

    return total;
  };

  console.log('총 가격', calculateTotalPrice());
  console.log('총 개수', quantity);

  // 구매 요청을 위한 url 생성
  let quantityArr = [];
  //key 값이랑 value 값을 '/key/value' 형태로 연결한다.
  const sendArr3 = quantity => {
    for (const [key, value] of Object.entries(quantity)) {
      quantityArr.push(`/${key}/${value}`);
    }
    return quantityArr;
  };

  //연결해서 만든 arr를 요청할 url 뒤에 붙여 새로운 url을 생성한다.
  const makePurchaseUrlArr = arr => {
    let url = `http://192.168.0.11:28095/creditsale/sell`;
    for (let i = 0; i < arr.length; i++) {
      url += arr[i];
    }
    return url;
  };

  console.log(sendArr3(quantity));
  console.log(makePurchaseUrlArr(quantityArr));

  //구매 요청
  const purchaseUrl = makePurchaseUrlArr(quantityArr);

  const purchaseFetchUrl = async () => {
    for (let i = 0; i < urls.length; i++) {
      try {
        const response = await axios.get(purchaseUrl);
        const responseData = response?.data;
        const responseStatus = responseData?.status;
        const responseLength = responseData?.length;
        const responseTitle = responseData?.title;

        if (i === 0) {
          console.log(responseData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  //숫자 3자리씩 끊어 ,처리 해주기
  const option = {
    maximumFractionDigits: 4,
  };
  const digitNumber = calculateTotalPrice().toLocaleString('ko-KR', option);

  return (
    <div className="container-main">
      {' '}
      <div className="kiosk-content-wrap">
        <div className="kiosk-left-wrap">
          <div>
            <div className="member-tag">
              <img
                className="member-level"
                src={memberLevelImg}
                alt="멤버 레벨"
              />
            </div>
            <div className="member-name-wrap">
              <div className="hello-message">Hi, Tager!</div>
              <div className="member-name">
                {allItemsData?.data[0]?.username}
              </div>
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
                  {allItemsData?.data[0]?.item.itemtype.map((product, i) =>
                    allItemsData?.data[0]?.item.itemtype[i] === 'drink' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          allItemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            allItemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {allItemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        )}
                      </button>
                    ) : (
                      ''
                    ),
                  )}
                </div>
              )}
              {content === 'snack' && (
                <div className="kiosk-item-wrap">
                  {allItemsData?.data[0]?.item.itemtype.map((product, i) =>
                    allItemsData?.data[0]?.item.itemtype[i] === 'snack' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          allItemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            allItemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {allItemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        )}
                      </button>
                    ) : (
                      ''
                    ),
                  )}
                </div>
              )}

              {content === 'coffee' && (
                <div className="kiosk-item-wrap">
                  {allItemsData?.data[0]?.item.itemtype.map((product, i) =>
                    allItemsData?.data[0]?.item.itemtype[i] === 'coffee' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          allItemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            allItemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {allItemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  allItemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {allItemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {allItemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        )}
                      </button>
                    ) : (
                      ''
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="kiosk-purchase-wrap">
              <div className="purchase-scroll-area">
                <ul className="purchase-item-container">
                  {matchingIndexes.map((data, i) => (
                    <li className="flex-container" key={i}>
                      <button
                        className="delete-item-button"
                        onClick={() => handleDelete(i)}
                      />
                      <div className="purchase-item-image-wrap">
                        <img
                          className="purchase-item-image"
                          src={`images/item/item${String(
                            selectedItems2[i],
                          )}.jpg`}
                          alt="상품 이미지"
                        />
                        <div>
                          <div className="purchase-item-name">
                            {' '}
                            {allItemsData?.data[0]?.item.itemname[Number(data)]}
                          </div>{' '}
                          <div className="purchase-item-price">
                            {' '}
                            {
                              allItemsData?.data[0]?.item.itemprice[
                                Number(data)
                              ]
                            }
                            원
                          </div>{' '}
                        </div>
                      </div>
                      <div className="purchase-item-button-wrap">
                        <button
                          className="item-num-decrease-button"
                          onClick={() => handleDecreaseQuantity(i)}
                        />
                        <span className="item-num">
                          {quantity[selectedItems2[i]] || 0}
                        </span>
                        <button
                          className="item-num-increase-button"
                          onClick={() => handleIncreaseQuantity(i)}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="kiosk-price">
                <div style={{ fontSize: '2.5vh' }}>총</div>
                <div>
                  <span className="color-price">{digitNumber}</span>원
                </div>
              </div>
              <button
                className="purchase-button"
                onClick={() => purchaseFetchUrl()}
              >
                구매
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

//한국말로 알려주세요. react로 개발중입니다.
//지금 자판기를 만들고 있는데
//구매 페이지에서 화면에서 동작이 일어나는지 확인해서
