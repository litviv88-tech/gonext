import { useEffect, useState } from 'react';
import { Dialog, Button, TextInput } from 'react-native-paper';

import type { Note } from '@/types/diary';

type NoteDialogProps = {
  visible: boolean;
  note?: Note | null;
  onDismiss: () => void;
  onSubmit: (draft: { title: string; body: string }) => void;
};

export function NoteDialog({ visible, note, onDismiss, onSubmit }: NoteDialogProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(note?.title ?? '');
      setBody(note?.body ?? '');
    }
  }, [note, visible]);

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{note ? 'Редактировать заметку' : 'Новая заметка'}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Заголовок"
          value={title}
          onChangeText={setTitle}
          autoFocus
          style={{ marginBottom: 12 }}
        />
        <TextInput label="Текст" value={body} onChangeText={setBody} multiline numberOfLines={5} />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Отмена</Button>
        <Button
          onPress={() => {
            if (!title.trim() && !body.trim()) {
              return;
            }
            onSubmit({
              title: title.trim() || 'Без названия',
              body,
            });
          }}
        >
          Сохранить
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
