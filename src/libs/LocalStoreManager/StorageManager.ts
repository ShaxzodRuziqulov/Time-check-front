import BaseStoreManager from "./BaseStoreManager";

class StoreManager extends BaseStoreManager {
    // Token
    static getUserToken() {
        return this.get(this.KEYS.userToken);
    }
    static setUserToken(value: string) {
        return this.set(this.KEYS.userToken, value);
    }
    static removeUserToken() {
        return this.remove(this.KEYS.userToken);
    }
}

export default StoreManager;
