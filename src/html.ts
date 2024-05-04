import { editor, htmlOutput } from './elements';

export function updateHTMLOutput() {
  const html = editor.innerHTML;
  htmlOutput.textContent = html;
}
