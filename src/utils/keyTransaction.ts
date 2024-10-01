const CRYPTO_DB = 'cryptoKeysDB';
const CRYPTO_TABLE = 'keys';

export enum KeyTransaction {
    SELF_PK = 'selfPk',
    PARTNER_PK = 'partnerPk'
}

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CRYPTO_DB, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            db.createObjectStore(CRYPTO_TABLE, { keyPath: "id" });
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject("IndexedDB error: " + (event.target as IDBOpenDBRequest).error);
        };
    });
};

export const storeKey = async (keyId: string, key: CryptoKey | null) => {
    const db = await openDB();
    const transaction = db.transaction(CRYPTO_TABLE, "readwrite");
    const store = transaction.objectStore(CRYPTO_TABLE);

    store.put({ id: keyId, key });

    return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getKey = async (keyId: string): Promise<CryptoKey | null> => {
    const db = await openDB();
    const transaction = db.transaction(CRYPTO_TABLE, "readonly");
    const store = transaction.objectStore(CRYPTO_TABLE);

    return new Promise((resolve, reject) => {
        const request = store.get(keyId);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.key);
            } else {
                resolve(null);
            }
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
};