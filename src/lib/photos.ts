import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

/**
 * O seletor de imagens devolve um arquivo em cache, que o sistema pode apagar
 * a qualquer momento. Copiamos a foto para o diretório de documentos do app
 * para que ela sobreviva a reinícios e limpezas de cache.
 */
const PHOTOS_DIRECTORY = 'plantas';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

function photosDirectory(): Directory {
  const directory = new Directory(Paths.document, PHOTOS_DIRECTORY);
  if (!directory.exists) {
    directory.create({ intermediates: true, idempotent: true });
  }
  return directory;
}

async function persist(temporaryUri: string): Promise<string> {
  const source = new File(temporaryUri);
  const extension = source.extension || '.jpg';
  const destination = new File(photosDirectory(), `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extension}`);
  await source.copy(destination);
  return destination.uri;
}

/** Abre a câmera. Devolve `null` se o usuário cancelar ou negar a permissão. */
export async function takePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]) return null;

  return persist(result.assets[0].uri);
}

/** Abre a galeria. Devolve `null` se o usuário cancelar ou negar a permissão. */
export async function pickPhotoFromLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;

  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  if (result.canceled || !result.assets[0]) return null;

  return persist(result.assets[0].uri);
}

/** Apaga a foto guardada pelo app. Silencioso se o arquivo já não existir. */
export function deletePhoto(uri: string | null | undefined): void {
  if (!uri || !uri.includes(PHOTOS_DIRECTORY)) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // Uma foto órfã não justifica quebrar a exclusão da planta.
  }
}
