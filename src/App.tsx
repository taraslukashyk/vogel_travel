import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load public page components
const Home = lazy(() => import('./pages/Home'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const OfferDetailPage = lazy(() => import('./pages/OfferDetailPage'));
const PartnershipPage = lazy(() => import('./pages/PartnershipPage'));
const PartnerDetailPage = lazy(() => import('./pages/PartnerDetailPage'));
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
const PartnersList = lazy(() => import('./admin/pages/PartnersList'));
const PartnerForm = lazy(() => import('./admin/pages/PartnerForm'));
const SeoList = lazy(() => import('./admin/pages/SeoList'));
const SeoForm = lazy(() => import('./admin/pages/SeoForm'));
const AdminHelp = lazy(() => import('./admin/pages/AdminHelp'));
const Settings = lazy(() => import('./admin/pages/Settings'));
const Analytics = lazy(() => import('./admin/pages/Analytics'));


// Loading fallback component
const PageLoader = ({ progress, isVideoWaiting = false, isFadingOut = false }: { progress?: number, isVideoWaiting?: boolean, isFadingOut?: boolean }) => {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (progress === undefined) {
      const interval = setInterval(() => {
        setInternalProgress(prev => (prev >= 90 ? 90 : prev + 1));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [progress]);

  const displayProgress = progress !== undefined ? progress : (isVideoWaiting ? 98 : internalProgress);

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#072421] backdrop-blur-3xl transition-opacity duration-1000 ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center">
        {/* Background radial glow */}
        <div className="absolute inset-0 bg-primary/10 blur-[160px] rounded-full scale-150 animate-pulse"></div>
        
        {/* Logo container with glass effect */}
        <div className="relative z-10 p-4">
          <img 
            src="/favicon%20copy.svg" 
            alt="Vogel Travel Logo" 
            className="w-72 h-72 md:w-96 md:h-96 object-contain animate-spin-slow will-change-transform"
            style={{ 
              animationTimingFunction: 'linear',
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
            }}
          />
        </div>

        {/* Minimalist Progress Bar */}
        <div className="mt-20 w-96 h-[3px] bg-white/5 relative overflow-hidden rounded-full">
          <div 
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-700 ease-out shadow-[0_0_20px_rgba(92,200,189,0.4)]"
            style={{ width: `${displayProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Define custom keyframes for the progress bar
const LoaderStyles = () => (
  <style>{`
    @keyframes progress-move {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }
  `}</style>
);

const AdminLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Helper to sync i18n language with URL prefix
function LanguageHandler() {
  const { lang } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && (lang === 'ua' || lang === 'en')) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  return <PublicLayout />;
}

// Global state listener for video
declare global {
  interface Window {
    __VOGEL_VIDEO_READY__?: boolean;
  }
}

function App() {
  const { i18n } = useTranslation();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVideoWaiting, setIsVideoWaiting] = useState(false);

  useEffect(() => {
    // Start progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        const increment = Math.max(0.2, (98 - prev) / 25);
        return Math.min(prev + increment + (Math.random() * 0.5), 98);
      });
    }, 150);

    const finishLoading = () => {
      const isHome = window.location.pathname === '/' || window.location.pathname.match(/\/(ua|en)\/?$/);
      
      if (isHome && !window.__VOGEL_VIDEO_READY__) {
        setIsVideoWaiting(true);
        const checkVideo = setInterval(() => {
          if (window.__VOGEL_VIDEO_READY__) {
            clearInterval(checkVideo);
            setProgress(100);
            setTimeout(() => {
              setIsFadingOut(true);
              setTimeout(() => setIsInitialLoading(false), 1000);
            }, 800);
          }
        }, 100);
        return;
      } else {
        setProgress(100);
        setTimeout(() => {
          setIsFadingOut(true);
          setTimeout(() => setIsInitialLoading(false), 1000);
        }, 800);
      }
    };

    const handleLoad = () => {
      finishLoading();
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearInterval(interval);
      };
    }
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <LoaderStyles />
      
      {/* The Loader as an overlay to avoid deadlock */}
      {isInitialLoading && (
        <PageLoader progress={progress} isVideoWaiting={isVideoWaiting} isFadingOut={isFadingOut} />
      )}

      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to={`/${i18n.language || 'ua'}`} replace />} />
          
          <Route path="/:lang" element={<LanguageHandler />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="offers" element={<OffersPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<ArticlePage />} />
            <Route path="offers/:slug" element={<OfferDetailPage />} />
            <Route path="partners" element={<PartnershipPage />} />
            <Route path="partners/:slug" element={<PartnerDetailPage />} />
            <Route path="contacts" element={<ContactsPage />} />
          </Route>

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
            <Route path="partners" element={<PartnersList />} />
            <Route path="partners/new" element={<PartnerForm />} />
            <Route path="partners/:id" element={<PartnerForm />} />
            <Route path="seo" element={<SeoList />} />
            <Route path="seo/:id" element={<SeoForm />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="help" element={<AdminHelp />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </Router>
  )
}

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
