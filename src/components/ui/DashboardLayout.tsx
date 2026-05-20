import { Outlet } from 'react-router-dom';
import AppShell from './AppShell';

/**
 * Layout route for all authenticated dashboard pages.
 * React Router renders matched child routes into <Outlet />,
 * which AppShell places inside its scrollable content area.
 * The public "/" route deliberately sits outside this wrapper.
 */
const DashboardLayout = () => (
  <AppShell>
    <Outlet />
  </AppShell>
);

export default DashboardLayout;
