import { calculateEV100, getSnappedFilmSettings, getExposureRuler } from '../exposureMath';

describe('Exposure Math Logic', () => {
  
  test('calculateEV100 returns correct value for Sunny 16 conditions', () => {
    const data = { aperture: 16, shutterSpeed: 1/125, iso: 100 };
    expect(calculateEV100(data)).toBeCloseTo(15.0, 1);
  });

  test('getSnappedFilmSettings snaps to standard speeds', () => {
    const result = getSnappedFilmSettings(15, 100, 8);
    expect(result).toBe('1/500');
  });

  test('getExposureRuler returns full array of 13 pairs', () => {
    const ruler = getExposureRuler(15, 100);
    expect(ruler.length).toBe(13);
    expect(ruler[0]).toHaveProperty('aperture');
    expect(ruler[0]).toHaveProperty('shutterSpeed');
  });

  test('formatShutterSpeed handles long exposures', () => {
    const result = getSnappedFilmSettings(1, 100, 8);
    expect(result).toMatch(/s$/);
  });
});