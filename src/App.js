
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DevNav from './DevNav';
import { DEV_PAGES } from './pages/_devPages';

function App() {
  return (
    <BrowserRouter>
      <DevNav />
      <Routes>
        {DEV_PAGES.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
