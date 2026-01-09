import React, { useEffect, useState, useRef, useMemo } from 'react'

const TILES = {
  FLOOR: 0,
  DESK: 1,
  COMPUTER: 2,
  CHAIR: 3,
  WHITEBOARD: 4,
  PIZZA: 5,
  COFFEE: 6,
  PLANT: 7,
  TRASH: 8,
  BEANBAG: 9,
  REDBULL: 10,
  RUBBER_DUCK: 11,
}

const LAB_MAP = [
  [4, 4, 4, 0, 0, 0, 0, 0, 0, 5, 5, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 10, 0],
  [2, 2, 0, 0, 2, 2, 0, 0, 2, 2, 0, 7],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
  [3, 3, 0, 0, 3, 3, 0, 0, 3, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
  [2, 2, 0, 0, 2, 2, 0, 11, 0, 0, 0, 9],
  [1, 1, 0, 0, 1, 1, 0, 0, 0, 8, 0, 0],
]

const TILE_SIZE = 34
const SCALE = 1

const renderTile = (type) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = TILE_SIZE
  canvas.width = size
  canvas.height = size
  
  ctx.fillStyle = '#d4d0c8'
  ctx.fillRect(0, 0, size, size)
  
  ctx.strokeStyle = 'rgba(0,0,0,0.05)'
  ctx.strokeRect(0, 0, size, size)
  
  switch(type) {
    case TILES.DESK:
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(2, 4, 20, 16)
      ctx.fillStyle = '#A0522D'
      ctx.fillRect(3, 5, 18, 14)
      ctx.fillStyle = '#654321'
      ctx.fillRect(4, 20, 3, 4)
      ctx.fillRect(17, 20, 3, 4)
      break
      
    case TILES.COMPUTER:
      ctx.fillStyle = '#2c2c2c'
      ctx.fillRect(4, 2, 16, 12)
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(5, 3, 14, 10)
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(6, 5, 8, 1)
      ctx.fillStyle = '#ff6b6b'
      ctx.fillRect(6, 7, 5, 1)
      ctx.fillStyle = '#4ecdc4'
      ctx.fillRect(6, 9, 10, 1)
      ctx.fillStyle = '#2c2c2c'
      ctx.fillRect(9, 14, 6, 2)
      ctx.fillRect(10, 16, 4, 4)
      ctx.fillStyle = '#3c3c3c'
      ctx.fillRect(4, 20, 16, 3)
      ctx.fillStyle = '#4a4a4a'
      for(let i = 0; i < 7; i++) {
        ctx.fillRect(5 + i*2, 21, 1, 1)
      }
      break
      
    case TILES.CHAIR:
      ctx.fillStyle = '#1e3a5f'
      ctx.fillRect(6, 8, 12, 8)
      ctx.fillStyle = '#15293e'
      ctx.fillRect(7, 2, 10, 6)
      ctx.fillStyle = '#2c2c2c'
      ctx.fillRect(8, 16, 2, 6)
      ctx.fillRect(14, 16, 2, 6)
      ctx.fillStyle = '#1a1a1a'
      ctx.fillRect(6, 21, 3, 3)
      ctx.fillRect(15, 21, 3, 3)
      break
      
    case TILES.WHITEBOARD:
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, 2, 24, 20)
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(2, 4, 20, 16)
      ctx.fillStyle = '#e94560'
      ctx.fillRect(4, 6, 2, 6)
      ctx.fillRect(6, 9, 2, 1)
      ctx.fillRect(8, 6, 2, 6)
      ctx.fillStyle = '#0f3460'
      ctx.fillRect(12, 7, 6, 4)
      ctx.strokeStyle = '#00adb5'
      ctx.beginPath()
      ctx.moveTo(15, 13)
      ctx.lineTo(15, 17)
      ctx.stroke()
      break
      
    case TILES.PIZZA:
      ctx.fillStyle = '#d4a574'
      ctx.fillRect(4, 8, 16, 14)
      ctx.fillStyle = '#c49464'
      ctx.fillRect(4, 8, 16, 3)
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(7, 12, 10, 8)
      ctx.fillStyle = '#ff6347'
      ctx.fillRect(9, 14, 2, 2)
      ctx.fillRect(13, 15, 2, 2)
      ctx.fillRect(11, 17, 2, 2)
      break
      
    case TILES.COFFEE:
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(8, 10, 8, 12)
      ctx.fillStyle = '#4a2c2a'
      ctx.fillRect(9, 11, 6, 4)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.fillRect(10, 6, 2, 3)
      ctx.fillRect(13, 7, 2, 2)
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(16, 13, 3, 6)
      ctx.fillStyle = '#d4d0c8'
      ctx.fillRect(17, 14, 1, 4)
      break
      
    case TILES.PLANT:
      ctx.fillStyle = '#8B4513'
      ctx.fillRect(8, 16, 8, 8)
      ctx.fillRect(6, 14, 12, 3)
      ctx.fillStyle = '#3d2817'
      ctx.fillRect(9, 14, 6, 2)
      ctx.fillStyle = '#228B22'
      ctx.fillRect(10, 4, 4, 10)
      ctx.fillRect(6, 6, 4, 6)
      ctx.fillRect(14, 6, 4, 6)
      ctx.fillStyle = '#32CD32'
      ctx.fillRect(11, 5, 2, 8)
      ctx.fillRect(7, 7, 2, 4)
      ctx.fillRect(15, 7, 2, 4)
      break
      
    case TILES.TRASH:
      ctx.fillStyle = '#4a4a4a'
      ctx.fillRect(6, 6, 12, 18)
      ctx.fillStyle = '#3a3a3a'
      ctx.fillRect(7, 7, 10, 16)
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(8, 2, 6, 5)
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(10, 4, 4, 2)
      ctx.fillStyle = '#ff6b6b'
      ctx.fillRect(14, 3, 3, 3)
      break
      
    case TILES.BEANBAG:
      ctx.fillStyle = '#9b59b6'
      ctx.fillRect(4, 10, 18, 14)
      ctx.fillStyle = '#8e44ad'
      ctx.fillRect(6, 8, 14, 4)
      ctx.fillRect(3, 14, 4, 8)
      ctx.fillRect(17, 14, 4, 8)
      ctx.fillStyle = '#a569bd'
      ctx.fillRect(8, 12, 8, 4)
      break
      
    case TILES.REDBULL:
      ctx.fillStyle = '#c0c0c0'
      ctx.fillRect(10, 8, 6, 14)
      ctx.fillStyle = '#1e3a8a'
      ctx.fillRect(10, 10, 6, 5)
      ctx.fillStyle = '#dc2626'
      ctx.fillRect(10, 15, 6, 4)
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(12, 11, 2, 2)
      break
      
    case TILES.RUBBER_DUCK:
      ctx.fillStyle = '#ffd700'
      ctx.fillRect(8, 12, 10, 10)
      ctx.fillRect(6, 14, 4, 6)
      ctx.fillRect(10, 6, 8, 8)
      ctx.fillStyle = '#ff8c00'
      ctx.fillRect(18, 8, 4, 4)
      ctx.fillStyle = '#000'
      ctx.fillRect(14, 8, 2, 2)
      ctx.fillStyle = '#ffed4a'
      ctx.fillRect(9, 14, 4, 4)
      break
  }
  
  return canvas.toDataURL()
}

const createCharacterSprite = (colors) => {
  const { hair, skin, shirt, pants } = colors
  
  const frames = {
    down: [
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,'#000',skin,'#000',skin,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,0,pants,0,0,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,'#000',skin,'#000',skin,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,pants,0,0,0,0,pants,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,'#000',skin,'#000',skin,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,0,pants,0,0,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,'#000',skin,'#000',skin,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,pants,0,0,0,0,pants,0],
      ],
    ],
    left: [
      [
        [0,0,hair,hair,hair,0,0,0],
        [0,hair,hair,hair,hair,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,skin,'#000',skin,0,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,shirt,shirt,shirt,skin,0,0,0],
        [0,0,shirt,shirt,0,0,0,0],
        [0,0,pants,pants,0,0,0,0],
      ],
      [
        [0,0,hair,hair,hair,0,0,0],
        [0,hair,hair,hair,hair,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,skin,'#000',skin,0,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,shirt,shirt,shirt,skin,0,0,0],
        [0,0,shirt,shirt,0,0,0,0],
        [0,pants,0,pants,0,0,0,0],
      ],
      [
        [0,0,hair,hair,hair,0,0,0],
        [0,hair,hair,hair,hair,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,skin,'#000',skin,0,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,shirt,shirt,shirt,skin,0,0,0],
        [0,0,shirt,shirt,0,0,0,0],
        [0,0,pants,pants,0,0,0,0],
      ],
      [
        [0,0,hair,hair,hair,0,0,0],
        [0,hair,hair,hair,hair,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,skin,'#000',skin,0,0,0,0],
        [0,skin,skin,skin,0,0,0,0],
        [0,shirt,shirt,shirt,skin,0,0,0],
        [0,0,shirt,shirt,0,0,0,0],
        [0,0,pants,0,pants,0,0,0],
      ],
    ],
    right: [
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,0,hair,hair,hair,hair,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,0,skin,'#000',skin,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,skin,shirt,shirt,shirt,0],
        [0,0,0,0,shirt,shirt,0,0],
        [0,0,0,0,pants,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,0,hair,hair,hair,hair,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,0,skin,'#000',skin,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,skin,shirt,shirt,shirt,0],
        [0,0,0,0,shirt,shirt,0,0],
        [0,0,0,pants,0,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,0,hair,hair,hair,hair,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,0,skin,'#000',skin,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,skin,shirt,shirt,shirt,0],
        [0,0,0,0,shirt,shirt,0,0],
        [0,0,0,0,pants,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,0,hair,hair,hair,hair,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,0,skin,'#000',skin,0],
        [0,0,0,0,skin,skin,skin,0],
        [0,0,0,skin,shirt,shirt,shirt,0],
        [0,0,0,0,shirt,shirt,0,0],
        [0,0,0,pants,0,0,pants,0],
      ],
    ],
    up: [
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,0,pants,0,0,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,pants,0,0,0,0,pants,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,0,pants,0,0,pants,0,0],
      ],
      [
        [0,0,0,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,hair,hair,hair,hair,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,0,skin,skin,skin,skin,0,0],
        [0,shirt,shirt,shirt,shirt,shirt,shirt,0],
        [0,0,shirt,shirt,shirt,shirt,0,0],
        [0,pants,0,0,0,0,pants,0],
      ],
    ],
  }
  
  return frames
}

const HACKERS = [
  { hair: '#1a1a2e', skin: '#ffd5c2', shirt: '#e94560', pants: '#1a1a2e' },
  { hair: '#553939', skin: '#ffe4c4', shirt: '#00adb5', pants: '#393e46' },
  { hair: '#2d2d2d', skin: '#deb887', shirt: '#7952b3', pants: '#212529' },
  { hair: '#8b4513', skin: '#ffdab9', shirt: '#28a745', pants: '#343a40' },
  { hair: '#000000', skin: '#f5deb3', shirt: '#fd7e14', pants: '#1a1a1a' },
]

const renderCharacterFrame = (frames, direction, frameNum, scale = 3) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = 8 * scale
  canvas.height = 8 * scale
  
  const frameData = frames[direction][frameNum]
  frameData.forEach((row, y) => {
    row.forEach((pixel, x) => {
      if (pixel !== 0) {
        ctx.fillStyle = pixel
        ctx.fillRect(x * scale, y * scale, scale, scale)
      }
    })
  })
  
  return canvas.toDataURL()
}

const Character = ({ characterIndex, gridX, gridY, isSeated }) => {
  const [direction, setDirection] = useState('down')
  const [frame, setFrame] = useState(0)
  const [position, setPosition] = useState({ x: gridX, y: gridY })
  const [isMoving, setIsMoving] = useState(false)
  const [targetPos, setTargetPos] = useState(null)
  const frames = useMemo(() => createCharacterSprite(HACKERS[characterIndex % HACKERS.length]), [characterIndex])
  
  useEffect(() => {
    if (isSeated) return
    
    const moveInterval = setInterval(() => {
      const directions = ['up', 'down', 'left', 'right']
      const newDir = directions[Math.floor(Math.random() * directions.length)]
      
      let newX = position.x
      let newY = position.y
      
      switch(newDir) {
        case 'up': newY = Math.max(0, position.y - 1); break
        case 'down': newY = Math.min(LAB_MAP.length - 1, position.y + 1); break
        case 'left': newX = Math.max(0, position.x - 1); break
        case 'right': newX = Math.min(LAB_MAP[0].length - 1, position.x + 1); break
      }
      
      const tile = LAB_MAP[newY]?.[newX]
      if (tile === TILES.FLOOR) {
        setDirection(newDir)
        setIsMoving(true)
        setTargetPos({ x: newX, y: newY })
        
        setTimeout(() => {
          setPosition({ x: newX, y: newY })
          setIsMoving(false)
        }, 300)
      } else {
        setDirection(newDir)
      }
    }, 1500 + Math.random() * 2000)
    
    return () => clearInterval(moveInterval)
  }, [position, isSeated])
  
  useEffect(() => {
    if (!isMoving && !isSeated) {
      setFrame(0)
      return
    }
    
    const animInterval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 150)
    
    return () => clearInterval(animInterval)
  }, [isMoving, isSeated])
  
  const spriteUrl = renderCharacterFrame(frames, direction, frame, 4)
  
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x * TILE_SIZE + 1,
        top: position.y * TILE_SIZE - 6,
        width: 34,
        height: 34,
        zIndex: position.y + 10,
        transition: isMoving ? 'left 0.3s linear, top 0.3s linear' : 'none',
        imageRendering: 'pixelated',
      }}
    >
      <img
        src={spriteUrl}
        alt="hacker"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.2))',
        }}
      />
    </div>
  )
}

const PanickingCharacter = () => {
  const [direction, setDirection] = useState('right')
  const [frame, setFrame] = useState(0)
  const [posX, setPosX] = useState(0)
  const frames = useMemo(() => createCharacterSprite({ 
    hair: '#ff0000',
    skin: '#ffd5c2', 
    shirt: '#ff4444',
    pants: '#1a1a1a' 
  }), [])
  
  useEffect(() => {
    let goingRight = true
    const runInterval = setInterval(() => {
      setPosX(prev => {
        const maxX = (LAB_MAP[0].length - 1) * TILE_SIZE
        if (goingRight) {
          if (prev >= maxX - 20) {
            goingRight = false
            setDirection('left')
            return prev - 8
          }
          return prev + 8
        } else {
          if (prev <= 20) {
            goingRight = true
            setDirection('right')
            return prev + 8
          }
          return prev - 8
        }
      })
    }, 30)
    
    return () => clearInterval(runInterval)
  }, [])
  
  useEffect(() => {
    const animInterval = setInterval(() => {
      setFrame(f => (f + 1) % 4)
    }, 80)
    
    return () => clearInterval(animInterval)
  }, [])
  
  const spriteUrl = renderCharacterFrame(frames, direction, frame, 4)
  
  return (
    <div
      style={{
        position: 'absolute',
        left: posX,
        top: 5 * TILE_SIZE - 6,
        width: 34,
        height: 34,
        zIndex: 100,
        imageRendering: 'pixelated',
      }}
    >
      <img
        src={spriteUrl}
        alt="panicking hacker"
        style={{
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.2))',
        }}
      />
      <div style={{
        position: 'absolute',
        top: -4,
        right: direction === 'right' ? -8 : 'auto',
        left: direction === 'left' ? -8 : 'auto',
        fontSize: '10px',
        animation: 'bounce 0.3s infinite',
      }}>
        💦
      </div>
    </div>
  )
}

export default function PixelCharacters({ count = 5 }) {
  const [tileImages, setTileImages] = useState({})
  
  useEffect(() => {
    const images = {}
    Object.values(TILES).forEach(type => {
      images[type] = renderTile(type)
    })
    setTileImages(images)
  }, [])
  
  const characterPositions = useMemo(() => {
    const positions = []
    const walkable = []
    
    LAB_MAP.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile === TILES.FLOOR) {
          walkable.push({ x, y })
        }
      })
    })
    
    for (let i = 0; i < count; i++) {
      if (walkable.length > 0) {
        const idx = Math.floor(Math.random() * walkable.length)
        positions.push({ ...walkable[idx], seated: false })
        walkable.splice(idx, 1)
      }
    }
    
    const seatedPositions = [
      { x: 0, y: 4, seated: true },
      { x: 4, y: 4, seated: true },
      { x: 9, y: 4, seated: true },
    ]
    
    return [...positions, ...seatedPositions]
  }, [count])
  
  return (
    <div
      style={{
        position: 'relative',
        width: LAB_MAP[0].length * TILE_SIZE,
        height: LAB_MAP.length * TILE_SIZE,
        overflow: 'hidden',
        imageRendering: 'pixelated',
        background: '#d4d0c8',
        margin: '0 auto',
      }}
    >
      {LAB_MAP.map((row, y) =>
        row.map((tile, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: x * TILE_SIZE,
              top: y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
              imageRendering: 'pixelated',
            }}
          >
            {tileImages[tile] && (
              <img
                src={tileImages[tile]}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                }}
              />
            )}
          </div>
        ))
      )}
      
      {characterPositions.map((pos, i) => (
        <Character
          key={i}
          characterIndex={i}
          gridX={pos.x}
          gridY={pos.y}
          isSeated={pos.seated}
        />
      ))}
      
      <PanickingCharacter />
      
      <div
        style={{
          position: 'absolute',
          bottom: 2,
          right: 4,
          fontSize: '8px',
          fontFamily: 'monospace',
          color: 'rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        hackathon.exe
      </div>
    </div>
  )
}
