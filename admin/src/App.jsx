import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import StagesPage from './pages/StagesPage.jsx';
import ActsPage from './pages/ActsPage.jsx';
import SchedulePage from './pages/SchedulePage.jsx';
import GenresPage from './pages/GenresPage.jsx';
import MapPinsPage from './pages/MapPinsPage.jsx';
import FaqsPage from './pages/FaqsPage.jsx';
import ReachPage from './pages/ReachPage.jsx';
import InfoFactsPage from './pages/InfoFactsPage.jsx';
import PushPage from './pages/PushPage.jsx';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard"  element={<DashboardPage />} />
              <Route path="/stages"     element={<StagesPage />} />
              <Route path="/acts"       element={<ActsPage />} />
              <Route path="/schedule"   element={<SchedulePage />} />
              <Route path="/genres"     element={<GenresPage />} />
              <Route path="/map-pins"   element={<MapPinsPage />} />
              <Route path="/faqs"       element={<FaqsPage />} />
              <Route path="/reach"      element={<ReachPage />} />
              <Route path="/info-facts" element={<InfoFactsPage />} />
              <Route path="/push"       element={<PushPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
