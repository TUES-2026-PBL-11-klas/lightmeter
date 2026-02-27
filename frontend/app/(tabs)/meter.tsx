import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import { useMeter } from '../../src/hooks/useMeter';
import { ISOSelector } from '../../src/components/meter/ISOSelector';
import { ApertureRuler } from '../../src/components/meter/ApertureRuler';
import { ExposureReadout } from '../../src/components/meter/ExposureReadout';
import { ZoomSlider } from '../../src/components/meter/ZoomSlider';

export default function MeterScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const { iso, setIso, measuredEV, aperture, setAperture, shutterSpeed, isMeasuring, cameraRef, measure, zoom, setZoom } = useMeter();

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator color="#ffd700" /></View>;
  }
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.measureButton}>
          <Text style={styles.buttonText}>GRANT</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={'back' as CameraType} zoom={zoom} />

      <View style={styles.uiOverlay}>
        <ISOSelector selected={iso} onSelect={setIso} />

        <ExposureReadout ev={measuredEV} shutter={shutterSpeed} aperture={aperture} iso={iso} />

        <ZoomSlider zoom={zoom} onZoomChange={setZoom} />

        <View style={styles.footer}>
          <ApertureRuler currentAperture={aperture} onApertureChange={setAperture}/>

          <TouchableOpacity
            onPress={measure}
            style={[styles.measureButton, isMeasuring && styles.measureButtonDisabled]}
            disabled={isMeasuring}
          >
            {isMeasuring
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.buttonText}>MEASURE</Text>
            }
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  uiOverlay: { flex: 1, width: '100%', justifyContent: 'space-between', paddingBottom: 40, backgroundColor: 'rgba(0,0,0,0.1)' },
  footer: { alignItems: 'center' },
  measureButton: { backgroundColor: '#33ce7d', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 50, marginTop: 20, minWidth: 140, alignItems: 'center' },
  measureButtonDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: '900', letterSpacing: 2, color: '#000' },
  permissionText: { color: '#fff', textAlign: 'center', marginBottom: 20 },
});