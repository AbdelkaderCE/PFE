
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import DevNav from './DevNav';
import { DEV_PAGES } from './pages/_devPages';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <DevNav />
        <Routes>
          {DEV_PAGES.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
