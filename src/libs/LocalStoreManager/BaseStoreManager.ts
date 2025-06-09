type KeyLocalStorage = keyof typeof BaseStoreManager.KEYS;

class BaseStoreManager {
    static KEYS = {
        userToken: 'userToken',
    } as const;

    protected static get(key: KeyLocalStorage) {
        const rawValue = localStorage.getItem(key);

        if (rawValue !== null) {
            return rawValue;
        }

        return null;
    }

    protected static set(key: KeyLocalStorage, value: string) {
        localStorage.setItem(key, value);
        return true;
    }

    protected static remove(key: KeyLocalStorage) {
        localStorage.removeItem(key);
        return true;
    }
}

export default BaseStoreManager;
