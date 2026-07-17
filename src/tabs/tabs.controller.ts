export function initializeTabs(): void {
  const tabButtons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("[data-tab-target]")
  );
  const tabContents = document.querySelectorAll<HTMLElement>(
    "[data-tab-content]"
  );

  function activateTab(target: string | undefined): void {
    tabContents.forEach((content) => {
      content.hidden = content.dataset.tabContent !== target;
    });

    tabButtons.forEach((button) => {
      const isActive = button.dataset.tabTarget === target;
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activateTab(button.dataset.tabTarget);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }

      event.preventDefault();

      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex =
        (index + direction + tabButtons.length) % tabButtons.length;
      const nextButton = tabButtons[nextIndex];

      nextButton.focus();
      activateTab(nextButton.dataset.tabTarget);
    });
  });
}
