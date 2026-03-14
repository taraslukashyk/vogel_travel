import { useEffect, useRef } from 'react';
import { ChevronDown, Plus, Minus, Globe } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const PARTNERS = [
  { id: 1, name: 'Google Cloud', lng: 30.5234, lat: 50.4501, tag: 'GCP', color: '#4285F4' },
  { id: 2, name: 'AWS Services', lng: 13.4049, lat: 52.5200, tag: 'AWS', color: '#FF9900' },
  { id: 3, name: 'Azure', lng: 21.0122, lat: 52.2297, tag: 'AZ', color: '#0089D6' },
  { id: 4, name: 'DigitalOcean', lng: -0.1276, lat: 51.5072, tag: 'DO', color: '#0080FF' },
  { id: 5, name: 'Cloudflare', lng: 2.3522, lat: 48.8566, tag: 'CF', color: '#F38020' },
  { id: 6, name: 'Datadog', lng: -74.0060, lat: 40.7128, tag: 'DD', color: '#632CA6' },
  { id: 7, name: 'Snowflake', lng: -122.4194, lat: 37.7749, tag: 'SNW', color: '#29B5E8' },
  { id: 8, name: 'Stripe', lng: -6.2603, lat: 53.3498, tag: 'STR', color: '#635BFF' },
];

const PartnershipMap = ({ onNextDown }: { onNextDown?: () => void }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLButtonElement>(null);
  const markersRef = useRef<{ id: number; el: HTMLElement; lngLat: [number, number] }[]>([]);
  const zoomTaskRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const isMobile = window.innerWidth < 768;

    // Initialize MapLibre
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [0, 20], // Center of the world roughly
      zoom: isMobile ? 0.0 : 1.5,
      pitch: 0,
      maxPitch: 60,
      interactive: true,
      // We'll disable cooperativeGestures to allow fluid one-finger pan and two-finger pinch zoom
      cooperativeGestures: false,
      touchZoomRotate: true,
      attributionControl: false,
    });
    mapRef.current = map;

    // Immediately disable default scroll zoom, we will handle it via custom wheel logic
    map.scrollZoom.disable();

    // Add markers
    PARTNERS.forEach(p => {
      const el = document.createElement('div');
      el.className = 'custom-partner-marker group relative cursor-pointer';
      
      el.innerHTML = `
        <div class="marker-dot w-4 h-4 rounded-full bg-[#5cc8bd] shadow-[0_0_15px_rgba(92,200,189,0.5)] transition-all duration-500 ease-out z-10 relative group-hover:scale-0 group-[.is-active]:scale-0"></div>
        <div class="marker-card absolute bottom-full left-1/2 -translate-x-1/2 mb-3 scale-75 opacity-0 pointer-events-none transition-all duration-500 delay-75 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 group-hover:scale-100 group-hover:opacity-100 group-[.is-active]:scale-100 group-[.is-active]:opacity-100 flex items-center justify-center bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-2xl min-w-[140px]">
          <div class="flex flex-col items-center gap-2">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner" style="background-color: ${p.color};">${p.tag}</div>
            <span class="text-white text-xs font-bold tracking-widest uppercase text-center whitespace-nowrap">${p.name}</span>
          </div>
        </div>
      `;

      new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map);

      markersRef.current.push({ id: p.id, el, lngLat: [p.lng, p.lat] });
    });

    // Handle Proximity Effect
    const checkProximity = () => {
      const currentZoom = map.getZoom();
      const center = map.getCenter();
      const centerPx = map.project(center);
      
      // Strict threshold: at zoom >= 4.0, open all visible cards.
      // Below that, collapse them entirely to dots.
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

    // Consolidated listener for proximity, pitch, and cards
    const handleMapTransform = () => {
      checkProximity();

      const currentZoom = map.getZoom();
      let newPitch = 0;
      const startPitchZoom = isMobile ? 0.0 : 1.5;

      if (currentZoom > startPitchZoom) {
        // Map zoom level [0-15] to pitch [0-60]
        const progress = Math.min((currentZoom - startPitchZoom) / 4.0, 1);
        newPitch = progress * 60;
      }
      
      // Update pitch only if significantly different and NOT during a native pinch to avoid stutter
      // MapLibre is better at handling pitch if we don't fight its internal render loop
      const currentPitch = map.getPitch();
      if (Math.abs(currentPitch - newPitch) > 1.0) {
        // Use a low-impact update
        map.setPitch(newPitch);
      }
    };

    map.on('zoom', handleMapTransform);
    map.on('move', handleMapTransform);
    map.on('rotate', handleMapTransform);
    map.on('pitch', () => checkProximity());

    // Handle custom scroll zooming when Ctrl is pressed
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault(); // Prevent standard page zoom
        
        // Ensure interactive states are clean
        instructionRef.current?.classList.add('opacity-0');
        arrowRef.current?.classList.remove('opacity-0', 'pointer-events-none');
        arrowRef.current?.classList.add('opacity-100', 'pointer-events-auto');
        
        const zoomDelta = e.deltaY * -0.01;
        
        // Current zoom and pitch
        const currentZoom = map.getZoom();
        
        // Calculate newly desired zoom
        let newZoom = currentZoom + zoomDelta;
        
        // Clamp zoom
        if (newZoom < 1) newZoom = 1;
        if (newZoom > 15) newZoom = 15;
        
        // MapLibre natively targets the map center (screen center) when calling setZoom directly.
        // Pitch mapping is handled entirely by the 'zoom' event listener to support all devices uniformly.
        map.setZoom(newZoom);
      } else {
        // Show hint if they try to scroll without ctrl inside the map area
        if (instructionRef.current && !isMobile) {
          instructionRef.current.innerText = 'Використовуйте Ctrl + Scroll для наближення';
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

    // Hide instructions entirely when dragging manually starts
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
  }, []);

  const startContinuousZoom = (direction: 'in' | 'out') => {
    if (!mapRef.current) return;
    
    const animate = () => {
      const map = mapRef.current;
      if (!map) return;

      const cur = map.getZoom();
      // Adjust speed: proportional to the 10/(cur+1) rule but normalized for 60fps
      // 0.05 is a base multiplier for smoothness
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

  return (
    <div ref={wrapperRef} className="map-section-wrapper relative w-full h-[60vh] md:h-screen bg-black">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />
      
      <div 
        ref={mapContainer} 
        className="w-full h-full !absolute inset-0 z-0 map-gl-container outline-none touch-none"
      />
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl transition-opacity duration-500 map-instruction-pill flex flex-col items-center justify-center">
        <span ref={instructionRef} className="text-[#5cc8bd] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 pointer-events-none">
          Змініть масштаб щоб зануритись
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
