import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
  const isInteractiveRef = useRef(false);
  const targetRef = useRef<{lng: number, lat: number}>({ lng: 30.5234, lat: 50.4501 });
  const markersRef = useRef<{ id: number; el: HTMLElement; lngLat: [number, number] }[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize MapLibre
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', // Premium dark style
      center: [0, 20], // Center of the world roughly
      zoom: 1.5,
      pitch: 0,
      interactive: false, // Start completely locked
      attributionControl: false,
    });
    mapRef.current = map;

    // Add markers
    PARTNERS.forEach(p => {
      const el = document.createElement('div');
      el.className = 'custom-partner-marker group relative cursor-pointer';
      
      el.innerHTML = `
        <div class="marker-dot w-4 h-4 rounded-full bg-[#5cc8bd] shadow-[0_0_15px_rgba(92,200,189,0.5)] transition-all duration-500 ease-out z-10 relative group-hover:scale-0 group-[.is-active]:scale-0"></div>
        <div class="marker-card absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-50 opacity-0 pointer-events-none transition-all duration-500 delay-75 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20 group-hover:scale-100 group-hover:opacity-100 group-[.is-active]:scale-100 group-[.is-active]:opacity-100 flex items-center justify-center bg-zinc-900 border border-white/10 rounded-xl p-3 shadow-2xl min-w-[140px]">
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
      if (!isInteractiveRef.current) return;

      const center = map.getCenter();
      const centerPx = map.project(center);
      
      // Determine what's "close to center" based on the viewport size
      const activeRadius = window.innerWidth < 768 ? 100 : 200;

      markersRef.current.forEach(m => {
        const markerPx = map.project(m.lngLat);
        const dist = Math.sqrt(Math.pow(markerPx.x - centerPx.x, 2) + Math.pow(markerPx.y - centerPx.y, 2));

        if (dist < activeRadius) {
          m.el.classList.add('is-active');
        } else {
          m.el.classList.remove('is-active');
        }
      });
    };

    map.on('move', checkProximity);

    map.on('mousemove', (e) => {
      // Capture the target coordinate only when fully zoomed out or near fully zoomed out
      if (map.getZoom() < 2.0) {
        targetRef.current = { lng: e.lngLat.lng, lat: e.lngLat.lat };
      }
    });

    // After map has loaded initially
    map.on('load', () => {
      if (!wrapperRef.current) return;

      // Ensure ScrollTrigger waits for everything to be measured
      ScrollTrigger.refresh();

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        pin: true,
        start: 'top top',
        end: '+=150vh', // Map zooms/pitches for 150vh of scrolling
        scrub: 1, // Smoothing effect
        onUpdate: (self) => {
          const progress = self.progress; // 0 to 1
          
          // Animate Pitch: 0 to 60
          const pitch = progress * 60;
          // Animate Zoom: Start 1.5, go to 5.5
          const zoom = 1.5 + progress * 4.0;
          
          // Interpolate Center to the targeted area
          const target = targetRef.current;
          const lng = 0 + progress * (target.lng - 0);
          const lat = 20 + progress * (target.lat - 20);

          map.setPitch(pitch);
          map.setZoom(zoom);
          map.setCenter([lng, lat]);

          if (progress === 0) {
            isInteractiveRef.current = false;
            if (mapContainer.current) mapContainer.current.style.pointerEvents = 'auto';
            
            markersRef.current.forEach(m => m.el.classList.remove('is-active'));

            if (instructionRef.current) instructionRef.current.innerText = 'Скрольте щоб зануритись';
            if (arrowRef.current) {
              arrowRef.current.classList.add('opacity-0', 'pointer-events-none', 'h-0', 'mt-0');
              arrowRef.current.classList.remove('opacity-100', 'pointer-events-auto', 'h-auto', 'mt-4');
            }
          } else if (progress >= 0.99) {
            isInteractiveRef.current = true;
            if (mapContainer.current) mapContainer.current.style.pointerEvents = 'auto';

            map.dragPan.enable();
            map.scrollZoom.disable(); // Prevent wheel from zooming while on the map to allow page scroll down
            
            // Recheck proximity strictly
            checkProximity();
            
            if (instructionRef.current) {
              instructionRef.current.innerText = 'Перетягуйте карту до місця призначення';
            }
            if (arrowRef.current) {
              arrowRef.current.classList.remove('opacity-0', 'pointer-events-none', 'h-0', 'mt-0');
              arrowRef.current.classList.add('opacity-100', 'pointer-events-auto', 'h-auto', 'mt-4');
            }
          } else {
            isInteractiveRef.current = false;
            if (mapContainer.current) mapContainer.current.style.pointerEvents = 'none';

            map.dragPan.disable();
            
            // Remove active states while scrolling
            markersRef.current.forEach(m => m.el.classList.remove('is-active'));
            
            if (instructionRef.current) {
              instructionRef.current.innerText = 'Скрольте щоб зануритись';
            }
            if (arrowRef.current) {
              arrowRef.current.classList.add('opacity-0', 'pointer-events-none', 'h-0', 'mt-0');
              arrowRef.current.classList.remove('opacity-100', 'pointer-events-auto', 'h-auto', 'mt-4');
            }
          }
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      map.remove();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="map-section-wrapper relative w-full h-screen bg-black">
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black via-transparent to-black" />
      
      {/* Container for MapLibre */}
      <div 
        ref={mapContainer} 
        className="w-full h-full !absolute inset-0 z-0 map-gl-container outline-none"
      />
      
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl transition-opacity duration-500 map-instruction-pill flex flex-col items-center justify-center">
        <span ref={instructionRef} className="text-[#5cc8bd] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 pointer-events-none">
          Скрольте щоб зануритись
        </span>
        <button 
          ref={arrowRef}
          onClick={onNextDown}
          className="opacity-0 pointer-events-none h-0 mt-0 overflow-hidden transition-all duration-500 hover:text-white text-[#5cc8bd]"
        >
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </div>
  );
};

export default PartnershipMap;
