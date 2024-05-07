import { updateHTMLOutput } from './html';

export type FormatStyle = 'bold' | 'italic' | 'underline';

export function applyStyle(styleType: FormatStyle) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);
  const styleTags = getStyleElementTags(styleType);
  if (range.collapsed) {
    const newElement = createElementTree(styleTags);
    if (newElement) {
      insertEmptyStyledElementAtCursor(range, newElement);
    }
  } else {
    const selectionNode = range.startContainer.childNodes[range.startOffset];
    const nodeWrapper = checkNestedTags(selectionNode, styleTags);

    if (nodeWrapper) {
      unwrapNestedTags(nodeWrapper, styleTags.length);
    } else {
      const wrappingElement = createElementTree(styleTags);
      if (wrappingElement) {
        wrapTextWithElement(range, wrappingElement);
      }
    }
  }

  updateHTMLOutput();
}

function insertEmptyStyledElementAtCursor(range: Range, element: HTMLElement) {
  // Clear the contents of the element to ensure it's empty
  element.textContent = '';

  // Insert the empty styled element at the cursor position
  range.insertNode(element);

  // Create a new range to select the inserted element
  const newRange = document.createRange();

  // Set the start and end of the range to be inside the empty element
  newRange.setStart(element, 0);
  newRange.setEnd(element, 0);

  // Update the selection to the new range
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(newRange);

  element.appendChild(document.createTextNode('\u200B'));
  element.focus();
}

function wrapTextWithElement(range: Range, element: HTMLElement) {
  range.surroundContents(element.cloneNode(true));
}

function createElementTree(elementTags: string[]) {
  if (elementTags.length === 0) {
    return null;
  }

  const root = document.createElement(elementTags[0]);
  let parent = root;
  for (let i = 1; i < elementTags.length; i++) {
    const tag = elementTags[i];
    const element = document.createElement(tag);
    parent.appendChild(element);
    parent = element;
  }
  return root;
}

function checkNestedTags(node: Node, tags: string[]) {
  if (!node) {
    return null;
  }

  let current: Node | null = node;
  while (current) {
    const wrappingNode = findWrappingNode(current, tags);
    if (current.nodeType === Node.ELEMENT_NODE && wrappingNode) {
      return wrappingNode;
    }
    current = current.firstChild;
  }
  return null;
}

function findWrappingNode(node: Node, tags: string[]) {
  if (!node || tags.length === 0) {
    return null;
  }

  let current: Node | null = node;
  for (const tag of tags) {
    if (!current || current.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    if ((current as HTMLElement).tagName.toLowerCase() !== tag) {
      return null;
    }
    current = current.firstChild;
  }

  return node;
}

function unwrapNestedTags(node: Node, depth: number) {
  let current = node;
  for (let i = 0; i < depth; i++) {
    if (current.parentNode) {
      const parent = current.parentNode;
      while (current.firstChild) {
        parent.insertBefore(current.firstChild, current);
      }
      parent.removeChild(current);
      current = parent;
    }
  }
}

function getStyleElementTags(style: FormatStyle) {
  switch (style) {
    case 'bold':
      return ['strong'];
    case 'italic':
      return ['em'];
    case 'underline':
      return ['u'];
    default:
      return [];
  }
}
