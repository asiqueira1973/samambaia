import { router } from 'expo-router';

import { PlantForm, type PlantFormValues } from '@/components/plant-form';
import { DEFAULT_FREQUENCY_DAYS } from '@/db/plants';
import { ensureNotificationPermission } from '@/lib/notifications';
import { usePlants } from '@/store/plants';

export default function NewPlantScreen() {
  const { addPlant } = usePlants();

  async function save(values: PlantFormValues) {
    await addPlant(values);
    // Pedimos a permissão aqui, com a primeira planta na mão: é o momento em
    // que o aviso de rega passa a fazer sentido para quem está usando.
    await ensureNotificationPermission();
    router.back();
  }

  return (
    <PlantForm
      title="Nova planta"
      submitLabel="Salvar planta"
      initialValues={{ name: '', photoUri: null, frequencyDays: DEFAULT_FREQUENCY_DAYS }}
      onSubmit={save}
      onCancel={() => router.back()}
    />
  );
}
