import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { router } from './routes';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <AppContextProvider>
      <div className="app-container">
        <RouterProvider router={router} />
        <Toaster position="top-right" containerClassName="z-[9999]" />
      </div>
    </AppContextProvider>
  );
};

export default App;
