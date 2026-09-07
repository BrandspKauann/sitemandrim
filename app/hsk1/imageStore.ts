'use client';

type StoredImage = {
  key: string;
  blob: Blob;
  updatedAt: number;
};

const DATABASE_NAME = 'tons-de-mandarim-images';
const DATABASE_VERSION = 1;
const STORE_NAME = 'hsk1-images';

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('O navegador não oferece armazenamento local de imagens.'));
      return;
    }

    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Não consegui abrir o armazenamento local.'));
  });
}

async function withStore<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
) {
  const database = await openDatabase();
  return new Promise<T>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, mode);
    const request = operation(transaction.objectStore(STORE_NAME));
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Não consegui acessar a imagem salva.'));
    transaction.oncomplete = () => database.close();
    transaction.onerror = () => {
      database.close();
      reject(transaction.error ?? new Error('Não consegui concluir o armazenamento da imagem.'));
    };
  });
}

export function saveLocalImage(key: string, blob: Blob) {
  return withStore('readwrite', (store) => store.put({ key, blob, updatedAt: Date.now() } satisfies StoredImage));
}

export function deleteLocalImage(key: string) {
  return withStore('readwrite', (store) => store.delete(key));
}

export async function listLocalImages(prefix: string) {
  const records = await withStore<StoredImage[]>('readonly', (store) => store.getAll());
  return records.filter((record) => record.key.startsWith(prefix));
}
