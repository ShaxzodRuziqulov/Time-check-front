export const useLocalStorage = () => {
    const setItem = (key: string, value: string) => localStorage.setItem(key, value);
    const getItem = (key: string) => localStorage.getItem(key);
    const removeItem = (key: string) => localStorage.removeItem(key);
    return { setItem, getItem, removeItem };
};