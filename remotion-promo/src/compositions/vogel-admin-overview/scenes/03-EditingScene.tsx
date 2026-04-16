import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { e } from "../../../lib/interp";
import { assets } from "../../../lib/staticPath";
import { BrowserChrome } from "../../../components/brand/BrowserChrome";

export const EditingScene: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = e(frame, [0, 120], [1, 1.05], "sine");
  const opacity = e(frame, [0, 15, 105, 120], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: "#050505", opacity }}>
      <AbsoluteFill style={{ 
        alignItems: "center", 
        justifyContent: "center",
        transform: `scale(${scale})`
      }}>
        <BrowserChrome url="vogel.travel/admin/offers/edit/102" width={1600} height={900}>
          <Img
            src={assets.image.screenshots.admin.offerForm}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </BrowserChrome>
      </AbsoluteFill>

      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 180,
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
        Зручний редактор контенту
      </div>
    </AbsoluteFill>
  );
};
