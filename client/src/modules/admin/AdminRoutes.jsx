import { Route } from 'react-router-dom';
import AdminCrud from './AdminCrud.jsx';
import DashboardPage from './DashboardPage.jsx';
import HomeSettingsPage from './HomeSettingsPage.jsx';
import MembersPage from './MembersPage.jsx';
import MessagesPage from './MessagesPage.jsx';
import GalleryAdminPage from './GalleryAdminPage.jsx';
import AboutEditorPage from './AboutEditorPage.jsx';
import SettingsPage from './SettingsPage.jsx';
import * as cfg from './adminConfigs.jsx';

// To add a new admin section: add a config in adminConfigs.js and one line here.
export default function AdminRoutes() {
  return (
    <>
      <Route index element={<DashboardPage />} />
      <Route path="home" element={<HomeSettingsPage />} />
      <Route path="notifications" element={<AdminCrud config={cfg.notificationsConfig} />} />
      <Route path="initiatives" element={<AdminCrud config={cfg.initiativesConfig} />} />
      <Route path="events" element={<AdminCrud config={cfg.eventsConfig} />} />
      <Route path="blog" element={<AdminCrud config={cfg.blogConfig} />} />
      <Route path="team" element={<AdminCrud config={cfg.teamConfig} />} />
      <Route path="gallery" element={<GalleryAdminPage />} />
      <Route path="about" element={<AboutEditorPage />} />
      <Route path="startups" element={<AdminCrud config={cfg.startupsConfig} />} />
      <Route path="members" element={<MembersPage />} />
      <Route path="messages" element={<MessagesPage />} />
      <Route path="settings" element={<SettingsPage />} />
    </>
  );
}
