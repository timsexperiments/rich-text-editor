import { editor, htmlOutput } from './elements';
import { updateHTMLOutput } from './html';

import './actions.ts';
import './style.css';

editor.addEventListener('focus', function () {
  if (editor.innerHTML?.trim() === 'Start typing here...') {
    editor.textContent = '';
    updateHTMLOutput();
  }
});

editor.addEventListener('blur', function () {
  if (this.innerHTML?.trim() === '') {
    this.textContent = 'Start typing here...';
    htmlOutput.textContent = '';
  }
});

document.addEventListener('input', () => {
  updateHTMLOutput();
});
