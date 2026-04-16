import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Scene1 } from './scenes/01-Scene1';
import { Scene2 } from './scenes/02-Scene2';
import { TIMELINE } from './timeline';

export const VogelYoutubeAida: React.FC = () => {
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
