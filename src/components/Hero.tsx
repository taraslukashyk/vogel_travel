import { useEffect, useRef, useState } from 'react';
import cardImg from '../assets/hero-bg.png'; // temporarily using the old hero bg for the card

const TOTAL_FRAMES = 160;

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // We'll preload the images so they don't flicker on scroll
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    // Preload images
    const loadImages = () => {
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        // The images are in public/hero-sequence folder
        img.src = `/hero-sequence/frame_${paddedIndex}_delay-0.05s.webp`;
        imagesRef.current[i] = img;
      }
    };
    
    loadImages();

    // Ensure the first frame is drawn once it's loaded
    const firstImg = imagesRef.current[0];
    if (firstImg) {
      firstImg.onload = () => {
        renderFrame(0);
      };
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the top of the container is from the top of the viewport
      // It starts at top=0 when the scroll hits the sticky element
      // container height is e.g. 300vh. Scrollable distance is 200vh.
      const scrollableDistance = height - windowHeight;
      
      // Calculate progress from 0 to 1
      let progress = 0;
      if (top > 0) {
        progress = 0;
      } else if (-top >= scrollableDistance) {
        progress = 1;
      } else {
        progress = -top / scrollableDistance;
      }
      
      const currentFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );
      
      setFrameIndex(currentFrame);
      requestAnimationFrame(() => renderFrame(currentFrame));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to initialize
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = imagesRef.current[index];
    if (img && img.complete) {
      // Draw image to cover the canvas exactly like background-size: cover
      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      } else {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  // Resize canvas safely
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Set canvas internal resolution to match window inner size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderFrame(frameIndex);
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [frameIndex]);

  // Calculate element transform based on frameIndex
  // From frame 0 to 40, offset is 0
  // From 40 to 159, elements move down
  let translateY = 0;
  let opacity = 1;
  const startMoveFrame = 40;
  if (frameIndex > startMoveFrame) {
    const moveProgress = (frameIndex - startMoveFrame) / (TOTAL_FRAMES - 1 - startMoveFrame);
    translateY = moveProgress * 500; // Move down up to 500px
    opacity = 1 - Math.min(1, moveProgress * 1.5); // Fade out slightly faster
  }

  return (
    <section ref={containerRef} className="relative w-full h-[300vh]">
      {/* Sticky container that stays in viewport while scrolling through the 300vh */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">
        
        {/* Canvas for Video Sequence */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Light gradient overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
        
        {/* Animated UI Container */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ 
            transform: `translateY(${translateY}px)`,
            opacity: opacity,
            willChange: 'transform, opacity'
          }}
        >
          {/* Container pushing to edges */}
          <div className="relative z-10 w-full px-6 md:px-8 lg:px-12 mx-auto max-w-[1440px] flex justify-between items-end pb-16 pt-32 h-full pointer-events-auto">
            
            {/* Left Content: Text & CTA */}
            <div className="flex flex-col max-w-[600px] self-center pt-10">
              <h1 className="font-montserrat text-5xl md:text-7xl lg:text-[80px] font-bold text-white leading-[1.05] tracking-tight mb-8">
                Відкрийте світ: <br /> ваша подорож <br /> починається
              </h1>
              
              <p className="font-inter text-white/95 text-base md:text-lg mb-10 max-w-[550px] leading-relaxed font-light">
                Vogel Family Travel — туристичний оператор, що створює індивідуальні подорожі для
                клієнтів із високими вимогами до сервісу, приватності та деталей. Ми працюємо з
                нестандартними запитами і повністю беремо на себе організацію подорожі — від ідеї до повернення.
              </p>
              
              <button className="bg-white text-black font-montserrat uppercase tracking-wider font-bold py-4 px-10 w-max hover:bg-gray-200 transition-colors rounded-sm shadow-lg pointer-events-auto">
                Дослідити Зараз
              </button>
            </div>

            {/* Right Bottom Card (Blog preview) */}
            <div className="hidden lg:flex w-[420px] h-[150px] bg-white/95 backdrop-blur-md self-end shadow-2xl overflow-hidden rounded-sm pointer-events-auto">
              {/* Card Image */}
              <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: `url(${cardImg})` }}></div>
              
              {/* Card Content */}
              <div className="w-1/2 p-5 flex flex-col justify-between font-montserrat text-black">
                <div>
                  <h3 className="text-base leading-snug tracking-tight uppercase font-semibold line-clamp-2 mb-2">
                    10 розкішних місць для відпустки
                  </h3>
                  <a href="#" className="text-xs uppercase font-bold underline decoration-2 underline-offset-2 hover:text-gray-600 transition-colors">
                    Читати зараз
                  </a>
                </div>
                
                <div className="text-[10px] text-gray-500 uppercase leading-snug font-medium">
                  Reiseguides <br/>
                  Жовтень 27, 2024
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
