import { loadHomeData } from "../core/api/home-data.js";
import { getCurrentEncounters } from "../encounters/encounter.service.js";
import { renderEncounters } from "../encounters/encounter.view.js";
import { getErrorMessage, setLoaderVisible, showNotification } from "../core/ui/page-state.js";

export async function initHomePage(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#current-encounters");
  const loader = document.querySelector<HTMLElement>("#home-loader");

  if (!container || !loader) {
    showNotification("Les éléments de la page d'accueil sont introuvables.");
    return;
  }

  setLoaderVisible(loader, true);

  try {
    const data = await loadHomeData();
    const currentEncounters = getCurrentEncounters(data.encounters);

    renderEncounters(container, currentEncounters, data.teams, data.sports);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    showNotification(message);
    console.error("Erreur lors du chargement de la page d'accueil", error);
  } finally {
    setLoaderVisible(loader, false);
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
