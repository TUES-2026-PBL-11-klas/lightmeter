import { useRef, useState, useMemo } from 'react';
import { CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { calculateEV100, getSnappedFilmSettings } from '../utils/exposureMath';

function parseShutter(raw: string | number | undefined): number {
  if (!raw) return 0.008;
  if (typeof raw === 'number') return raw;
  if (raw.includes('/')) {
    const [num, den] = raw.split('/').map(Number);
    return num / den;
  }
  return parseFloat(raw);
}

export function useMeter() {
  const [iso, setIso] = useState(400);
  const [measuredEV, setMeasuredEV] = useState(12);
  const [aperture, setAperture] = useState(5.6);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [zoom, setZoom] = useState(0);

  const cameraRef = useRef<CameraView>(null);

  const shutterSpeed = useMemo(
    () => getSnappedFilmSettings(measuredEV, iso, aperture),
    [measuredEV, iso, aperture]
  );

  const measure = async () => {
    if (!cameraRef.current || isMeasuring) return;
    setIsMeasuring(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        exif: true,
        skipProcessing: true,
        quality: 0,
      });

      const exif = photo?.exif;
      const t = parseShutter(exif?.ExposureTime);
      const n = parseFloat(exif?.FNumber ?? exif?.ApertureValue ?? '1.8');
      const s = parseFloat(exif?.ISOSpeedRatings ?? exif?.PhotographicSensitivity ?? '100');

      if (!t || !n || !s) {
        console.warn('Incomplete EXIF:', { t, n, s });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      setMeasuredEV(calculateEV100({ shutterSpeed: t, aperture: n, iso: s }));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    } catch (e) {
      console.error('Metering failed:', e);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsMeasuring(false);
    }
  };

  return { iso, setIso, measuredEV, aperture, setAperture, shutterSpeed, isMeasuring, cameraRef, measure, zoom, setZoom };
}