import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';

import HomePage from './modules/home/HomePage.jsx';
import AboutPage from './modules/about/AboutPage.jsx';
import EventsPage from './modules/events/EventsPage.jsx';
import EventDetailPage from './modules/events/EventDetailPage.jsx';
import InitiativesPage from './modules/initiatives/InitiativesPage.jsx';
import TeamPage from './modules/team/TeamPage.jsx';
import StartupsPage from './modules/startups/StartupsPage.jsx';
import GalleryPage from './modules/gallery/GalleryPage.jsx';
import BlogPage from './modules/blog/BlogPage.jsx';
import BlogPostPage from './modules/blog/BlogPostPage.jsx';
import ContactPage from './modules/contact/ContactPage.jsx';
import LoginPage from './modules/auth/LoginPage.jsx';
import RegisterPage from './modules/auth/RegisterPage.jsx';
import VerifyEmailPage from './modules/auth/VerifyEmailPage.jsx';
import ForgotPasswordPage from './modules/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './modules/auth/ResetPasswordPage.jsx';
import NotFoundPage from './modules/NotFoundPage.jsx';
import ProfilePage from './modules/profile/ProfilePage.jsx';
import AdminLayout from './modules/admin/AdminLayout.jsx';
import AdminRoutes from './modules/admin/AdminRoutes.jsx';

export default function App() {
  return (
    <Routes>
      {/* public + member pages share Navbar and Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/initiatives" element={<InitiativesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:slug" element={<EventDetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/startups" element={<StartupsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/reset/:token" element={<ResetPasswordPage />} />
        <Route path="/verify/:token" element={<VerifyEmailPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* admin has its own layout (sidebar) */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        {AdminRoutes()}
      </Route>
    </Routes>
  );
}
