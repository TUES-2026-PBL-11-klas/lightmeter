import { ApertureValue, FilmISO, APERTURE_VALUES, SHUTTER_SPEEDS } from '@/src/types/photoConstants';

export interface SensorData {
  iso: number;
  shutterSpeed: number;
  aperture: number;
}

export interface ExposurePair {
  aperture: number;
  shutterSpeed: string;
}

export const calculateEV100 = ({ iso, shutterSpeed, aperture }: SensorData): number => {
  const ev = Math.log2(Math.pow(aperture, 2) / shutterSpeed) - Math.log2(iso / 100);
  return Math.round(ev * 10) / 10;
};

const findClosest = (target: number, values: readonly number[]): number => 
  values.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);

export const formatShutterSpeed = (seconds: number): string => 
  seconds >= 1 ? `${Math.round(seconds)}s` : `1/${Math.round(1 / seconds)}`;


const calculateRawShutter = (ev100: number, filmIso: number, aperture: number): number => 
  Math.pow(aperture, 2) / (Math.pow(2, ev100) * (filmIso / 100));

export const getSnappedFilmSettings = (ev100: number, filmIso: FilmISO, targetAperture: ApertureValue): string => {
  const raw = calculateRawShutter(ev100, filmIso, targetAperture);
  return formatShutterSpeed(findClosest(raw, SHUTTER_SPEEDS));
};

export const getExposureRuler = (ev100: number, filmIso: FilmISO): ExposurePair[] => 
  APERTURE_VALUES.map(aperture => ({
    aperture,
    shutterSpeed: formatShutterSpeed(findClosest(calculateRawShutter(ev100, filmIso, aperture), SHUTTER_SPEEDS))
  }));