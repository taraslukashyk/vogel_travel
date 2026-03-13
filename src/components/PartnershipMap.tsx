import { useEffect, useRef } from 'react';
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

const PartnershipMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instructionRef = useRef<HTMLSpanElement>(null);
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
          // Animate Center: slightly shift map center dynamically to make it look like a real "flyTo"
          // Starts at [0, 20], moves to [15, 48]
          const lng = 0 + progress * 15;
          const lat = 20 + progress * 28;

          map.setPitch(pitch);
          map.setZoom(zoom);
          map.setCenter([lng, lat]);

          // Enable map dragging only when at max scroll progress
          if (progress >= 0.99) {
            map.dragPan.enable();
            map.scrollZoom.disable(); // Prevent wheel from zooming while on the map to allow page scroll down
            
            // Recheck proximity strictly
            checkProximity();
            
            if (instructionRef.current) {
              instructionRef.current.innerText = 'Перетягуйте карту до місця призначення';
            }
          } else {
            map.dragPan.disable();
            
            // Remove active states while scrolling
            markersRef.current.forEach(m => m.el.classList.remove('is-active'));
            
            if (instructionRef.current) {
              instructionRef.current.innerText = 'Скрольте щоб зануритись';
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
      
      {/* Interactive overlay instructions */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center mix-blend-difference">
        <h2 className="text-white font-montserrat tracking-[0.3em] font-black text-2xl md:text-5xl uppercase opacity-80 select-none">
          Глобальна присутність
        </h2>
        <p className="text-white/60 mt-4 text-sm uppercase tracking-widest hidden md:block">
          Скрольте вниз для дослідження 
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center bg-black/50 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full shadow-2xl transition-opacity duration-500 map-instruction-pill">
        <span ref={instructionRef} className="text-[#5cc8bd] text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300">
          Скрольте щоб зануритись
        </span>
      </div>
    </div>
  );
};

export default PartnershipMap;
