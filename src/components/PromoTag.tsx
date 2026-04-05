import { useRef, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useService } from '../lib/queries/services';

const PromoTag = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: service } = useService('professional-support-and-travel-audit');

  const tagRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const currentAngle = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetAngle = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const isNear = useRef(false);
  const swingPhase = useRef(0);
  const [mounted, setMounted] = useState(false);

  const price = (service as any)?.price as number | null | undefined;
  const serviceSlug = (service as any)?.slug || 'professional-support-and-travel-audit';

  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

  const animate = useCallback(() => {
    const el = innerRef.current;
    if (el) {
      if (isNear.current) {
        const springK = 0.08;
        currentAngle.current += (targetAngle.current - currentAngle.current) * springK;
        currentX.current += (targetX.current - currentX.current) * springK;
        currentY.current += (targetY.current - currentY.current) * springK;
      } else {
        swingPhase.current += 0.02;
        const swingAngle = Math.sin(swingPhase.current) * 6;
        const returnK = 0.06;
        currentAngle.current += (swingAngle - currentAngle.current) * returnK;
        currentX.current += (0 - currentX.current) * returnK;
        currentY.current += (0 - currentY.current) * returnK;
      }

      el.style.transform = `translate(${currentX.current}px, ${currentY.current}px) rotate(${currentAngle.current}deg)`;
    }
    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!tagRef.current || isTouchDevice) return;
    const rect = tagRef.current.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top;
    const dx = e.clientX - anchorX;
    const dy = e.clientY - anchorY;
    const distance = Math.hypot(dx, dy);

    if (distance < 300) {
      isNear.current = true;
      const strength = 1 - distance / 300;
      targetAngle.current = (dx / 300) * 35;
      targetX.current = dx * strength * 1.0;
      targetY.current = Math.max(0, dy * strength * 0.5);
    } else {
      isNear.current = false;
    }
  }, [isTouchDevice]);

  // Start animation loop once on mount — keeps running even if refs aren't ready yet
  useEffect(() => {
    if (isTouchDevice) return;
    setMounted(true);
    window.addEventListener('mousemove', handleMouseMove);
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleMouseMove, animate, isTouchDevice]);

  const handleClick = () => {
    navigate(`/${i18n.language}/services/${serviceSlug}`);
  };

  if (!service && !mounted) return null;

  const formattedPrice = price
    ? price.toLocaleString(i18n.language === 'ua' ? 'uk-UA' : 'en-US')
    : null;

  return (
    <div
      ref={tagRef}
      onClick={handleClick}
      className={`absolute top-20 right-4 lg:top-28 lg:right-12 z-20 cursor-pointer group transition-opacity duration-500 ${service ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        ref={innerRef}
        style={{ transformOrigin: 'top center' }}
        className={isTouchDevice ? 'animate-swing' : ''}
      >
        {/* String */}
        <div className="flex flex-col items-center">
          <svg width="2" height="40" className="lg:h-[56px]">
            <line x1="1" y1="0" x2="1" y2="40" stroke="#44403c" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Tag body */}
        <div
          className="relative w-[140px] lg:w-[180px] shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
          style={{
            clipPath: 'polygon(50% 0%, 100% 10%, 100% 100%, 0 100%, 0 10%)',
          }}
        >
          <div className="bg-[#f5f0e8] pt-6 pb-4 px-3 lg:px-4 lg:pt-7 lg:pb-5">
            {/* Hole */}
            <div className="absolute top-[10px] lg:top-[12px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-stone-400 bg-[#f5f0e8]" />

            {/* Text */}
            <p className="text-[9px] lg:text-[11px] text-stone-600 leading-tight mt-1 font-montserrat text-center">
              {t('home.promo_tag_title')}
            </p>
            <p className="text-[9px] lg:text-[11px] text-stone-700 font-semibold leading-tight mt-0.5 font-montserrat text-center whitespace-nowrap">
              {t('home.promo_tag_service')}
            </p>

            {/* Price */}
            {formattedPrice && (
              <p className="text-sm lg:text-base font-bold text-stone-900 mt-2 font-montserrat text-center whitespace-nowrap">
                {formattedPrice} {i18n.language === 'ua' ? 'грн' : 'UAH'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoTag;
