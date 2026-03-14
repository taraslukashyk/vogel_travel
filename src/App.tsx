import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const OfferDetailPage = lazy(() => import('./pages/OfferDetailPage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const ContactsPage = lazy(() => import('./pages/ContactsPage'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background relative selection:bg-primary/30 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:id" element={<ArticlePage />} />
              <Route path="/offers/:id" element={<OfferDetailPage />} />
              <Route path="/partners" element={<PartnershipPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
