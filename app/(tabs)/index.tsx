import { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { FAB, IconButton, List, Text } from 'react-native-paper';

import { AppScreen } from '@/components/app-screen';
import { PlaceDialog } from '@/components/place-dialog';
import { useDiary } from '@/context/diary-context';
import type { Place } from '@/types/diary';

export default function PlacesScreen() {
  const { places, addPlace, updatePlace, removePlace } = useDiary();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<Place | null>(null);

  const closeDialog = () => {
    setDialogVisible(false);
    setEditing(null);
  };

  return (
    <AppScreen title="Дневник туриста" subtitle="Куда сходить">
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        contentContainerStyle={places.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.empty}>
            Пока нет мест. Добавьте, куда хотите сходить.
          </Text>
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={
              item.comment ||
              (item.latitude != null ? 'Есть точка на карте' : 'Без координат')
            }
            left={(props) => <List.Icon {...props} icon="map-marker-outline" />}
            right={() => (
              <View style={styles.actions}>
                <IconButton
                  icon="pencil-outline"
                  onPress={() => {
                    setEditing(item);
                    setDialogVisible(true);
                  }}
                />
                <IconButton
                  icon="delete-outline"
                  onPress={() =>
                    Alert.alert('Удалить место?', item.title, [
                      { text: 'Отмена', style: 'cancel' },
                      { text: 'Удалить', style: 'destructive', onPress: () => removePlace(item.id) },
                    ])
                  }
                />
              </View>
            )}
          />
        )}
      />
      <FAB icon="plus" label="Место" style={styles.fab} onPress={() => setDialogVisible(true)} />
      <PlaceDialog
        visible={dialogVisible}
        place={editing}
        onDismiss={closeDialog}
        onSubmit={(draft) => {
          if (editing) {
            updatePlace(editing.id, draft);
          } else {
            addPlace(draft);
          }
          closeDialog();
        }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: 96,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  empty: {
    textAlign: 'center',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});
