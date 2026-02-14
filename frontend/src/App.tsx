import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import frFR from 'antd/locale/fr_FR';
import { UserProvider } from './context/UserContext';
import { SocketProvider } from './context/SocketContext';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminRoute from './components/layout/AdminRoute';
import HomePage from './pages/HomePage';
import ListingBrowsePage from './pages/ListingBrowsePage';
import ListingDetailPage from './pages/ListingDetailPage';
import CreateListingPage from './pages/CreateListingPage';
import EditListingPage from './pages/EditListingPage';
import DashboardPage from './pages/DashboardPage';
import MyListingsPage from './pages/MyListingsPage';
import WishlistPage from './pages/WishlistPage';
import SettingsPage from './pages/SettingsPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ConfigProvider
      locale={frFR}
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#ff4d4f',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <UserProvider>
          <SocketProvider>
            <Routes>
              <Route element={<AppLayout />}>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/listings" element={<ListingBrowsePage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />

                {/* Authenticated routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/listings/new" element={<CreateListingPage />} />
                  <Route path="/listings/:id/edit" element={<EditListingPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/my-listings" element={<MyListingsPage />} />
                  <Route path="/wishlists" element={<WishlistPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Route>

                {/* Admin routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminPage />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </SocketProvider>
        </UserProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}
