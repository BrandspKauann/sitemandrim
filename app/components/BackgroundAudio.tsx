'use client';

import { useEffect } from 'react';
import { installBackgroundAudio } from './backgroundAudioSession';

// One coordinator for every real recording, including the user's own attempts.
export default function BackgroundAudio() {
  useEffect(() => installBackgroundAudio(document, navigator), []);
  return null;
}
