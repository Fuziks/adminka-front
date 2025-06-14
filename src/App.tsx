import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/Layout/AdminLayout';
import Products from './pages/Admin/Products/Products';
import Categories from './pages/Admin/Categories/Categories';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import { ROUTES } from './utils/routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.HOME} element={
          localStorage.getItem('auth') 
            ? <AdminLayout><Home /></AdminLayout>
            : <Navigate to={ROUTES.LOGIN} />
        } />
        <Route path={ROUTES.PRODUCTS} element={
          localStorage.getItem('auth')
            ? <AdminLayout><Products /></AdminLayout>
            : <Navigate to={ROUTES.LOGIN} />
        } />
        <Route path={ROUTES.CATEGORIES} element={
          localStorage.getItem('auth')
            ? <AdminLayout><Categories /></AdminLayout>
            : <Navigate to={ROUTES.LOGIN} />
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;