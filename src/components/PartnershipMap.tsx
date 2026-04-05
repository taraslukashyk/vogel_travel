import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { ChevronDown, Plus, Minus, Globe, ExternalLink } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapPartner {
  id: number;
  name: string;
  slug?: string | null;
  lng: number;
  lat: number;
  tag: string;
  color: string;
  logo?: string;
}

const FALLBACK_PARTNERS: MapPartner[] = [
  { id: 1, name: 'Four Seasons', lng: 73.5, lat: 4.2, tag: 'FS', color: '#9B7D4B' },
  { id: 2, name: 'Aman Resorts', lng: 115.2, lat: -8.4, tag: 'AM', color: '#C8A882' },
  { id: 3, name: 'Emirates', lng: 55.3, lat: 25.2, tag: 'EK', color: '#C01F2F' },
  { id: 4, name: 'Belmond', lng: 12.3, lat: 45.4, tag: 'BL', color: '#1D3461' },
  { id: 5, name: 'Silversea', lng: 7.4, lat: 43.7, tag: 'SS', color: '#00385F' },
  { id: 6, name: 'Six Senses', lng: 80.7, lat: 7.9, tag: '6S', color: '#5A7247' },
  { id: 7, name: 'Rolls-Royce', lng: -0.1, lat: 51.5, tag: 'RR', color: '#3A3A3A' },
  { id: 8, name: 'Virtuoso', lng: -74.0, lat: 40.7, tag: 'VT', color: '#0B2265' },
];

interface PartnershipMapProps {
  onNextDown?: () => void;
  partners?: MapPartner[];
}

const PartnershipMap = ({ onNextDown, partners }: PartnershipMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const markersRef = useRef<{ id: number; el: HTMLElement; lngLat: [number, number] }[]>([]);
  const zoomTaskRef = useRef<number | null>(null);
  const isInteractingRef = useRef(false);
  const navigate = useNavigate();
  const { t, l, i18n } = useLanguage();

  const activePartners = (partners && partners.length > 0) ? partners : FALLBACK_PARTNERS;

  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth < 768;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [0, 20],
      zoom: isMobile ? 0.0 : 1.5,
      pitch: 0,
      maxPitch: 60,
      interactive: true,
      cooperativeGestures: false,
      dragRotate: false,
      touchZoomRotate: false,
      attributionControl: false,
    });
    mapRef.current = map;

    map.scrollZoom.disable();

    activePartners.forEach(p => {
      const el = document.createElement('div');
      el.className = 'custom-partner-marker group relative cursor-pointer';

      el.innerHTML = `
        <div class="marker-dot w-4 h-4 rounded-full bg-[#5cc8bd] shadow-[0_0_15px_rgba(92,200,189,0.5)] transition-all duration-500 ease-out z-10 relative group-hover:scale-0 group-[.is-active]:scale-0"></div>
        <div class="marker-card absolute bottom-full left-1/2 -translate-x-1/2 mb-3 scale-75 opacity-0 pointer-events-none transition-all duration-500 delay-75 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 group-hover:scale-100 group-hover:opacity-100 group-hover:pointer-events-auto group-[.is-active]:scale-100 group-[.is-active]:opacity-100 group-[.is-active]:pointer-events-auto flex items-center justify-center bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-2xl min-w-[140px] cursor-pointer">
          <div class="flex flex-col items-center gap-2">
            ${p.logo
              ? `<div class="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white p-1.5 shadow-inner"><img src="${p.logo}" alt="${p.name}" class="w-full h-full object-contain" /></div>`
              : `<div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-inner" style="background-color: ${p.color};">${p.tag}</div>`
            }
            <span class="text-white text-xs font-bold tracking-widest uppercase text-center whitespace-nowrap">${p.name}</span>
            <span class="text-[#5cc8bd] text-[9px] font-bold uppercase tracking-widest">${t('common.details')} →</span>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        navigate(l(`/partners/${p.slug || p.id}`));
      });

      new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map);

      markersRef.current.push({ id: p.id, el, lngLat: [p.lng, p.lat] });
    });

    const checkProximity = () => {
      const currentZoom = map.getZoom();
      const center = map.getCenter();
      const centerPx = map.project(center);
      const revealAllZoom = 4.0;
      const activeRadius = currentZoom >= revealAllZoom ? 5000 : -1;

      markersRef.current.forEach(m => {
        const markerPx = map.project(m.lngLat);
        const dist = Math.sqrt(Math.pow(markerPx.x - centerPx.x, 2) + Math.pow(markerPx.y - centerPx.y, 2));
        if (dist <= activeRadius) {
          m.el.classList.add('is-active');
        } else {
          m.el.classList.remove('is-active');
        }
      });
    };

    const handleMapTransform = () => {
      checkProximity();
      const currentZoom = map.getZoom();
      let newPitch = 0;
      const startPitchZoom = isMobile ? 0.0 : 1.5;
      if (currentZoom > startPitchZoom) {
        const progress = Math.min((currentZoom - startPitchZoom) / 4.0, 1);
        newPitch = progress * 60;
      }
      const currentPitch = map.getPitch();
      if (!isInteractingRef.current) {
        if (Math.abs(currentPitch - newPitch) > 0.5) {
          map.setPitch(newPitch);
        }
      }
    };

    map.on('zoom', () => handleMapTransform());
    map.on('move', () => handleMapTransform());
    map.on('rotate', () => handleMapTransform());
    map.on('moveend', () => handleMapTransform());
    map.on('pitch', () => checkProximity());

    map.on('touchstart', () => { isInteractingRef.current = true; });
    map.on('touchend', () => { isInteractingRef.current = false; });
    map.on('mousedown', () => { isInteractingRef.current = true; });
    map.on('mouseup', () => { isInteractingRef.current = false; });

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        instructionRef.current?.classList.add('opacity-0');
        arrowRef.current?.classList.remove('opacity-0', 'pointer-events-none');
        arrowRef.current?.classList.add('opacity-100', 'pointer-events-auto');
        const zoomDelta = e.deltaY * -0.01;
        const currentZoom = map.getZoom();
        let newZoom = currentZoom + zoomDelta;
        if (newZoom < 1) newZoom = 1;
        if (newZoom > 15) newZoom = 15;
        map.setZoom(newZoom);
      } else {
        if (instructionRef.current && !isMobile) {
          instructionRef.current.innerText = t('partners.map_zoom_ctrl_instruction');
          instructionRef.current.classList.remove('opacity-0');
          instructionRef.current.classList.add('animate-pulse');
          setTimeout(() => {
            if (instructionRef.current) {
              instructionRef.current.classList.remove('animate-pulse');
            }
          }, 1000);
        }
      }
    };

    mapContainer.current.addEventListener('wheel', handleWheel, { passive: false });

    map.on('dragstart', () => {
      instructionRef.current?.classList.add('opacity-0');
      arrowRef.current?.classList.remove('opacity-0', 'pointer-events-none');
      arrowRef.current?.classList.add('opacity-100', 'pointer-events-auto');
    });

    return () => {
      if (zoomTaskRef.current) cancelAnimationFrame(zoomTaskRef.current);
      mapContainer.current?.removeEventListener('wheel', handleWheel);
      map.remove();
    };
  }, [activePartners, navigate, i18n.language, t, l]);

  const startContinuousZoom = (direction: 'in' | 'out') => {
    if (!mapRef.current) return;
    const animate = () => {
      const map = mapRef.current;
      if (!map) return;
      const cur = map.getZoom();
      const speed = (10 / (cur + 1)) * 0.05;
      const next = direction === 'in'
        ? Math.min(cur + speed, 15)
        : Math.max(cur - speed, 0);
      map.setZoom(next);
      if ((direction === 'in' && next < 15) || (direction === 'out' && next > 0)) {
        zoomTaskRef.current = requestAnimationFrame(animate);
      }
    };
    if (zoomTaskRef.current) cancelAnimationFrame(zoomTaskRef.current);
    zoomTaskRef.current = requestAnimationFrame(animate);
  };

  const stopContinuousZoom = () => {
    if (zoomTaskRef.current) {
      cancelAnimationFrame(zoomTaskRef.current);
      zoomTaskRef.current = null;
    }
  };

  const openInGoogleMaps = () => {
    if (!mapRef.current) return;
    
    const center = mapRef.current.getCenter();
    const zoom = Math.round(mapRef.current.getZoom()) + 1; // Adjust zoom for Google Maps differences
    
    // Check if there are any partners near the center to show pins
    // For general view with pins, Google Maps doesn't support multiple pins in a simple URL easily,
    // so we'll open at the same center and zoom.
    
    let url = `https://www.google.com/maps/@${center.lat},${center.lng},${zoom}z`;
    
    // If the user is zoomed in enough, maybe they are looking at one partner
    // We can try to finding the closest partner to the center
    if (zoom >= 10 && activePartners.length > 0) {
      const closest = activePartners.reduce((prev, curr) => {
        const d1 = Math.sqrt(Math.pow(prev.lat - center.lat, 2) + Math.pow(prev.lng - center.lng, 2));
        const d2 = Math.sqrt(Math.pow(curr.lat - center.lat, 2) + Math.pow(curr.lng - center.lng, 2));
        return d1 < d2 ? prev : curr;
      });
      
      // If the closest partner is within a reasonable distance, we use search to show its pin
      const dist = Math.sqrt(Math.pow(closest.lat - center.lat, 2) + Math.pow(closest.lng - center.lng, 2));
      if (dist < 0.1) {
        url = `https://www.google.com/maps/search/?api=1&query=${closest.lat},${closest.lng}`;
      }
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={wrapperRef} className="map-section-wrapper relative w-full h-[60vh] md:h-screen bg-black">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />

      <div
        ref={mapContainer}
        className="w-full h-full !absolute inset-0 z-0 map-gl-container outline-none"
      />

      <div className="absolute top-8 right-4 md:right-8 z-20">
        <button
          onClick={openInGoogleMaps}
          className="flex items-center gap-3 px-6 py-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-[0.3em] text-[#5cc8bd] hover:bg-[#5cc8bd] hover:text-black hover:border-[#5cc8bd] transition-all duration-500 group shadow-2xl"
        >
          <ExternalLink className="w-4 h-4 transition-transform group-hover:scale-110" />
          <span className="hidden md:inline">{t('contacts.open_in_maps')}</span>
        </button>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl transition-opacity duration-500 map-instruction-pill flex flex-col items-center justify-center">
        <span ref={instructionRef} className="text-[#5cc8bd] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 pointer-events-none">
          {t('partners.map_zoom_instruction')}
        </span>
        <button
          ref={arrowRef}
          onClick={onNextDown}
          className="opacity-0 pointer-events-none h-0 mt-0 overflow-hidden transition-all duration-500 hover:text-white text-[#5cc8bd]"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>

      {/* Map Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20 flex flex-col gap-3">
        <button
          onMouseDown={() => startContinuousZoom('in')}
          onMouseUp={stopContinuousZoom}
          onMouseLeave={stopContinuousZoom}
          onTouchStart={(e) => { e.preventDefault(); startContinuousZoom('in'); }}
          onTouchEnd={stopContinuousZoom}
          className="w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-[#5cc8bd] hover:border-[#5cc8bd]/50 hover:bg-black/80 transition-all duration-300 shadow-xl active:scale-95 touch-none"
          aria-label="Zoom in"
        >
          <Plus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
        </button>
        <button
          onMouseDown={() => startContinuousZoom('out')}
          onMouseUp={stopContinuousZoom}
          onMouseLeave={stopContinuousZoom}
          onTouchStart={(e) => { e.preventDefault(); startContinuousZoom('out'); }}
          onTouchEnd={stopContinuousZoom}
          className="w-10 h-10 md:w-12 md:h-12 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/70 hover:text-[#5cc8bd] hover:border-[#5cc8bd]/50 hover:bg-black/80 transition-all duration-300 shadow-xl active:scale-95 touch-none"
          aria-label="Zoom out"
        >
          <Minus className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
        </button>
        <div className="w-full h-[1px] bg-white/10 my-1"></div>
        <button
          onClick={() => {
            if (mapRef.current) {
              const initialZoom = window.innerWidth < 768 ? 0.0 : 1.5;
              mapRef.current.jumpTo({ center: [0, 20], zoom: initialZoom, pitch: 0 });
            }
          }}
          className="w-10 h-10 md:w-12 md:h-12 bg-[#5cc8bd]/10 backdrop-blur-md border border-[#5cc8bd]/30 rounded-full flex items-center justify-center text-[#5cc8bd] hover:text-black hover:bg-[#5cc8bd] hover:border-[#5cc8bd] transition-all duration-300 shadow-xl"
          aria-label="Reset map"
        >
          <Globe className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default PartnershipMap;
