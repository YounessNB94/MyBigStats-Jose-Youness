export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Une erreur inconnue est survenue.";
}

export function showNotification(message: string): void {
  const container = document.querySelector<HTMLElement>("#notification-container");

  if (!container) {
    return;
  }

  const notification = document.createElement("p");
  notification.textContent = message;
  notification.setAttribute("role", "alert");
  container.replaceChildren(notification);
}

export function setLoaderVisible(loader: HTMLElement | null, visible: boolean): void {
  if (!loader) {
    return;
  }

  loader.hidden = !visible;
}
