'use strict'

const cells = Array.from({ length: 10 * 4 }, (_, i) => {
  const row = Math.floor(i / 10);
  const col = i % 10;
  return { row: row, col: col };
});

export default {
  '/': {
    SelectableGrid: {
      columns: 10,
      rows: 4,
      // cells: cells
    },
    // GridExample: {}
  },
  '/about': {
    H3: { text: 'This is Symbols starter-kit' },
    P: { text: 'Lorem ipsum dolor sit amet' }
  }
}
