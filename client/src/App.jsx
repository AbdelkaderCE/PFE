
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import DevNav from './DevNav';
import { DEV_PAGES } from './pages/_devPages';
import NotFoundPage from './pages/NotFoundPage';
import AIChatbot from './components/ai/AIChatbot';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col h-full overflow-hidden">
          <DevNav />
          <Routes>
            {DEV_PAGES.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            {/* Catch-all 404 */}
            <Route path="*" element={<div className="flex-1 overflow-y-auto"><NotFoundPage /></div>} />
          </Routes>
          <AIChatbot />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
