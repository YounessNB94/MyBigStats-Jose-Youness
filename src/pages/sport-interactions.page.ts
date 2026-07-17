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
import { initializeTabs } from "../tabs/tabs.controller.js";
import { notifyError } from "../core/notifications/notification.view.js";
import { AppError, SportNotFoundError } from "../core/errors/api.errors.js";
import type { SportSlug } from "../sports/sport.types.js";

const SPORT_IDS_BY_SLUG: Record<SportSlug, 1 | 2 | 3> = {
  football: 1,
  basketball: 2,
  mma: 3
};

function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  return "Une erreur inattendue est survenue.";
}

async function initSportInteractions(): Promise<void> {
  initializeTabs();

  try {
    const slug = document.body.dataset.sportSlug as SportSlug | undefined;
    const sportId = slug ? SPORT_IDS_BY_SLUG[slug] : undefined;

    if (!sportId) {
      throw new SportNotFoundError(slug ?? "inconnu");
    }

    const athletes = await getAthletes();
    const sportAthletes = getAthletesBySportId(athletes, sportId);

    const filterElements = getAthleteFilterElements();
    const athleteListContainer = document.querySelector<HTMLElement>(
      "#athlete-list"
    );

    if (filterElements) {
      initializeAthleteFilters(filterElements, sportAthletes);
    } else if (athleteListContainer) {
      renderAthletes(athleteListContainer, sportAthletes);
    }

    const comparatorElements = getComparatorElements();

    if (comparatorElements) {
      initializeComparator(comparatorElements, sportAthletes);
    }
  } catch (error: unknown) {
    notifyError(getErrorMessage(error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  void initSportInteractions();
});
