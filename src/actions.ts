import { restoreCaretPosition, saveCaretPosition } from './caret';
import { bold, italic, underline } from './elements';
import { applyStyle } from './format';

const editor = document.querySelector('#editor') as HTMLElement;

bold.addEventListener('mousedown', (event) => {
  event.preventDefault();
  saveCaretPosition(editor);
  applyStyle('bold');
  restoreCaretPosition(editor);
});

italic.addEventListener('mousedown', (event) => {
  event.preventDefault();
  saveCaretPosition(editor);
  applyStyle('italic');
  restoreCaretPosition(editor);
});

underline.addEventListener('mousedown', (event) => {
  event.preventDefault();
  saveCaretPosition(editor);
  applyStyle('underline');
  restoreCaretPosition(editor);
});
