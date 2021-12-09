// From http://www.umich.edu/~archive/apple2/misc/programmers/vt100.codes.txt
export const vt52Codes = new Map([
    ['J', ['Erase to end of screen']],
    ['K', ['Erase to end of line']],
]);

// From https://espterm.github.io/docs/VT100%20escape%20codes.html
export const ansiCompatible = new Map([
    ['[K', ['Erase from cursor to end of line']],
    ['[0K', ['Same']],
    ['[1K', ['Erase from beginning of line to cursor']],
    ['[2K', ['Erase line containing cursor']],
    ['[J', ['Erase from cursor to end of screen']],
    ['[0J', ['Same']],
    ['[2J', ['Erase entire screen']],
    ['[P', ['Delete character']],
    ['[0P', ['Delete character (0P)']],
    ['[2P', ['Delete 2 characters']],

    ['[g', ['Clear tab at current column']],
    ['[0g', ['Same']],
    ['[3g', ['Clear all tabs']],
]);

// From http://ascii-table.com/ansi-escape-sequences-vt-100.php
export const commonCodes = new Map([
    ['[g', ['Clear a tab at the current column', 'TBC']],
    ['[0g', ['Clear a tab at the current column', 'TBC']],
    ['[1g', ['Clear vertical tab stop at current line', 'TBC']],
    ['[2g', ['Clear all horizontal tab stops on current line only', 'TBC']],
    ['[3g', ['Clear all tabs', 'TBC']],

    ['[K', ['Clear line from cursor right', 'EL0']],
    ['[0K', ['Clear line from cursor right', 'EL0']],
    ['[1K', ['Clear line from cursor left', 'EL1']],
    ['[2K', ['Clear entire line', 'EL2']],
    ['[J', ['Clear screen from cursor down', 'ED0']],
    ['[0J', ['Clear screen from cursor down', 'ED0']],
    ['[1J', ['Clear screen from cursor up', 'ED1']],
    ['[2J', ['Clear entire screen', 'ED2']],
    ['[3J', ['Erase whole display including scroll-back buffer', 'ED3']],

    ['c', ['Reset terminal to initial state', 'RIS']],
]);

export const allCodes = new Map([
    ...vt52Codes,
    ...ansiCompatible,
    ...commonCodes,
])
