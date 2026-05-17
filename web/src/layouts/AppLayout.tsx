import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TabBar } from '../components/tabbar/TabBar';
import { FabCluster } from '../components/fab/FabCluster';
import { Toast } from '../components/toast/Toast';
import { ActDetail } from '../components/act-detail/ActDetail';

export function AppLayout() {
  const { theme } = useApp();

  return (
    <div className="ufest-shell" data-theme={theme}>
      <div className="ufest-shell__screen">
        <Outlet />
      </div>
      <FabCluster />
      <Toast />
      <ActDetail />
      <TabBar />
    </div>
  );
}
