import { useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import { FAB, IconButton, List, Text } from 'react-native-paper';

import { AppScreen } from '@/components/app-screen';
import { NoteDialog } from '@/components/note-dialog';
import { useDiary } from '@/context/diary-context';
import type { Note } from '@/types/diary';

export default function NotesScreen() {
  const { notes, addNote, updateNote, removeNote } = useDiary();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);

  const closeDialog = () => {
    setDialogVisible(false);
    setEditing(null);
  };

  return (
    <AppScreen title="Дневник туриста" subtitle="Заметки">
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={notes.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <Text variant="bodyLarge" style={styles.empty}>
            Здесь будут заметки о поездке: маршруты, впечатления, напоминания.
          </Text>
        }
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.body || 'Без текста'}
            descriptionNumberOfLines={3}
            left={(props) => <List.Icon {...props} icon="note-text-outline" />}
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
                    Alert.alert('Удалить заметку?', item.title, [
                      { text: 'Отмена', style: 'cancel' },
                      { text: 'Удалить', style: 'destructive', onPress: () => removeNote(item.id) },
                    ])
                  }
                />
              </View>
            )}
          />
        )}
      />
      <FAB icon="plus" label="Заметка" style={styles.fab} onPress={() => setDialogVisible(true)} />
      <NoteDialog
        visible={dialogVisible}
        note={editing}
        onDismiss={closeDialog}
        onSubmit={(draft) => {
          if (editing) {
            updateNote(editing.id, draft);
          } else {
            addNote(draft);
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
