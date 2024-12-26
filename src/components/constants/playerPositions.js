export function getPlayerPositions(num) {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    // Mobile Positions
    if (num === 2) {
      return [
        { colStart: 1, rowStart: 2 },
        { colStart: 9, rowStart: 2 },
      ];
    } else if (num === 3) {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 5, rowStart: 1 },
        { colStart: 9, rowStart: 3 },
      ];
    } else if (num === 4) {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 1, rowStart: 1 },
        { colStart: 9, rowStart: 1 },
        { colStart: 9, rowStart: 3 },
      ];
    } else {
      return [
        { colStart: 1, rowStart: 4 },
        { colStart: 1, rowStart: 2 },
        { colStart: 5, rowStart: 1 },
        { colStart: 9, rowStart: 2 },
        { colStart: 9, rowStart: 4 },
      ];
    }
  } else if (screenWidth <= 1024) {
    // Tablet Positions
    if (num === 2) {
      return [
        { colStart: 2, rowStart: 2 },
        { colStart: 10, rowStart: 2 },
      ];
    } else if (num === 3) {
      return [
        { colStart: 1, rowStart: 2 },
        { colStart: 5, rowStart: 1 },
        { colStart: 9, rowStart: 2 },
      ];
    } else if (num === 4) {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 3, rowStart: 1 },
        { colStart: 8, rowStart: 1 },
        { colStart: 10, rowStart: 3 },
      ];
    } else {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 1, rowStart: 1 },
        { colStart: 6, rowStart: 1 },
        { colStart: 10, rowStart: 1 },
        { colStart: 10, rowStart: 3 },
      ];
    }
  } else {
    // Desktop Positions
    if (num === 2) {
      return [
        { colStart: 3, rowStart: 1 },
        { colStart: 9, rowStart: 1 },
      ];
    } else if (num === 3) {
      return [
        { colStart: 2, rowStart: 1 },
        { colStart: 6, rowStart: 1 },
        { colStart: 10, rowStart: 1 },
      ];
    } else if (num === 4) {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 4, rowStart: 1 },
        { colStart: 8, rowStart: 1 },
        { colStart: 11, rowStart: 3 },
      ];
    } else {
      return [
        { colStart: 1, rowStart: 3 },
        { colStart: 3, rowStart: 1 },
        { colStart: 6, rowStart: 1 },
        { colStart: 9, rowStart: 1 },
        { colStart: 11, rowStart: 3 },
      ];
    }
  }
}