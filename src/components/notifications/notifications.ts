import { notifications } from "@mantine/notifications";

const showSuccessNotification = (message: string): void => {
  notifications.show({
    title: "Success",
    message: message,
    color: "green",
  });
};

const showFailureNotification = (): void => {
  notifications.show({
    title: "Error",
    message: "Oh no! Better call Patric 😭",
    color: "pink",
  });
};

const showCustomFailureNotification = (message: string): void => {
  notifications.show({
    title: "Error",
    message,
    color: "red",
  });
};

export {
  showSuccessNotification,
  showFailureNotification,
  showCustomFailureNotification,
};
