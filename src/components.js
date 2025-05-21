'use strict'

import { Flex, Link, Grid } from 'smbls'

export const Header = {
  extend: Flex,
  props: {
    minWidth: '100%',
    padding: 'Z B',
    align: 'center space-between'
  },

  Flex: {
    props: { gap: 'C' },
    childExtend: {
      extend: Link,
      props: ({ props }) => ({
        textDecoration: window.location.pathname === props.href ? 'underline' : 'none'
      })
    },
    Text_logo: { href: '/', text: 'Hello!' },
    Text_about: { href: '/about', text: 'About' }
  },

  ThemeSwitcher: {}
}

export const ThemeSwitcher = {
  extend: Flex,
  props: { gap: 'A2' },
  childExtend: {
    props: (element, state) => ({
      active: state.globalTheme === element.key,
      cursor: 'pointer',
      '.active': {
        fontWeight: '900'
      }
    }),
    on: {
      click: (event, element, state) => {
        state.update({ globalTheme: element.key })
      }
    }
  },
  dark: { text: 'Dark' },
  light: { text: 'Light' },
  midnight: { text: 'Midnight' },
}

export const Footer = {
  props: {
    padding: 'Z B',
    order: 9
  }
}

export const Cell = {
  extend: Flex,
  props: ({ props }) => ({
    round: '4px',
    border: '1px solid black',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    minWidth: '100%',
    minHeight: '100%',
    background: props.selected ? '#4d94ff' : '#e6f0ff',
    ':hover': {
      background: props.selected ? '#66a3ff' : '#c0c0c0'
    },
    text: `${props.col}, ${props.row}`
  }),
  attr: {
    'data-col': ({ props }) => props.col,
    'data-row': ({ props }) => props.row,
    // 'data-selected': ({ props }) => props.selected
  },
  on: {
    click: (event, element, state) => {
      console.log('Clicked cell:', {
        row: element.props.row,
        col: element.props.col,
        selected: element.props.selected
      });
      // console.log('Updating parent state')
      // state.parent.update({
      //   selected: !element.props.selected
      // })
    }
  }
}

export const SelectableGrid = {
  // H6: 'Grid Selection',
  state: {
    columns: 10,
    rows: 4,
    selectedCount: 0,
    cells: Array.from({ length: 4 }, (_, row) => 
      Array.from({ length: 10 }, (_, col) => (
        {
          selected: false,
          col: col + 1,
          row: row + 1,
        }
      ))
    )
  },
  childProps: (el, st) => ({
    Div: {
      Grid: {
        columns: ({ props }) => `repeat(${props.columns}, 1fr)`,
        children: ({ state }) => Array.from({ length: 10 }, (_, col) => 
          state.cells.map(row => row[col])
        ).flat(),
        childrenAs: 'state',
        childProps: (el, st) => ({
          Cell: {
            selected: st.selected,
            col: st.col,
            row: st.row,
          }
        })
      },
    }
  }),
  Div: {
    text: 'Selected: {selectedCount}'
  },
  on: {
    init: (element, state) => {
      console.log('Initializing grid:', {
        element: element,
        state: state
      });  
    },
    click: (event, element, state) => {
      const clickedCell = event.target;
      
      // Get row/col from data attributes
      const col = clickedCell.getAttribute('data-col');
      const row = clickedCell.getAttribute('data-row');

      if (!col || !row) {
        return;
      }
      
      // Select all cells above and to the left
      const clickedRow = parseInt(row) - 1;
      const clickedCol = parseInt(col) - 1;
      console.log(state.cells);
      const cells = state.cells;

      cells[clickedRow][clickedCol].selected = !cells[clickedRow][clickedCol].selected;

      // Select all cells in rows above
      for (let r = 0; r < clickedRow; r++) {
        cells[r][clickedCol].selected = !cells[r][clickedCol].selected;
      }

      // Select all cells in columns to the left
      for (let c = 0; c < clickedCol; c++) {
        cells[clickedRow][c].selected = !cells[clickedRow][c].selected;
      }

      console.log('Clicked cell:', cells[clickedRow][clickedCol]);

      state.apply(() => {
        console.log('Updating cells:', cells);
        state.cells = cells;
        console.log('Updated cells:', state.cells);
      });

      state.update({
        selectedCount: cells.flat().filter(cell => cell.selected).length
      });

      console.log('Selected count:', state.selectedCount);
    }
  }
}

// const videos = [
//   {
//     title: 'Organize and review libraries',
//     src: 'https://www.youtube.com/embed/5qo-zLDQdG0'
//   },
//   {
//     title: 'Publish to production',
//     src: 'https://www.youtube.com/embed/bXtvyqEC8Fo'
//   },
//   {
//     title: 'Documentation tools',
//     src: 'https://www.youtube.com/embed/llcDv3OvIw4'
//   }
// ]

// export const GridExample = {
//   Grid: {
//     columns: '1fr 1fr 1fr',
//     gap: 'B',
//     children: videos,
//     childrenAs: 'state',
//     childProps: (el, st) => ({
//       Div: { // represents GridItem element
//         H6: {
//           text: st.title
//         },
//         Iframe: {
//           src: st.src,
//         }
//       }
//     })
//   }
// }