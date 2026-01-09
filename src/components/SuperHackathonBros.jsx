import React, { useEffect, useRef, useState } from 'react';


const COLORS = {
  SKY: '#5c94fc',
  GROUND_LIGHT: '#E49470',
  GROUND_DARK: '#C84C0C',
  GROUND_OUTLINE: '#000000',
  BRICK: '#B84C0C',
  BRICK_MORTAR: '#000000',
  QUESTION: '#FC9838',
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

const drawGround = (ctx, x, y) => {
  ctx.fillStyle = COLORS.GROUND_LIGHT;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  ctx.fillStyle = COLORS.GROUND_DARK;
  ctx.fillRect(x + 4, y + 4, 4, 4);
  ctx.fillRect(x + 12, y + 8, 8, 2);
  ctx.fillRect(x + 24, y + 4, 2, 8);
  
  ctx.fillStyle = COLORS.GROUND_OUTLINE;
  ctx.fillRect(x, y, TILE_SIZE, 2);
  ctx.fillRect(x, y, 2, TILE_SIZE);
};

const drawBrick = (ctx, x, y) => {
  ctx.fillStyle = COLORS.BRICK;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  ctx.fillStyle = COLORS.BRICK_MORTAR;
  ctx.fillRect(x, y, TILE_SIZE, 2);
  ctx.fillRect(x, y + 15, TILE_SIZE, 2);
  
  ctx.fillRect(x, y, 2, 16);
  ctx.fillRect(x + 16, y, 2, 16);
  
  ctx.fillRect(x + 8, y + 16, 2, 16);
  ctx.fillRect(x + 24, y + 16, 2, 16);
};

const drawQuestion = (ctx, x, y, frame) => {
  const color = frame % 60 < 30 ? COLORS.QUESTION : '#ffcc99';
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  
  ctx.fillStyle = COLORS.BRICK_MORTAR;
  ctx.fillRect(x + 2, y + 2, 2, 2);
  ctx.fillRect(x + 28, y + 2, 2, 2);
  ctx.fillRect(x + 2, y + 28, 2, 2);
  ctx.fillRect(x + 28, y + 28, 2, 2);
  
  ctx.fillStyle = COLORS.BRICK_MORTAR;
  if (frame % 60 < 30) {
      ctx.fillRect(x + 12, y + 6, 8, 2);
      ctx.fillRect(x + 20, y + 8, 2, 6);
      ctx.fillRect(x + 14, y + 14, 4, 2);
      ctx.fillRect(x + 14, y + 18, 4, 2);
      ctx.fillRect(x + 14, y + 22, 4, 4);
  }
};

const drawPipe = (ctx, x, y, height) => {
  const width = TILE_SIZE * 2;
  const topHeight = TILE_SIZE;
  const tubeHeight = (height - 1) * TILE_SIZE;
  
  ctx.fillStyle = COLORS.PIPE_OUTLINE;
  ctx.fillRect(x, y, width, topHeight);
  ctx.fillStyle = COLORS.PIPE_LIGHT;
  ctx.fillRect(x + 2, y + 2, width - 4, topHeight - 4);
  ctx.fillStyle = COLORS.PIPE_DARK;
  ctx.fillRect(x + 8, y + 2, 4, topHeight - 4);
  ctx.fillRect(x + width - 12, y + 2, 2, topHeight - 4);
  
  const bodyY = y + topHeight;
  ctx.fillStyle = COLORS.PIPE_OUTLINE;
  ctx.fillRect(x + 2, bodyY, width - 4, tubeHeight);
  ctx.fillStyle = COLORS.PIPE_LIGHT;
  ctx.fillRect(x + 4, bodyY, width - 8, tubeHeight);
  ctx.fillStyle = COLORS.PIPE_DARK;
  ctx.fillRect(x + 10, bodyY, 4, tubeHeight);
  ctx.fillRect(x + width - 14, bodyY, 2, tubeHeight);
};

const drawBush = (ctx, x, y, size = 3) => {
    ctx.fillStyle = COLORS.BUSH;
    
    if (size === 1) {
        ctx.fillRect(x + 8, y + 20, 16, 12);
        ctx.fillRect(x + 4, y + 24, 4, 8);
        ctx.fillRect(x + 24, y + 24, 4, 8);
        ctx.fillStyle = COLORS.GROUND_OUTLINE;
        ctx.fillRect(x + 4, y + 30, 24, 2);
    } else if (size === 2) {
        ctx.fillRect(x + 4, y + 16, 14, 16);
        ctx.fillRect(x + 14, y + 16, 14, 16);
        ctx.fillStyle = COLORS.GROUND_OUTLINE;
        ctx.fillRect(x + 2, y + 30, 28, 2);
    } else {
        ctx.fillRect(x, y + 10, 10, 22);
        ctx.fillRect(x + 8, y + 4, 16, 28);
        ctx.fillRect(x + 22, y + 10, 10, 22);
        ctx.fillStyle = COLORS.GROUND_OUTLINE;
        ctx.fillRect(x, y + 30, 32, 2);
    }
};

const drawCloud = (ctx, x, y) => {
    ctx.fillStyle = COLORS.CLOUD;
    ctx.fillRect(x + 10, y, 20, 10);
    ctx.fillRect(x, y + 8, 20, 15);
    ctx.fillRect(x + 20, y + 8, 20, 15);
};

const drawMario = (ctx, x, y, isJumping, direction, frame, isBig) => {
    const S = isBig ? 3 : 2;
    const mX = isBig ? x - 8 : x + 4; 
    const mY = y;
    
    
    ctx.fillStyle = COLORS.MARIO_RED;
    ctx.fillRect(mX + 3*S, mY + 0*S, 9*S, 2*S); 
    ctx.fillRect(mX + 11*S, mY + 1*S, 1*S, 1*S);
    
    ctx.fillStyle = COLORS.MARIO_SKIN;
    ctx.fillRect(mX + 2*S, mY + 2*S, 7*S, 3*S);
    ctx.fillRect(mX + 9*S, mY + 3*S, 1*S, 1*S);
    
    ctx.fillStyle = COLORS.MARIO_HAIR;
    ctx.fillRect(mX + 2*S, mY + 3*S, 1*S, 2*S);
    ctx.fillRect(mX + 3*S, mY + 2*S, 1*S, 1*S);
    ctx.fillRect(mX + 8*S, mY + 4*S, 3*S, 1*S);
    
    ctx.fillStyle = COLORS.MARIO_RED;
    ctx.fillRect(mX + 2*S, mY + 5*S, 6*S, 3*S);
    ctx.fillRect(mX + 0*S, mY + 6*S, 2*S, 4*S);
    ctx.fillRect(mX + 8*S, mY + 6*S, 2*S, 4*S);
    
    ctx.fillStyle = COLORS.MARIO_BLUE;
    ctx.fillRect(mX + 2*S, mY + 8*S, 6*S, 4*S);
    ctx.fillRect(mX + 3*S, mY + 7*S, 1*S, 2*S);
    ctx.fillRect(mX + 6*S, mY + 7*S, 1*S, 2*S);
    
    ctx.fillStyle = COLORS.MARIO_HAIR;
    
    if (isJumping) {
         ctx.fillRect(mX + 0*S, mY + 11*S, 3*S, 3*S);
         ctx.fillRect(mX + 8*S, mY + 9*S, 3*S, 3*S);
    } else {
        const runFrame = Math.floor(frame / 5) % 3;
        if (runFrame === 0) {
            ctx.fillRect(mX + 1*S, mY + 12*S, 3*S, 2*S);
            ctx.fillRect(mX + 7*S, mY + 12*S, 3*S, 2*S);
        } else if (runFrame === 1) {
            ctx.fillRect(mX + 0*S, mY + 11*S, 3*S, 2*S);
            ctx.fillRect(mX + 8*S, mY + 11*S, 3*S, 2*S);
        } else {
            ctx.fillRect(mX + 1*S, mY + 12*S, 3*S, 2*S);
            ctx.fillRect(mX + 7*S, mY + 10*S, 3*S, 2*S);
        }
    }
};


export default function SuperHackathonBros() {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const GRAVITY = 0.6;
    const SPEED = 3.5;
    const JUMP_FORCE = -14; 
    
    let frame = 0;
    let cameraX = 0;
    
    const player = {
      x: 100,
      y: 0,
      width: 24, 
      height: 32,
      vx: 0,
      vy: 0,
      grounded: false,
      isBig: false
    };

    const MAP_HEIGHT = 15;
    const MAP_WIDTH = 500;
    const map = new Array(MAP_WIDTH).fill(0).map(() => new Array(MAP_HEIGHT).fill(0));
    
    const scenery = [];

    for (let x = 0; x < MAP_WIDTH; x++) {
        if (x > 30 && x % 43 < 3) {
             if (x % 2 === 0 && x % 43 !== 0) { 
                 map[x][9] = 2; 
             }
             continue; 
        }
        
        map[x][13] = 1;
        map[x][14] = 1;
        
        if (x > 10 && x < MAP_WIDTH - 50) {
            const rand = Math.sin(x * 123.45);
            
            if (x % 7 === 0 && Math.sin(x) > -0.2) {
                scenery.push({ type: 'cloud', x: x, y: 2 + Math.floor(Math.abs(rand) * 4) });
            }
            
            if (x % 35 !== 0 && x % 6 === 0 && rand > -0.2) {
                const size = 1 + Math.floor(Math.abs(rand * 10) % 3); 
                scenery.push({ type: 'bush', x: x, y: 12, size: size }); 
            }
            
        }
    }
    
    for (let x = 20; x < MAP_WIDTH - 20; x++) {
        const rand = Math.sin(x * 999); 
        
        if (x % 35 === 0 && map[x][13] === 1) { 
             const height = 3; 
             map[x+1][13] = 1; 
             for(let h=1; h<=height; h++) {
                 map[x][13-h] = 6;   
                 map[x+1][13-h] = 6; 
             }
             map[x][13-height] = 5; 
        }
        
        const distToPipe = Math.min(x % 35, 35 - (x % 35));
        const isOverPit = (tx) => tx > 30 && tx % 43 < 3;
        const willOverlapPit = isOverPit(x) || isOverPit(x+1) || isOverPit(x+2);

        if (x % 17 === 0 && distToPipe > 5 && !willOverlapPit) {
            const height = 9; 
            const isQuestion = rand > 0;
            map[x][height] = isQuestion ? 3 : 2;
            map[x+1][height] = 2; 
            map[x+2][height] = 2; 
        }
        
        if (x % 100 === 0) {
            for(let i=0; i<4; i++) {
                for(let h=0; h<=i; h++) {
                    map[x+i][12-h] = 7; 
                }
            }
        }
    }

    const getTile = (tx, ty) => {
        if (tx < 0 || tx >= MAP_WIDTH || ty < 0 || ty >= MAP_HEIGHT) return 0;
        return map[tx][ty];
    };
    
    const getCollidingTile = (newX, newY) => {
        const startX = Math.floor(newX / TILE_SIZE);
        const endX = Math.floor((newX + player.width - 0.1) / TILE_SIZE);
        const startY = Math.floor(newY / TILE_SIZE);
        const endY = Math.floor((newY + player.height - 0.1) / TILE_SIZE);
        
        for (let y = startY; y <= endY; y++) {
            for (let x = startX; x <= endX; x++) {
                const tile = getTile(x, y);
                if (tile !== 0) return true;
            }
        }
        return false;
    };
    
    const gameLoop = () => {
        frame++;
        
        const lookAheadTiles = 2; 
        const tileX = Math.floor((player.x + player.width/2) / TILE_SIZE); 
        const tileY = Math.floor((player.y + player.height) / TILE_SIZE);
        
        player.vx = SPEED;

        if (player.grounded) {
             let jump = false;
             for(let i = 1; i <= lookAheadTiles; i++) {
                 if (getTile(tileX + i, tileY + 1) === 0) {
                     jump = true;
                     break;
                 }
                 if (getTile(tileX + i, tileY - 1) !== 0 || getTile(tileX + i, tileY - 2) !== 0) {
                     jump = true;
                     break;
                 }
                 if (getTile(tileX, tileY - 4) === 3 || getTile(tileX + 1, tileY - 4) === 3) {
                     jump = true;
                     break;
                 }
             }
             if (jump) {
                 player.vy = JUMP_FORCE;
                 player.grounded = false;
             }
        }
        
        player.x += player.vx;
        if (getCollidingTile(player.x, player.y)) {
             player.x = Math.floor(player.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE - player.width; 
             player.x -= 0.1; 
        }

        player.vy += GRAVITY;
        player.y += player.vy;
        
        if (getCollidingTile(player.x, player.y)) {
            if (player.vy > 0) {
                const tY = Math.floor((player.y + player.height) / TILE_SIZE); 
                player.y = (tY * TILE_SIZE) - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) {
                const tY = Math.floor(player.y / TILE_SIZE);
                
                const sX = Math.floor(player.x / TILE_SIZE);
                const eX = Math.floor((player.x + player.width - 0.1) / TILE_SIZE);
                for (let cx = sX; cx <= eX; cx++) {
                    if (getTile(cx, tY) === 3) { 
                         if (!player.isBig) {
                             player.isBig = true;
                             player.y -= 16; 
                             player.height = 48; 
                             for(let mx=0; mx<MAP_WIDTH; mx++) {
                                 for(let my=0; my<MAP_HEIGHT; my++) {
                                     if(map[mx][my] === 3) map[mx][my] = 2;
                                 }
                             }
                         }
                    }
                }
                player.y = (tY + 1) * TILE_SIZE;
                player.vy = 0; 
            }
        } else {
            player.grounded = false;
        }
        
        if (player.y > canvas.height) {
             player.x = 100;
             player.y = 0;
             player.vy = 0;
             cameraX = 0;
             player.isBig = false;
             player.height = 32; 
        }
        
        if (player.x > (MAP_WIDTH * TILE_SIZE) - 500) {
            player.x = 100;
             player.y = 0;
             cameraX = 0;
        }

        let targetCamX = player.x - 100;
        if (targetCamX < 0) targetCamX = 0;
        cameraX = targetCamX; 
        
        ctx.fillStyle = COLORS.SKY;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(-cameraX, 0);
        
        const startCol = Math.floor(cameraX / TILE_SIZE);
        const endCol = startCol + (canvas.width / TILE_SIZE) + 1;
        
        scenery.forEach(item => {
            if (item.x >= startCol - 2 && item.x <= endCol + 2) { 
                const px = item.x * TILE_SIZE;
                const py = item.y * TILE_SIZE;
                
                if (item.type === 'bush') drawBush(ctx, px, py, item.size);
                else if (item.type === 'cloud') drawCloud(ctx, px, py);
            }
        });
        
        for (let x = startCol; x <= endCol; x++) {
            for (let y = 0; y < MAP_HEIGHT; y++) {
                const tile = map[x] ? map[x][y] : 0;
                const px = x * TILE_SIZE;
                const py = y * TILE_SIZE;
                
                if (tile === 1) drawGround(ctx, px, py);
                else if (tile === 2) drawBrick(ctx, px, py);
                else if (tile === 3) drawQuestion(ctx, px, py, frame);
                else if (tile === 5) drawPipe(ctx, px, py, 3); 
                else if (tile === 7) drawBrick(ctx, px, py);
            }
        }
        
        drawMario(ctx, player.x, player.y, !player.grounded, 1, frame, player.isBig);
        
        ctx.restore();
        
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
        imageRendering: 'pixelated',
        background: '#000'
      }}
    />
  );
}
