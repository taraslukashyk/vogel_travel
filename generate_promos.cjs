const fs = require('fs');
const path = require('path');

const compositions = [
  {
    id: 'vogel-tiktok-pas-916',
    component: 'VogelTiktokPas',
    width: 1080,
    height: 1920,
    fps: 60,
    total: 900,
  },
  {
    id: 'vogel-tiktok-aida-916',
    component: 'VogelTiktokAida',
    width: 1080,
    height: 1920,
    fps: 60,
    total: 720,
  },
  {
    id: 'vogel-youtube-fab-169',
    component: 'VogelYoutubeFab',
    width: 1920,
    height: 1080,
    fps: 30,
    total: 750,
  },
  {
    id: 'vogel-youtube-aida-169',
    component: 'VogelYoutubeAida',
    width: 1920,
    height: 1080,
    fps: 30,
    total: 1350,
  }
];

const basePath = path.join(__dirname, 'remotion-promo', 'src', 'compositions');

for (const comp of compositions) {
  const compDir = path.join(basePath, comp.id);
  const scenesDir = path.join(compDir, 'scenes');
  
  if (!fs.existsSync(scenesDir)) {
    fs.mkdirSync(scenesDir, { recursive: true });
  }

  // schema.ts
  fs.writeFileSync(path.join(compDir, 'schema.ts'), `import { z } from "zod";
export const ${comp.component}Schema = z.object({ title: z.string().optional() });
export const default${comp.component}Props = { title: "${comp.id}" };
`);

  // timeline.ts
  fs.writeFileSync(path.join(compDir, 'timeline.ts'), `export const TIMELINE = {
  fps: ${comp.fps},
  total: ${comp.total},
  START: {
    Scene1: 0,
    Scene2: Math.floor(${comp.total} * 0.25),
    Scene3: Math.floor(${comp.total} * 0.5),
    Scene4: Math.floor(${comp.total} * 0.75),
  }
};
`);

  // scenes
  fs.writeFileSync(path.join(scenesDir, '01-Scene1.tsx'), `import React from 'react';
import { AbsoluteFill } from 'remotion';
export const Scene1: React.FC = () => <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', color: 'white', fontSize: 64}}>Scene 1</AbsoluteFill>;
`);
  fs.writeFileSync(path.join(scenesDir, '02-Scene2.tsx'), `import React from 'react';
import { AbsoluteFill } from 'remotion';
export const Scene2: React.FC = () => <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#222', color: 'white', fontSize: 64}}>Scene 2</AbsoluteFill>;
`);

  // index.tsx
  fs.writeFileSync(path.join(compDir, 'index.tsx'), `import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Scene1 } from './scenes/01-Scene1';
import { Scene2 } from './scenes/02-Scene2';
import { TIMELINE } from './timeline';

export const ${comp.component}: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
       <Sequence from={TIMELINE.START.Scene1} durationInFrames={TIMELINE.START.Scene2 - TIMELINE.START.Scene1}>
         <Scene1 />
       </Sequence>
       <Sequence from={TIMELINE.START.Scene2} durationInFrames={TIMELINE.total - TIMELINE.START.Scene2}>
         <Scene2 />
       </Sequence>
    </AbsoluteFill>
  );
};
`);
}
