import { Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TabBar } from '../components/tabbar/TabBar';
import { FabCluster } from '../components/fab/FabCluster';
import { Toast } from '../components/toast/Toast';
import { ActDetail } from '../components/act-detail/ActDetail';
import { PwaInstall } from '../components/pwa-install/PwaInstall';

export function AppLayout() {
  const { theme } = useApp();
  const location = useLocation();

  return (
    <div className="ufest-shell" data-theme={theme}>
      <div className="ufest-shell__screen">
        {/* Re-mount on path change so the screenIn animation re-runs. */}
        <div className="page-transition" key={location.pathname}>
          <Outlet />
        </div>
      </div>
      <FabCluster />
      <PwaInstall />
      <Toast />
      <ActDetail />
      <TabBar />
    </div>
  );
}
