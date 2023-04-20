const LOCAL_STORAGE_KEY = "guestMessages";

const saveNewMessageLocally = (id: string): void => {
  const previousMessages = getLocalMessages();
  previousMessages.push(id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(previousMessages));
};

const getLocalMessages = (): string[] => {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) ?? "[]");
};

export { saveNewMessageLocally, getLocalMessages };
