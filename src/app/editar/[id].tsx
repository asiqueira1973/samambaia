import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';

import { PlantForm, type PlantFormValues } from '@/components/plant-form';
import { usePlant, usePlants } from '@/store/plants';

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { loading, editPlant } = usePlants();
  const plant = usePlant(id);

  // A planta pode ter sido excluída em outra tela enquanto esta estava aberta.
  useEffect(() => {
    if (!loading && !plant) router.back();
  }, [loading, plant]);

  if (!plant) return null;

  async function save(values: PlantFormValues) {
    await editPlant(plant!.id, values);
    router.back();
  }

  return (
    <PlantForm
      title="Editar planta"
      submitLabel="Salvar alterações"
      initialValues={{
        name: plant.name,
        photoUri: plant.photoUri,
        frequencyDays: plant.frequencyDays,
      }}
      onSubmit={save}
      onCancel={() => router.back()}
    />
  );
}
