import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load public page components
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const OfferDetailPage = lazy(() => import('./pages/OfferDetailPage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));

// Lazy load admin components
const AdminLogin = lazy(() => import('./admin/pages/AdminLogin'));
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const ProtectedRoute = lazy(() => import('./admin/components/ProtectedRoute'));
const OffersList = lazy(() => import('./admin/pages/OffersList'));
const OfferForm = lazy(() => import('./admin/pages/OfferForm'));
const BlogList = lazy(() => import('./admin/pages/BlogList'));
const BlogForm = lazy(() => import('./admin/pages/BlogForm'));
const ServicesList = lazy(() => import('./admin/pages/ServicesList'));
const ServiceForm = lazy(() => import('./admin/pages/ServiceForm'));
const SeoList = lazy(() => import('./admin/pages/SeoList'));
const SeoForm = lazy(() => import('./admin/pages/SeoForm'));
const MediaLibrary = lazy(() => import('./admin/pages/MediaLibrary'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes with Header/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<ArticlePage />} />
            <Route path="/offers/:id" element={<OfferDetailPage />} />
            <Route path="/partners" element={<PartnershipPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
          </Route>

          {/* Admin routes without Header/Footer */}
          <Route path="/admin/login" element={
            <Suspense fallback={<AdminLoader />}><AdminLogin /></Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<AdminLoader />}>
              <ProtectedRoute><AdminLayout /></ProtectedRoute>
            </Suspense>
          }>
            <Route index element={<OffersList />} />
            <Route path="offers" element={<OffersList />} />
            <Route path="offers/new" element={<OfferForm />} />
            <Route path="offers/:id" element={<OfferForm />} />
            <Route path="blog" element={<BlogList />} />
            <Route path="blog/new" element={<BlogForm />} />
            <Route path="blog/:id" element={<BlogForm />} />
            <Route path="services" element={<ServicesList />} />
            <Route path="services/new" element={<ServiceForm />} />
            <Route path="services/:id" element={<ServiceForm />} />
            <Route path="seo" element={<SeoList />} />
            <Route path="seo/:id" element={<SeoForm />} />
            <Route path="media" element={<MediaLibrary />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  )
}

// Layout wrapper for public pages
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30 flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App
