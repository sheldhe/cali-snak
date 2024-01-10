import React, { useState } from 'react';

const VendingMachine = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleItemClick = index => {
    // 이미 선택한 상품인지 확인
    if (!selectedItems.includes(index)) {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleRemoveItem = index => {
    const updatedItems = selectedItems.filter(itemIndex => itemIndex !== index);
    setSelectedItems(updatedItems);
  };

  const handleDecreaseQuantity = index => {
    const updatedItems = [...selectedItems];
    const itemIndex = updatedItems.indexOf(index);

    if (itemIndex !== -1) {
      updatedItems.splice(itemIndex, 1);
      setSelectedItems(updatedItems);
    }
  };

  const handleIncreaseQuantity = index => {
    setSelectedItems([...selectedItems, index]);
  };

  return (
    <div>
      <h1>자판기</h1>
      <ul>
        {products.map((product, index) => (
          <li key={index} onClick={() => handleItemClick(index)}>
            {product.name}
          </li>
        ))}
      </ul>

      <h2>선택한 상품</h2>
      <ul>
        {selectedItems.map((index, i) => (
          <li key={i}>
            {`${products[index].name} - 수량: ${
              selectedItems.filter(item => item === index).length
            }`}
            <button onClick={() => handleRemoveItem(index)}>삭제</button>
            <button onClick={() => handleDecreaseQuantity(index)}>-</button>
            <button onClick={() => handleIncreaseQuantity(index)}>+</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendingMachine;


import React, { useState, useEffect } from 'react';
// ... (나머지 import 부분은 그대로 유지)

const Main = () => {
  // ... (이전 코드 부분은 그대로 유지)

  const findIndexesInItemsData = (selectedItems, itemsData) => {
    return selectedItems.map((itemNumber) => {
      return itemsData?.data[0]?.item.itemnumber.indexOf(itemNumber);
    });
  };

  // 이 함수를 사용하여 일치하는 인덱스들을 가져올 수 있습니다.
  const matchingIndexes = findIndexesInItemsData(selectedItems, itemsData);

  console.log(matchingIndexes); // 매칭되는 인덱스들이 출력됩니다.

  // ... (이후 코드 부분은 그대로 유지)
};

export default Main;



const [quantity, setQuantity] = useState([]);

useEffect(() => {
  setQuantity(cart.map(item => item.quantity));
}, [cart]);

const handleItemRemove = itemId => {
  dispatch(removeItemFromCart(itemId));
};

const handleQuantityIncrease = index => {
  const newQuantity = [...quantity];
  newQuantity[index]++;
  setQuantity(newQuantity);
};

const handleQuantityDecrease = index => {
  if (quantity[index] > 1) {
    const newQuantity = [...quantity];
    newQuantity[index]--;
    setQuantity(newQuantity);
  }
};

const totalPrice = cart.reduce(
  (acc, item, index) => acc + parseInt(item.price) * quantity[index],
  0
);


