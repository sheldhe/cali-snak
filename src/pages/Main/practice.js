import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './QuantityControl.scss';

const QuantityControl = () => {
  const [historyInfo, setHistoryInfo] = useState(null);
  const [modifyModal, setModifyModal] = useState(false);
  const [quantity, setQuantity] = useState([]);
  const modalBackground = useRef();
  const urls = [`http://192.168.0.11:28095/creditsale/history/request`];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(urls[0]);
        const responseData = response?.data;
        const responseTitle = responseData?.title;

        if (responseTitle === 'historyinfo') {
          setHistoryInfo(responseData);
          setQuantity(responseData?.data[0]?.itemquentity);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const intervalId2 = setInterval(fetchData, 300);
    return () => clearInterval(intervalId2);
  }, []);

  const decreaseQuantity = index => {
    const updatedQuantity = [...quantity];
    if (updatedQuantity[index] > 0) {
      updatedQuantity[index] -= 1;
      setQuantity(updatedQuantity);
    }
  };

  const increaseQuantity = index => {
    const updatedQuantity = [...quantity];
    updatedQuantity[index] += 1;
    setQuantity(updatedQuantity);
  };

  return (
    <div className="kiosk-content">
      <div className="quantity-content">
        {/* ... (이하 생략) ... */}
        <ul>
          {historyInfo?.data[0]?.seq.map((product, i) => (
            <li className="historyinfo-list" key={i}>
              {/* ... (이하 생략) ... */}
              <div className="historyinfo-item num">
                <button
                  className="num-button decrease"
                  onClick={() => decreaseQuantity(i)}
                >
                  -
                </button>
                <input
                  className="num-button-input"
                  type="number"
                  min="0"
                  placeholder={quantity[i]}
                />
                <button
                  className="num-button increase"
                  onClick={() => increaseQuantity(i)}
                >
                  +
                </button>
              </div>
              {/* ... (이하 생략) ... */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuantityControl;
