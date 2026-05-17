import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './layouts/AppLayout';
import Home from './pages/home/home';
import Lineup from './pages/lineup/lineup';
import MapPage from './pages/map/map';
import Favs from './pages/favs/favs';
import Info from './pages/info/info';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/lineup" element={<Lineup />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/favs" element={<Favs />} />
            <Route path="/info" element={<Info />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
