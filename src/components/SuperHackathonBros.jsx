import React, { useEffect, useRef, useState } from 'react';

// ==========================================
// ASSET GENERATORS (Programmatic Pixel Art)
// ==========================================

// Color Palette
const COLORS = {
  SKY: '#5c94fc', // SMB World 1-1 Sky
  GROUND_LIGHT: '#E49470', // Classic ground
  GROUND_DARK: '#C84C0C',
  GROUND_OUTLINE: '#000000',
  BRICK: '#B84C0C',
  BRICK_MORTAR: '#000000',
  QUESTION: '#FC9838', // Question block gold
  PIPE_LIGHT: '#80D010',
  PIPE_DARK: '#007C00',
  PIPE_OUTLINE: '#000000',
  CLOUD: '#FFFFFF',
  BUSH: '#00C800',
  MARIO_SKIN: '#FCC49C',
  MARIO_RED: '#D82800',
  MARIO_BLUE: '#0000E4',
  MARIO_HAIR: '#684000',
};

const TILE_SIZE = 32;

// Draw a single ground block
const drawGround = (ctx, x, y) => {
  ctx.fillStyle = COLORS.GROUND_LIGHT;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Detail
  ctx.fillStyle = COLORS.GROUND_DARK;
  ctx.fillRect(x + 4, y + 4, 4, 4);
  ctx.fillRect(x + 12, y + 8, 8, 2);
  ctx.fillRect(x + 24, y + 4, 2, 8);
  
  // Top border
  ctx.fillStyle = COLORS.GROUND_OUTLINE;
  ctx.fillRect(x, y, TILE_SIZE, 2);
  ctx.fillRect(x, y, 2, TILE_SIZE);
};

// Draw a brick block
const drawBrick = (ctx, x, y) => {
  ctx.fillStyle = COLORS.BRICK;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Mortar lines
  ctx.fillStyle = COLORS.BRICK_MORTAR;
  ctx.fillRect(x, y, TILE_SIZE, 2); // Top
  ctx.fillRect(x, y + 15, TILE_SIZE, 2); // Middle
  
  ctx.fillRect(x, y, 2, 16); // Top-left vertical
  ctx.fillRect(x + 16, y, 2, 16); // Top-mid vertical
  
  ctx.fillRect(x + 8, y + 16, 2, 16); // Bottom-offset vertical
  ctx.fillRect(x + 24, y + 16, 2, 16); // Bottom-right vertical
};

// Draw a question block
const drawQuestion = (ctx, x, y, frame) => {
  // Flash effect
  const color = frame % 60 < 30 ? COLORS.QUESTION : '#ffcc99';
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  // Corners (bolts)
  ctx.fillStyle = COLORS.BRICK_MORTAR;
  ctx.fillRect(x + 2, y + 2, 2, 2);
  ctx.fillRect(x + 28, y + 2, 2, 2);
  ctx.fillRect(x + 2, y + 28, 2, 2);
  ctx.fillRect(x + 28, y + 28, 2, 2);
  
  // Question mark
  ctx.fillStyle = COLORS.BRICK_MORTAR; // Shadow/Outline
  if (frame % 60 < 30) {
      // Crude '?' shape
      ctx.fillRect(x + 12, y + 6, 8, 2);
      ctx.fillRect(x + 20, y + 8, 2, 6);
      ctx.fillRect(x + 14, y + 14, 4, 2);
      ctx.fillRect(x + 14, y + 18, 4, 2);
      ctx.fillRect(x + 14, y + 22, 4, 4);
  }
};

// Draw a pipe
const drawPipe = (ctx, x, y, height) => {
  const width = TILE_SIZE * 2;
  const topHeight = TILE_SIZE;
  const tubeHeight = (height - 1) * TILE_SIZE;
  
  // Pipe Cap
  ctx.fillStyle = COLORS.PIPE_OUTLINE; // Border
  ctx.fillRect(x, y, width, topHeight);
  ctx.fillStyle = COLORS.PIPE_LIGHT; // Main body
  ctx.fillRect(x + 2, y + 2, width - 4, topHeight - 4);
  // Highlights
  ctx.fillStyle = COLORS.PIPE_DARK;
  ctx.fillRect(x + 8, y + 2, 4, topHeight - 4);
  ctx.fillRect(x + width - 12, y + 2, 2, topHeight - 4);
  
  // Pipe Body
  const bodyY = y + topHeight;
  ctx.fillStyle = COLORS.PIPE_OUTLINE;
  ctx.fillRect(x + 2, bodyY, width - 4, tubeHeight);
  ctx.fillStyle = COLORS.PIPE_LIGHT;
  ctx.fillRect(x + 4, bodyY, width - 8, tubeHeight);
  // Highlights
  ctx.fillStyle = COLORS.PIPE_DARK;
  ctx.fillRect(x + 10, bodyY, 4, tubeHeight);
  ctx.fillRect(x + width - 14, bodyY, 2, tubeHeight);
};

// Draw Mario
const drawMario = (ctx, x, y, isJumping, direction, frame) => {
    // A simplified 16x16 sprite scaled up
    const S = 2; // Internal scale inside the 32x32 tile
    const mX = x + 4; // Center in tile
    const mY = y;
    
    // Facing right by default
    
    // Hat (Red)
    ctx.fillStyle = COLORS.MARIO_RED;
    ctx.fillRect(mX + 3*S, mY + 0*S, 9*S, 2*S); 
    ctx.fillRect(mX + 11*S, mY + 1*S, 1*S, 1*S); // Brim
    
    // Head/Skin
    ctx.fillStyle = COLORS.MARIO_SKIN;
    ctx.fillRect(mX + 2*S, mY + 2*S, 7*S, 3*S);
    ctx.fillRect(mX + 9*S, mY + 3*S, 1*S, 1*S); // Nose
    
    // Hair/Mustache
    ctx.fillStyle = COLORS.MARIO_HAIR;
    ctx.fillRect(mX + 2*S, mY + 3*S, 1*S, 2*S); // Sideburn
    ctx.fillRect(mX + 3*S, mY + 2*S, 1*S, 1*S);
    ctx.fillRect(mX + 8*S, mY + 4*S, 3*S, 1*S); // Mustache
    
    // Torso (Blue Overalls + Red Shirt)
    ctx.fillStyle = COLORS.MARIO_RED;
    ctx.fillRect(mX + 2*S, mY + 5*S, 6*S, 3*S); // Shirt
    ctx.fillRect(mX + 0*S, mY + 6*S, 2*S, 4*S); // Left Sleeve
    ctx.fillRect(mX + 8*S, mY + 6*S, 2*S, 4*S); // Right sleeve
    
    // Overalls (Blue)
    ctx.fillStyle = COLORS.MARIO_BLUE;
    ctx.fillRect(mX + 2*S, mY + 8*S, 6*S, 4*S); // Body
    ctx.fillRect(mX + 3*S, mY + 7*S, 1*S, 2*S); // Strap L
    ctx.fillRect(mX + 6*S, mY + 7*S, 1*S, 2*S); // Strap R
    
    // Boots (Brown)
    ctx.fillStyle = COLORS.MARIO_HAIR;
    
    if (isJumping) {
         // Jump pose (legs split/tucked)
         ctx.fillRect(mX + 0*S, mY + 11*S, 3*S, 3*S); // L
         ctx.fillRect(mX + 8*S, mY + 9*S, 3*S, 3*S); // R higher
    } else {
        // Run animation
        const runFrame = Math.floor(frame / 5) % 3;
        if (runFrame === 0) { // Idle/Mid stride
            ctx.fillRect(mX + 1*S, mY + 12*S, 3*S, 2*S);
            ctx.fillRect(mX + 7*S, mY + 12*S, 3*S, 2*S);
        } else if (runFrame === 1) { // Wide stride
            ctx.fillRect(mX + 0*S, mY + 11*S, 3*S, 2*S);
            ctx.fillRect(mX + 8*S, mY + 11*S, 3*S, 2*S);
        } else { // High step
            ctx.fillRect(mX + 1*S, mY + 12*S, 3*S, 2*S);
            ctx.fillRect(mX + 7*S, mY + 10*S, 3*S, 2*S);
        }
    }
};


// ==========================================
// GAME ENGINE
// ==========================================

export default function SuperHackathonBros() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Physics Constants
    const GRAVITY = 0.6;
    const SPEED = 3.5;
    const JUMP_FORCE = -11;
    
    // Game State
    let frame = 0;
    let cameraX = 0;
    
    const player = {
      x: 100,
      y: 0,
      width: 24, // Slightly slimmer hitbox than 32
      height: 32,
      vx: 0,
      vy: 0,
      grounded: false
    };

    // Level Generation
    // 0: Empty, 1: Ground, 2: Brick, 3: ? Block, 4: Pipe Body, 5: Pipe Top, 9: End Flag
    // Using a large array for "endless" feel
    const MAP_HEIGHT = 15;
    const MAP_WIDTH = 500;
    const map = new Array(MAP_WIDTH).fill(0).map(() => new Array(MAP_HEIGHT).fill(0));

    // Floor generation
    for (let x = 0; x < MAP_WIDTH; x++) {
        // Leave some gaps
        if (x > 30 && x % 43 < 3) continue; // Pits every now and then
        
        map[x][13] = 1;
        map[x][14] = 1;
    }
    
    // Feature Generator
    for (let x = 20; x < MAP_WIDTH - 20; x++) {
        const rand = Math.sin(x * 999); // Pseudo random
        
        // Pipes
        if (x % 35 === 0 && map[x][13] === 1) { 
             const height = 2 + Math.floor(Math.abs(rand) * 2);
             map[x][13] = 4; // Occupied logic only, drawing handles size
             map[x+1][13] = 0; // Clear for double width
             // We'll store special object metadata separately or just implicit
             // For simplicity, let's just mark tiles:
             // We need collision at higher y
             for(let h=1; h<=height; h++) {
                 map[x][13-h] = 6; // Pipe Collidable
                 map[x+1][13-h] = 6;
             }
             // Store actual type for render
             map[x][13-height] = 5; // Top left
        }
        
        // Bricks and ? Blocks
        if (x % 17 === 0 && x % 35 !== 0) {
            const height = 9;
            map[x][height] = rand > 0 ? 2 : 3;
            map[x+1][height] = 2;
            map[x+2][height] = 2;
        }
        
         // Stairs
        if (x % 100 === 0) {
            for(let i=0; i<4; i++) {
                for(let h=0; h<=i; h++) {
                    map[x+i][12-h] = 7; // Stair Block
                }
            }
        }
    }

    // Helper to get tile
    const getTile = (tx, ty) => {
        if (tx < 0 || tx >= MAP_WIDTH || ty < 0 || ty >= MAP_HEIGHT) return 0;
        return map[tx][ty];
    };
    
    // Collision check
    const checkCollision = (newX, newY) => {
        // Tile based collision
        const startX = Math.floor(newX / TILE_SIZE);
        const endX = Math.floor((newX + player.width) / TILE_SIZE);
        const startY = Math.floor(newY / TILE_SIZE);
        const endY = Math.floor((newY + player.height) / TILE_SIZE);
        
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = getTile(x, y);
                if (tile !== 0) return true;
            }
        }
        return false;
    };
    
    // Start Loop
    const gameLoop = () => {
        frame++;
        
        // --- AI LOGIC ---
        // Constant run
        player.vx = SPEED;
        
        // Jump Check
        // Look ahead 2-4 tiles
        const tileX = Math.floor((player.x + player.width) / TILE_SIZE);
        const tileY = Math.floor((player.y + player.height) / TILE_SIZE);
        
        if (player.grounded) {
             let jump = false;
             
             // 1. Pit check: floor is missing ahead
             const lookAhead = 3; 
             if (getTile(tileX + 1, 13) === 0 && getTile(tileX + 1, 14) === 0) jump = true;

             // 2. Obstacle check: block in face
             if (getTile(tileX + 1, tileY) !== 0 || getTile(tileX+1, tileY-1) !== 0) jump = true;
             
             if (jump) {
                 player.vy = JUMP_FORCE;
                 player.grounded = false;
             }
        }
        
        // --- PHYSICS ---
        // X Movement
        player.x += player.vx;
        // Simple X Collision (stop?) - Nah he's perfect AI, but just in case
        /* 
        if (checkCollision(player.x, player.y)) {
             player.x -= player.vx;
        }
        */

        // Y Movement
        player.vy += GRAVITY;
        player.y += player.vy;
        
        // Floor Collision
        if (player.vy > 0) { // Falling
            if (checkCollision(player.x, player.y)) {
                // Snap to grid
                player.y = Math.floor(player.y / TILE_SIZE) * TILE_SIZE; 
                if (player.y % TILE_SIZE > 0) player.y -= (player.y % TILE_SIZE); // Correction
                
                // My checkCollision is rough, let's refine snapping
                // Just find the floor tile Y
                 const tY = Math.floor((player.y + player.height - 1) / TILE_SIZE);
                 // If that tile is solid, snap player bottom to tile top
                 player.y = (tY * TILE_SIZE) - player.height;
                 
                player.vy = 0;
                player.grounded = true;
            } else {
                player.grounded = false;
            }
        }
        
        // Kill pill (fell in pit)
        if (player.y > canvas.height) {
             // Reset
             player.x = 100;
             player.y = 0;
             player.vy = 0;
             cameraX = 0;
        }
        
        // Looping level
        if (player.x > (MAP_WIDTH * TILE_SIZE) - 500) {
            player.x = 100;
             player.y = 0;
             cameraX = 0;
        }

        // --- CAMERA ---
        // Camera follows player smoothly but offset to left
        let targetCamX = player.x - 100;
        if (targetCamX < 0) targetCamX = 0;
        cameraX = targetCamX; 

        // --- RENDER ---
        ctx.fillStyle = COLORS.SKY;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(-cameraX, 0);
        
        // Calculate visible range
        const startCol = Math.floor(cameraX / TILE_SIZE);
        const endCol = startCol + (canvas.width / TILE_SIZE) + 1;
        
        // Draw Map
        for (let x = startCol; x <= endCol; x++) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                const tile = map[x] ? map[x][y] : 0;
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;
                
                if (tile === 1) drawGround(ctx, px, py);
                else if (tile === 2) drawBrick(ctx, px, py);
                else if (tile === 3) drawQuestion(ctx, px, py, frame);
                else if (tile === 5) drawPipe(ctx, px, py, 3); // Top of pipe
                else if (tile === 6) { /* Invisible Collider or Pipe Body handled by Top draw */ }
                else if (tile === 7) { 
                    // Stair block (just brick look)
                    drawBrick(ctx, px, py);
                }
            }
        }
        
        // Draw Player
        drawMario(ctx, player.x, player.y, !player.grounded, 1, frame);
        
        ctx.restore();
        
        // CRT Effect Overlay?? (Optional, maybe user likes clean pixels)
        // Let's stick to clean pixels for now to match the "Lab" aesthetic
        
        requestAnimationFrame(gameLoop);
    };
    
    const animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
    
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={450} 
      style={{
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated', // Essential for crisp look
        background: '#000'
      }}
    />
  );
}
