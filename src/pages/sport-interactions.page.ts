import { getAthletes, getAthletesBySportId } from "../athletes/athlete.service.js";
import { renderAthletes } from "../athletes/athlete.view.js";
import {
  getAthleteFilterElements,
  initializeAthleteFilters
} from "../filters/filter.service.js";
import {
  getComparatorElements,
  initializeComparator
} from "../comparator/comparator.view.js";
import { notifyError } from "../core/notifications/notification.view.js";
import { AppError } from "../core/errors/api.errors.js";
import { calculateSportStatistics } from "../sports/sport.statistics.js";
import { renderSportStatistics } from "../sports/sport.statistics.view.js";
import { renderSportHistory } from "../encounters/encounter.view.js";
import { loadSportPageData } from "./sport-data.page.js";

type SportView = "stats" | "history" | "athletes";

function getCurrentSportView(): SportView {
  const bodyView = document.body.dataset.sportView;

  if (
    bodyView === "stats" ||
    bodyView === "history" ||
    bodyView === "athletes"
  ) {
    return bodyView;
  }

  const query = new URLSearchParams(window.location.search).get("view");

  if (query === "history") {
    return "history";
  }

  if (query === "athletes") {
    return "athletes";
  }

  return "stats";
}

function setActiveSportView(view: SportView): void {
  const sections = document.querySelectorAll<HTMLElement>("[data-view-section]");
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-view-link]");

  sections.forEach((section) => {
    const sectionView = section.dataset.viewSection as SportView | undefined;
    section.hidden = sectionView !== view;
  });

  links.forEach((link) => {
    const isActive = link.dataset.viewLink === view;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

async function initSportInteractions(): Promise<void> {
  try {
    const sportPageData = await loadSportPageData();
    const currentView = getCurrentSportView();

    const statisticsContainer = document.querySelector<HTMLElement>(
      "#sport-statistics"
    );
    const historyContainer = document.querySelector<HTMLElement>("#sport-history");
    const athleteListContainer = document.querySelector<HTMLElement>(
      "#athlete-list"
    );
    const comparatorElements = getComparatorElements();

    setActiveSportView(currentView);

    if (currentView === "stats" && statisticsContainer) {
      renderSportStatistics(
        statisticsContainer,
        calculateSportStatistics(sportPageData.encounters, sportPageData.teams)
      );
    }

    if (currentView === "history" && historyContainer) {
      renderSportHistory(
        historyContainer,
        sportPageData.encounters,
        sportPageData.teams,
        sportPageData.sports
      );
    }

    if (currentView === "stats" || currentView === "athletes") {
      const athletes = await getAthletes();
      const sportAthletes = getAthletesBySportId(
        athletes,
        sportPageData.sport.id
      );

      if (currentView === "stats" && comparatorElements) {
        initializeComparator(comparatorElements, sportAthletes);
      }

      if (currentView === "athletes") {
        const filterElements = getAthleteFilterElements();

        if (filterElements) {
          initializeAthleteFilters(filterElements, sportAthletes);
        } else if (athleteListContainer) {
          renderAthletes(athleteListContainer, sportAthletes);
        }
      }
    }
  } catch (error: unknown) {
    notifyError(getErrorMessage(error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  void initSportInteractions();
});
