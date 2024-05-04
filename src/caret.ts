let savedRange: Range | null = null;

export function saveCaretPosition(context: HTMLElement) {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) {
    savedRange = sel.getRangeAt(0);
  }
}

export function restoreCaretPosition(context: HTMLElement) {
  const sel = window.getSelection();
  if (sel && savedRange) {
    sel.removeAllRanges();
    sel.addRange(savedRange);
  }
}
