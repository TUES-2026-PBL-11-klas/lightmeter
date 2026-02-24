export const FILM_ISOS = [25, 50, 64, 100, 125, 160, 200, 400, 800, 1600, 3200] as const
export type FilmISO = typeof FILM_ISOS[number]

export const APERTURE_VALUES = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32] as const
export type ApertureValue = typeof APERTURE_VALUES[number]

export const SHUTTER_SPEEDS = [1/4000, 1/2000, 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1, 2, 4, 8, 15, 30] as const

export interface ExposureData {
  ev: number;
  shutter: number;
  aperture: ApertureValue;
  iso: FilmISO;
}