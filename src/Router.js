import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main/Main';

const Router = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
