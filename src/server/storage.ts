export const getPersistentStorage = (key: string): string | null =>
  PropertiesService.getScriptProperties().getProperty(key);

export const setPersistentStorage = (key: string, value: string): void => {
  PropertiesService.getScriptProperties().setProperty(key, value);
};
