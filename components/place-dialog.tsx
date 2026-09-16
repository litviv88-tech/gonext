import { useEffect, useState } from 'react';
import { Dialog, Button, TextInput } from 'react-native-paper';

import type { Place } from '@/types/diary';

type PlaceDialogProps = {
  visible: boolean;
  place?: Place | null;
  latitude?: number;
  longitude?: number;
  onDismiss: () => void;
  onSubmit: (draft: { title: string; comment: string; latitude?: number; longitude?: number }) => void;
};

export function PlaceDialog({
  visible,
  place,
  latitude,
  longitude,
  onDismiss,
  onSubmit,
}: PlaceDialogProps) {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(place?.title ?? '');
      setComment(place?.comment ?? '');
    }
  }, [place, visible]);

  const coords =
    latitude != null && longitude != null
      ? { latitude, longitude }
      : place?.latitude != null && place.longitude != null
        ? { latitude: place.latitude, longitude: place.longitude }
        : undefined;

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{place ? 'Редактировать место' : 'Куда сходить'}</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Название места"
          value={title}
          onChangeText={setTitle}
          autoFocus
          style={{ marginBottom: 12 }}
        />
        <TextInput
          label="Заметка"
          value={comment}
          onChangeText={setComment}
          multiline
        />
        {coords ? (
          <TextInput
            label="Координаты"
            value={`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`}
            editable={false}
            style={{ marginTop: 12 }}
          />
        ) : null}
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Отмена</Button>
        <Button
          onPress={() => {
            if (!title.trim()) {
              return;
            }
            onSubmit({
              title,
              comment,
              latitude: coords?.latitude,
              longitude: coords?.longitude,
            });
          }}
        >
          Сохранить
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
