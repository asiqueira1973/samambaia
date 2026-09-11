import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FrequencyStepper } from '@/components/frequency-stepper';
import { PlantPhoto } from '@/components/plant-photo';
import { PrimaryButton } from '@/components/primary-button';
import { DEFAULT_FREQUENCY_DAYS } from '@/db/plants';
import { showActionSheet } from '@/lib/action-sheet';
import { ensureNotificationPermission } from '@/lib/notifications';
import { deletePhoto, pickPhotoFromLibrary, takePhoto } from '@/lib/photos';
import { usePlants } from '@/store/plants';
import { colors, radius, screenPadding } from '@/theme';

export default function NewPlantScreen() {
  const insets = useSafeAreaInsets();
  const { addPlant } = usePlants();

  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [frequencyDays, setFrequencyDays] = useState(DEFAULT_FREQUENCY_DAYS);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  async function choosePhoto(source: 'camera' | 'library') {
    const uri = source === 'camera' ? await takePhoto() : await pickPhotoFromLibrary();
    if (!uri) return;
    // Troca de foto: a anterior já estava copiada para dentro do app.
    deletePhoto(photoUri);
    setPhotoUri(uri);
  }

  function openPhotoOptions() {
    showActionSheet('Foto da planta', [
      { label: 'Tirar foto', onPress: () => choosePhoto('camera') },
      { label: 'Escolher da galeria', onPress: () => choosePhoto('library') },
      ...(photoUri
        ? [
            {
              label: 'Remover foto',
              destructive: true,
              onPress: () => {
                deletePhoto(photoUri);
                setPhotoUri(null);
              },
            },
          ]
        : []),
    ]);
  }

  function cancel() {
    deletePhoto(photoUri);
    router.back();
  }

  async function save() {
    if (!canSave) return;
    setSaving(true);
    try {
      await addPlant({ name, photoUri, frequencyDays });
      // Pedimos a permissão aqui, com a primeira planta na mão: é o momento em
      // que o aviso de rega passa a fazer sentido para quem está usando.
      await ensureNotificationPermission();
      router.back();
    } catch (error) {
      setSaving(false);
      Alert.alert('Não deu para salvar', 'Tente de novo em instantes.');
      console.error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Pressable accessibilityRole="button" onPress={cancel} hitSlop={8}>
          <Text style={styles.cancel}>Cancelar</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Nova planta</Text>
        <Pressable accessibilityRole="button" disabled={!canSave} onPress={save} hitSlop={8}>
          <Text style={[styles.save, !canSave && styles.saveDisabled]}>Salvar</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={photoUri ? 'Trocar a foto da planta' : 'Adicionar foto da planta'}
          onPress={openPhotoOptions}
          style={[styles.photoFrame, !photoUri && styles.photoFrameEmpty]}>
          {photoUri ? (
            <PlantPhoto uri={photoUri} placeholderSize={64} style={styles.photo} />
          ) : (
            <Text style={styles.photoHint}>Adicionar foto</Text>
          )}
        </Pressable>

        <View style={styles.field}>
          <Text style={styles.label}>Nome</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Samambaia"
            placeholderTextColor={colors.textDisabled}
            style={styles.nameInput}
            autoCapitalize="sentences"
            returnKeyType="done"
            maxLength={60}
          />
        </View>

        <View style={styles.frequency}>
          <Text style={styles.label}>Frequência de rega</Text>
          <FrequencyStepper value={frequencyDays} onChange={setFrequencyDays} />
          <Text style={styles.frequencyHint}>
            {frequencyDays === 1
              ? 'Você será avisado todo dia, às 9h.'
              : `Você será avisado a cada ${frequencyDays} dias, às 9h.`}
          </Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <PrimaryButton label="Salvar planta" onPress={save} disabled={!canSave} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding,
    paddingBottom: 22,
  },
  cancel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textFaint,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  save: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.green,
  },
  saveDisabled: {
    color: colors.textDisabled,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingBottom: 24,
  },
  photoFrame: {
    height: 260,
    borderRadius: radius.photoLarge,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoFrameEmpty: {
    backgroundColor: colors.surfaceDashed,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.greenBorder,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoHint: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textMuted,
  },
  field: {
    marginTop: 30,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textFaint,
  },
  nameInput: {
    borderBottomWidth: 1.5,
    borderBottomColor: colors.green,
    paddingHorizontal: 2,
    paddingTop: 6,
    paddingBottom: 12,
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
  },
  frequency: {
    marginTop: 34,
    gap: 14,
  },
  frequencyHint: {
    fontSize: 14,
    color: colors.textFaint,
  },
  footer: {
    paddingHorizontal: screenPadding,
    paddingTop: 8,
  },
});
