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
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FrequencyStepper } from '@/components/frequency-stepper';
import { PlantPhoto } from '@/components/plant-photo';
import { PrimaryButton } from '@/components/primary-button';
import { showActionSheet } from '@/lib/action-sheet';
import { deletePhoto, pickPhotoFromLibrary, takePhoto } from '@/lib/photos';
import { colors, radius, screenPadding } from '@/theme';

export type PlantFormValues = {
  name: string;
  photoUri: string | null;
  frequencyDays: number;
};

type Props = {
  title: string;
  submitLabel: string;
  initialValues: PlantFormValues;
  onSubmit: (values: PlantFormValues) => Promise<void>;
  onCancel: () => void;
};

/**
 * Formulário de planta, igual no cadastro e na edição: foto, nome e frequência.
 *
 * As fotos escolhidas aqui já foram copiadas para dentro do app, então toda
 * foto que não é a inicial e deixa de ser usada é apagada na hora — só a
 * inicial sobrevive, porque ainda pertence à planta gravada no banco.
 */
export function PlantForm({ title, submitLabel, initialValues, onSubmit, onCancel }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  // Numa tela baixa (16:9), a foto de 260 empurra o seletor de frequência para
  // fora da área visível. Aqui ela cede espaço; nas telas altas fica no
  // tamanho do mockup.
  const photoHeight = Math.min(260, Math.max(140, height - 500));

  const [name, setName] = useState(initialValues.name);
  const [photoUri, setPhotoUri] = useState(initialValues.photoUri);
  const [frequencyDays, setFrequencyDays] = useState(initialValues.frequencyDays);
  const [saving, setSaving] = useState(false);

  const canSave = name.trim().length > 0 && !saving;

  /** Troca a foto da tela, descartando a anterior se ela nasceu nesta edição. */
  function replacePhoto(uri: string | null) {
    if (photoUri !== initialValues.photoUri) deletePhoto(photoUri);
    setPhotoUri(uri);
  }

  async function choosePhoto(source: 'camera' | 'library') {
    const uri = source === 'camera' ? await takePhoto() : await pickPhotoFromLibrary();
    if (!uri) return;
    replacePhoto(uri);
  }

  function openPhotoOptions() {
    showActionSheet('Foto da planta', [
      { label: 'Tirar foto', onPress: () => choosePhoto('camera') },
      { label: 'Escolher da galeria', onPress: () => choosePhoto('library') },
      ...(photoUri
        ? [{ label: 'Remover foto', destructive: true, onPress: () => replacePhoto(null) }]
        : []),
    ]);
  }

  function cancel() {
    replacePhoto(initialValues.photoUri);
    onCancel();
  }

  async function submit() {
    if (!canSave) return;
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), photoUri, frequencyDays });
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
        <Text style={styles.headerTitle}>{title}</Text>
        <Pressable accessibilityRole="button" disabled={!canSave} onPress={submit} hitSlop={8}>
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
          style={[
            styles.photoFrame,
            { height: photoHeight },
            !photoUri && styles.photoFrameEmpty,
          ]}>
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
        <PrimaryButton label={submitLabel} onPress={submit} disabled={!canSave} />
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
