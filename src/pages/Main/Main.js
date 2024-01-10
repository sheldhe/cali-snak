import React, { useState, useEffect } from 'react';
import './Main.scss';
import axios from 'axios';
import liBoxImg from '../../assets/images/kiosk_credit_icon_in_left_box.png';
import memberLevelImg from '../../assets/images/kiosk_credit_badge_icon.png';

const Main = () => {
  const [content, setContent] = useState('drink');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItems2, setSelectedItems2] = useState([]);
  const [itemsData, setItemsData] = useState(null);
  const [matchingIndexes2, setMatchingIndexes2] = useState([]);
  const [quantity, setQuantity] = useState([]);

  //상품 담기
  const handleClickButton = name => {
    setContent(name);
  };
  // const urls = [`http://192.168.0.11:28095/creditsale/sell/request`];
  const urls = [`data/data.json`];

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
            setItemsData(responseData);
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

  //아이템을 클릭하면 장바구니에 담는다.(아이템 코드를 빈 배열에 추가한다.)
  //selecteditems 는 중복 허용 안하고, selecteditems는 중복허용함.
  const handleItemClick = itemcode => {
    if (!selectedItems.includes(itemcode)) {
      setSelectedItems([...selectedItems, itemcode]);
    }
    setSelectedItems2([...selectedItems, itemcode]);
  };

  useEffect(() => {
    setMatchingIndexes2(matchingIndexes);
  }, [selectedItems]);

  //아이템 코드로 아이템 전체 데이터를 찾는다.
  //전체 데이터인 itemsData에서 장바구니에 담은 데이터 index를 찾는다.
  //상품수는 따로 저장한다.배열에서 해당 값 개수 세어서 저장한다.
  //selectedItems는 itemcode를 뜻하고
  //matchingIndexes는 상품 정보 가져올 index를 뜻한다.
  //matchingData로 map을 돌림

  const findIndexesInItemsData = (selectedItems, itemsData) => {
    return selectedItems?.map(itemNumber => {
      return itemsData?.data[0]?.item.itemnumber.indexOf(itemNumber);
    });
  };

  const matchingIndexes = findIndexesInItemsData(selectedItems, itemsData);

  console.log('matchingIndexes', matchingIndexes);
  console.log('selecteddata2', selectedItems2);

  //선택할때마다 index 같은 것 추가하기
  useEffect(() => {
    setMatchingIndexes2(matchingIndexes);
  }, [selectedItems]);

  const handleRemoveItem = deleteIndex => {
    return matchingIndexes.splice(deleteIndex, 1);
  };

  console.log('selectedItems', selectedItems);

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
              <div className="member-name">{itemsData?.data[0]?.username}</div>
              <div className="member-tag-number">
                {itemsData?.data[0]?.tagvalue}
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
                  부모님 이름 : {itemsData?.data[0]?.parentname}
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
                  전화번호 : {itemsData?.data[0]?.phonenumber.slice(0, 3)}-
                  {itemsData?.data[0]?.phonenumber.slice(3, 7)} -
                  {itemsData?.data[0]?.phonenumber.slice(
                    7,
                    itemsData?.data[0]?.phonenumber.length,
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
                  {itemsData?.data[0]?.item.itemtype.map((product, i) =>
                    itemsData?.data[0]?.item.itemtype[i] === 'drink' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          itemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            itemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {itemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
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
                  {itemsData?.data[0]?.item.itemtype.map((product, i) =>
                    itemsData?.data[0]?.item.itemtype[i] === 'snack' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          itemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            itemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {itemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
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
                  {itemsData?.data[0]?.item.itemtype.map((product, i) =>
                    itemsData?.data[0]?.item.itemtype[i] === 'coffee' ? (
                      <button
                        className="kiosk-item-container"
                        disabled={
                          itemsData?.data[0]?.item.itemstock[i] === '0'
                            ? true
                            : false
                        }
                        key={i}
                        onClick={() =>
                          handleItemClick(
                            itemsData?.data[0]?.item.itemnumber[i],
                          )
                        }
                      >
                        {itemsData?.data[0]?.item.itemstock[i] === '0' ? (
                          <>
                            <div className="item-img-wrap soldout">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="item-img-wrap">
                              <img
                                className="item-img"
                                src={`images/item/item${String(
                                  itemsData?.data[0]?.item.itemnumber[i],
                                )}.jpg`}
                                alt="상품 이미지"
                              />
                            </div>
                            <div className="item-name">
                              {itemsData?.data[0]?.item.itemname[i]}
                            </div>
                            <div className="item-price">
                              {' '}
                              {itemsData?.data[0]?.item.itemprice[i]}원
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
                <div className="purchase-item-container">
                  {matchingIndexes.map((data, i) => (
                    <div className="flex-container" key={i}>
                      <button
                        className="delete-item-button"
                        onClick={() => handleRemoveItem(i)}
                      />
                      <div className="purchase-item-image-wrap">
                        <img
                          className="purchase-item-image"
                          src={`images/item/item${String(
                            selectedItems[i],
                          )}.jpg`}
                          alt="상품 이미지"
                        />
                        <div>
                          <div className="purchase-item-name">
                            {' '}
                            {itemsData?.data[0]?.item.itemname[Number(data)]}
                          </div>{' '}
                          <div className="purchase-item-price">
                            {' '}
                            {itemsData?.data[0]?.item.itemprice[Number(data)]}원
                          </div>{' '}
                        </div>
                      </div>
                      <div className="purchase-item-button-wrap">
                        <button className="item-num-decrease-button" />
                        <span className="item-num">
                          {matchingIndexes.filter(item => item === data).length}
                        </span>
                        <button
                          className="item-num-increase-button"
                          // onClick={() =>
                          //   matchingIndexes.filter(item => item === data)
                          //     .length + 1
                          // }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="kiosk-price">
                <div style={{ fontSize: '2.5vh' }}>총</div>
                <div>
                  <span className="color-price">10000</span>원
                </div>
              </div>
              <button className="purchase-button">구매</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
