import { loadHomeData } from "../core/api/home-data.js";
import { getCurrentEncounters } from "../encounters/encounter.service.js";
import { renderEncounters } from "../encounters/encounter.view.js";

function showNotification(message: string): void {
  const container = document.querySelector<HTMLElement>("#notification-container");

  if (!container) {
    return;
  }

  const notification = document.createElement("p");
  notification.textContent = message;
  notification.setAttribute("role", "alert");
  container.replaceChildren(notification);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

export async function initHomePage(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#current-encounters");
  const loader = document.querySelector<HTMLElement>("#home-loader");

  if (!container || !loader) {
    showNotification("Les éléments de la page d'accueil sont introuvables.");
    return;
  }

  try {
    const data = await loadHomeData();
    const currentEncounters = getCurrentEncounters(data.encounters);

    renderEncounters(container, currentEncounters, data.teams, data.sports);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    showNotification(message);
    console.error("Erreur lors du chargement de la page d'accueil", error);
  } finally {
    loader.hidden = true;
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void initHomePage();
    });
  } else {
    void initHomePage();
  }
}
