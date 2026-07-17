export type NotificationType = "success" | "error" | "info";

const NOTIFICATION_TITLES: Record<NotificationType, string> = {
  success: "Succès",
  error: "Erreur",
  info: "Information"
};

const NOTIFICATION_DURATION_MS = 5000;

export function showNotification(
  message: string,
  type: NotificationType = "info"
): void {
  const container = document.querySelector<HTMLElement>(
    "#notification-container"
  );

  if (!container) {
    console.error(message);
    return;
  }

  const notification = document.createElement("div");
  notification.classList.add("notification", `notification--${type}`);

  const header = document.createElement("div");
  header.classList.add("notification__header");

  const title = document.createElement("strong");
  title.textContent = NOTIFICATION_TITLES[type];

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.classList.add("notification__close");
  closeButton.setAttribute("aria-label", "Fermer la notification");
  closeButton.textContent = "×";

  header.append(title, closeButton);

  const messageElement = document.createElement("p");
  messageElement.classList.add("notification__message");
  messageElement.textContent = message;

  notification.append(header, messageElement);
  container.append(notification);

  const timeoutId = window.setTimeout(() => {
    notification.remove();
  }, NOTIFICATION_DURATION_MS);

  closeButton.addEventListener("click", () => {
    window.clearTimeout(timeoutId);
    notification.remove();
  });
}

export function notifySuccess(message: string): void {
  showNotification(message, "success");
}

export function notifyError(message: string): void {
  showNotification(message, "error");
}

export function notifyInfo(message: string): void {
  showNotification(message, "info");
}
