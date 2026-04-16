import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";

export const DashboardOverview: React.FC = () => {
  const frame = useCurrentFrame();

  const scrollY = e(frame, [20, 100], [0, 400], "sine");
  const opacity = e(frame, [0, 15, 105, 120], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: "#050505", opacity }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <BrowserChrome url="vogel.travel/admin/offers" width={1600} height={900}>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
             <Img
              src={assets.image.screenshots.admin.offersList}
              style={{
                width: "100%",
                transform: `translateY(-${scrollY}px)`,
              }}
            />
          </div>
        </BrowserChrome>
      </AbsoluteFill>
      
      <div style={{
        position: 'absolute',
        top: 60,
        right: 180,
        padding: '12px 24px',
        background: 'rgba(92, 200, 189, 0.1)',
        border: '1px solid rgba(92, 200, 189, 0.3)',
        borderRadius: 20,
        color: '#5cc8bd',
        fontSize: 24,
        fontWeight: 600,
        opacity: e(frame, [10, 30], [0, 1]),
        backdropFilter: 'blur(10px)'
      }}>
        Керування пропозиціями
      </div>
    </AbsoluteFill>
  );
};
