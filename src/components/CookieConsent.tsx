import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from './ui/dialog';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface CookiePreferences {
  strictly_necessary: boolean;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
}

const STORAGE_KEY = 'vogel_cookie_consent_v1';

export default function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    strictly_necessary: true,
    performance: false,
    functional: false,
    targeting: false,
  });
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const savedConsent = localStorage.getItem(STORAGE_KEY);
    if (!savedConsent) {
      // Delay showing for a bit of premium feel
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
      } catch (e) {
        setIsVisible(true);
      }
    }

    const handleOpenSettings = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener('openCookieSettings', handleOpenSettings);
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings);
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      strictly_necessary: true,
      performance: true,
      functional: true,
      targeting: true,
    };
    savePreferences(allAccepted);
  };

  const handleConfirmChoices = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
    setIsSettingsOpen(false);
    
    // Trigger event for analytics or other listeners
    window.dispatchEvent(new CustomEvent('cookieConsentChanged', { detail: prefs }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev: string[]) => 
      prev.includes(id) ? prev.filter((i: string) => i !== id) : [...prev, id]
    );
  };

  if (!isVisible && !isSettingsOpen) return null;

  return (
    <>
      {/* Initial Banner */}
      {isVisible && !isSettingsOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                 <img src="/favicon.svg" alt="Vogel Logo" className="w-8 h-8 opacity-90" />
                 <span className="font-serif tracking-widest text-lg uppercase">VOGEL</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-4xl">
                {t('cookie.description')}{' '}
                <a href="/cookie-policy" className="underline hover:text-black transition-colors">
                  {t('cookie.policy_link')}
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors underline decoration-gray-300 underline-offset-4"
              >
                {t('cookie.settings')}
              </button>
              
              <Button 
                onClick={handleAcceptAll}
                className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-6 h-auto text-sm uppercase tracking-widest rounded-none min-w-[200px]"
              >
                {t('cookie.accept_all')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-4xl sm:max-w-[800px] w-full p-0 gap-0 bg-[#f9f9f7] border-none overflow-hidden rounded-none sm:rounded-none sm:top-auto sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-0 sm:max-h-[85vh]">
          <div className="flex flex-col h-[85vh] sm:h-auto max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
               <div className="flex items-center gap-3">
                 <img src="/favicon.svg" alt="Vogel Logo" className="w-6 h-6 opacity-60" />
                 <span className="font-serif tracking-widest text-sm uppercase opacity-60">VOGEL</span>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-4">
                <DialogTitle className="text-2xl font-serif text-[#1a1a1a]">
                  {t('cookie.preference_center_title')}
                </DialogTitle>
                <p className="text-sm leading-relaxed text-gray-600">
                  {t('cookie.preference_center_desc')}
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleAcceptAll}
                  className="bg-[#1a1a1a] hover:bg-black text-white w-full sm:w-auto h-auto px-10 py-3 text-xs uppercase tracking-widest rounded-none mb-8"
                >
                  {t('cookie.allow_all')}
                </Button>

                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400 pt-4">
                  {t('cookie.manage_preferences')}
                </h3>

                <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                  {/* Strictly Necessary */}
                  <div className="py-4 space-y-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleExpanded('strictly_necessary')}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            expandedItems.includes('strictly_necessary') && "rotate-180"
                          )} 
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                          {t('cookie.strictly_necessary.title')}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {t('cookie.strictly_necessary.status')}
                      </span>
                    </div>
                    {expandedItems.includes('strictly_necessary') && (
                      <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t('cookie.strictly_necessary.description')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Performance */}
                  <div className="py-4 space-y-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleExpanded('performance')}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            expandedItems.includes('performance') && "rotate-180"
                          )} 
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                          {t('cookie.performance.title')}
                        </span>
                      </div>
                      <Switch 
                        checked={preferences.performance}
                        onCheckedChange={(checked) => setPreferences((prev: CookiePreferences) => ({ ...prev, performance: checked }))}
                      />
                    </div>
                    {expandedItems.includes('performance') && (
                      <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t('cookie.performance.description')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Functional */}
                  <div className="py-4 space-y-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleExpanded('functional')}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            expandedItems.includes('functional') && "rotate-180"
                          )} 
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                          {t('cookie.functional.title')}
                        </span>
                      </div>
                      <Switch 
                        checked={preferences.functional}
                        onCheckedChange={(checked) => setPreferences((prev: CookiePreferences) => ({ ...prev, functional: checked }))}
                      />
                    </div>
                    {expandedItems.includes('functional') && (
                      <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t('cookie.functional.description')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Targeting */}
                  <div className="py-4 space-y-3">
                    <div 
                      className="flex items-center justify-between cursor-pointer group"
                      onClick={() => toggleExpanded('targeting')}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronDown 
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200",
                            expandedItems.includes('targeting') && "rotate-180"
                          )} 
                        />
                        <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                          {t('cookie.targeting.title')}
                        </span>
                      </div>
                      <Switch 
                        checked={preferences.targeting}
                        onCheckedChange={(checked) => setPreferences((prev: CookiePreferences) => ({ ...prev, targeting: checked }))}
                      />
                    </div>
                    {expandedItems.includes('targeting') && (
                      <div className="pl-6 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {t('cookie.targeting.description')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-200 sm:flex sm:justify-end">
              <Button 
                onClick={handleConfirmChoices}
                className="bg-[#1a1a1a] hover:bg-black text-white w-full sm:w-auto h-auto px-10 py-3 text-xs uppercase tracking-widest rounded-none"
              >
                {t('cookie.confirm_choices')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
