export const PATTERNS = {
  SCANLINES: 'scanlines',
  NOISE: 'noise',
  GRID: 'grid',
  DOTS: 'dots',
  NONE: 'none',
}

export const customPatterns = {
  diagonalLines: {
    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.03) 10px, rgba(0,0,0,.03) 20px)',
  },
  checkerboard: {
    backgroundImage: `linear-gradient(45deg, rgba(0,0,0,.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(0,0,0,.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(0,0,0,.05) 75%)`,
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  },
  crtScanlines: {
    backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,.1) 1px, rgba(0,0,0,.1) 2px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.02) 2px, rgba(0,0,0,.02) 4px)`,
  },
}
