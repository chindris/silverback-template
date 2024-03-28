export function avoidFocusOnClick() {
  requestAnimationFrame(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  });
}
