const dark = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: 'C792EA' },
    { token: 'type', foreground: 'C792EA' },
    { token: 'string', foreground: 'C3E88D' },
    { token: 'number', foreground: 'F78C6C' },
    { token: 'comment', foreground: '5A6270', fontStyle: 'italic' },
    { token: 'delimiter', foreground: '89DDFF' },
    { token: 'operator', foreground: '89DDFF' },
    { token: 'identifier', foreground: 'A0A4AB' },
  ],
  colors: {
    'editor.background': '#0E1013',
    'editor.foreground': '#EDEEF0',
    'editorLineNumber.foreground': '#484E57',
    'editorLineNumber.activeForeground': '#A0A4AB',
    'editor.lineHighlightBackground': '#FFFFFF09',
    'editorCursor.foreground': '#EDEEF0',
    'editorIndentGuide.background1': '#FFFFFF12',
  },
};

const light = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '8250DF' },
    { token: 'type', foreground: '8250DF' },
    { token: 'string', foreground: '0A7C42' },
    { token: 'number', foreground: 'B45309' },
    { token: 'comment', foreground: '9AA0A8', fontStyle: 'italic' },
    { token: 'delimiter', foreground: '0E7490' },
    { token: 'operator', foreground: '0E7490' },
    { token: 'identifier', foreground: '5B6068' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#16181C',
    'editorLineNumber.foreground': '#AFB4BB',
    'editorLineNumber.activeForeground': '#5B6068',
    'editor.lineHighlightBackground': '#10121609',
    'editorCursor.foreground': '#16181C',
    'editorIndentGuide.background1': '#10121618',
  },
};

export function registerThemes(monaco) {
  monaco.editor.defineTheme('collab-dark', dark);
  monaco.editor.defineTheme('collab-light', light);
}