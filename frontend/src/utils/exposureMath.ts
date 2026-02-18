export interface ExposureData {
  iso: number;
  shutterSpeed: number;
  aperture: number;
}

export interface ExposurePair {
  aperture: number;
  shutterSpeed: string;
}

export const STANDARD_APERTURES = [1.0, 1.2, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22, 32];
export const STANDARD_SHUTTER_SPEEDS = [1/4000, 1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1, 2, 4, 8, 15, 30];

export const calculateEV100 = ({ iso, shutterSpeed, aperture }: ExposureData): number => {
  const ev = Math.log2(Math.pow(aperture, 2) / shutterSpeed) - Math.log2(iso / 100);
  return Math.round(ev * 10) / 10;
};

const findClosest = (target: number, values: number[]): number => 
  values.reduce((prev, curr) => Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev);

const formatShutterSpeed = (seconds: number): string => 
  seconds >= 1 ? `${Math.round(seconds)}s` : `1/${Math.round(1 / seconds)}`;

/** Calculates raw shutter duration: t = N² / (2^EV * (S/100)) */
const calculateRawShutter = (ev100: number, filmIso: number, aperture: number): number => 
  Math.pow(aperture, 2) / (Math.pow(2, ev100) * (filmIso / 100));

export const getSnappedFilmSettings = (ev100: number, filmIso: number, targetAperture: number): string => {
  const raw = calculateRawShutter(ev100, filmIso, targetAperture);
  return formatShutterSpeed(findClosest(raw, STANDARD_SHUTTER_SPEEDS));
};

export const getExposureRuler = (ev100: number, filmIso: number): ExposurePair[] => 
  STANDARD_APERTURES.map(aperture => ({
    aperture,
    shutterSpeed: formatShutterSpeed(findClosest(calculateRawShutter(ev100, filmIso, aperture), STANDARD_SHUTTER_SPEEDS))
  }));