import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, type LongPressEvent } from 'react-native-maps';
import { SegmentedButtons, Text } from 'react-native-paper';
import * as Location from 'expo-location';

import { AppScreen } from '@/components/app-screen';
import { PlaceDialog } from '@/components/place-dialog';
import { useDiary } from '@/context/diary-context';

const DEFAULT_REGION = {
  latitude: 55.751244,
  longitude: 37.618423,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
};

export default function SatelliteMap() {
  const { places, addPlace } = useDiary();
  const mapRef = useRef<MapView>(null);
  const [satellite, setSatellite] = useState(true);
  const [draftCoords, setDraftCoords] = useState<{ latitude: number; longitude: number } | null>(
    null,
  );

  const mappedPlaces = useMemo(
    () => places.filter((place) => place.latitude != null && place.longitude != null),
    [places],
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        return;
      }

      const position = await Location.getCurrentPositionAsync({});
      if (cancelled) {
        return;
      }

      mapRef.current?.animateToRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const onLongPress = (event: LongPressEvent) => {
    setDraftCoords(event.nativeEvent.coordinate);
  };

  return (
    <AppScreen title="Дневник туриста" subtitle="Вид со спутника">
      <View style={styles.controls}>
        <SegmentedButtons
          value={satellite ? 'satellite' : 'standard'}
          onValueChange={(value) => setSatellite(value === 'satellite')}
          buttons={[
            { value: 'satellite', label: 'Спутник', icon: 'satellite-variant' },
            { value: 'standard', label: 'Схема', icon: 'map-outline' },
          ]}
        />
        <Text variant="bodySmall" style={styles.hint}>
          Удерживайте точку на карте, чтобы добавить место в блокнот.
        </Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        mapType={satellite ? 'satellite' : 'standard'}
        showsUserLocation
        showsMyLocationButton
        onLongPress={onLongPress}
      >
        {mappedPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude as number, longitude: place.longitude as number }}
            title={place.title}
            description={place.comment}
          />
        ))}
      </MapView>
      <PlaceDialog
        visible={draftCoords != null}
        latitude={draftCoords?.latitude}
        longitude={draftCoords?.longitude}
        onDismiss={() => setDraftCoords(null)}
        onSubmit={(draft) => {
          addPlace(draft);
          setDraftCoords(null);
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  controls: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  hint: {
    opacity: 0.7,
  },
  map: {
    flex: 1,
  },
});
