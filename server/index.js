import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import {createRequire} from 'module';
import { PostHog } from 'posthog-node'

const posthog = new PostHog(
    'phc_MTyLVwHxKq8VEqjPK2zqzy2Fu4XlaR8CsvmRDP70HZA',
    { host: 'https://us.i.posthog.com' }
)


const now = new Date();

const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, '0');
const day = now.getDate().toString().padStart(2, '0');

const hour = now.getHours();

let timeShift = '';

if (hour < 12) {
  timeShift = 'morning';
} else if (hour < 17) {
  timeShift = 'afternoon';
} else if (hour < 21) {
  timeShift = 'evening';
} else {
  timeShift = 'night';
}

const live_id = `${year}-${month}-${day}-${timeShift}`;


// Create require function to load CommonJS modules
const require = createRequire(import.meta.url);
const { WebcastPushConnection } = require('tiktok-live-connector');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, you should limit this to your frontend URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());

// Define gift values for XP calculation
const GIFT_XP_VALUES = {
  // Common gifts
  5655: 5,    // Rose
  5269: 10,   // Like
  7934: 20,   // Finger Heart
  // Add more gift IDs and their XP values as needed
};

// Level configuration (XP required for each level)
const LEVEL_THRESHOLDS = [
  0,      // Level 1 starts at 0 XP
  1000,   // Level 2 requires 1000 XP
  3000,   // Level 3 requires 3000 XP
  6000,   // Level 4 requires 6000 XP
  10000,  // Level 5 requires 10000 XP
  20000,  // Level 5 requires 10000 XP
];

// Game state
let gameState = {
  channelName: "danielhe4rt",
  level: 1,
  currentXP: 100,
  maxXP: 1000,
  isConnected: false
};

// TikTok connection
let tiktokConnection = null;

// Calculate level based on XP
function calculateLevel(xp) {
  let level = 1;
  for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
}

// Update XP and level
function updateXP(additionalXP) {
  const newXP = gameState.currentXP + additionalXP;
  const newLevel = calculateLevel(newXP);

  // Update game state
  gameState.currentXP = newXP;

  if (newLevel !== gameState.level) {
    gameState.level = newLevel;

    // Set max XP to the next level threshold
    const nextLevelIndex = LEVEL_THRESHOLDS.findIndex(threshold => threshold > newXP);
    if (nextLevelIndex !== -1) {
      gameState.maxXP = LEVEL_THRESHOLDS[nextLevelIndex];
    } else {
      // If at max level, set max XP to be slightly higher than current
      gameState.maxXP = newXP + 1000;
    }
  }

  // Broadcast updated state to all clients
  io.emit('gameStateUpdate', gameState);
}

// Connect to TikTok Live
function connectToTikTok(username) {
  // Disconnect existing connection if any
  if (tiktokConnection) {
    tiktokConnection.disconnect();
    tiktokConnection = null;
  }

  // Update channel name and connection status
  gameState.channelName = username;
  gameState.isConnected = false;
  io.emit('gameStateUpdate', gameState);

  // Create a new connection
  tiktokConnection = new WebcastPushConnection(username, {
    enableExtendedGiftInfo: true
  });

  // Connect to TikTok Live
  tiktokConnection.connect()
    .then(state => {
      console.info(`Connected to TikTok Live for ${username}, roomId: ${state.roomId}`);
      gameState.isConnected = true;
      io.emit('gameStateUpdate', gameState);
      io.emit('connectionStatus', { connected: true, message: `Connected to roomId ${state.roomId}` });
    })
    .catch(err => {
      console.error('Failed to connect to TikTok Live:', err);
      gameState.isConnected = false;
      io.emit('gameStateUpdate', gameState);
      io.emit('connectionStatus', { connected: false, message: `Connection failed: ${err.message}` });
    });


  tiktokConnection.on('follow', data => {
    console.log(`[Alerts] ${data.uniqueId} followed the stream!`);

    posthog.capture({
      distinctId: data.userId,
      event: "follow",
      properties: {
        live: live_id,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })

    // Add a small amount of XP for chat messages
    updateXP(10);

    // Emit the chat message to clients
    io.emit('chatMessage', {
      uniqueId: data.uniqueId,
      comment: data.comment,
      profilePictureUrl: data.profilePictureUrl
    });
  });


  tiktokConnection.on('share', data => {
    console.log(`[Alerts] ${data.uniqueId} just shared the stream!`);

    posthog.capture({
      distinctId: data.userId,
      event: "share",
      properties: {
        live: live_id,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })

    // Add a small amount of XP for chat messages
    updateXP(10);

    // Emit the chat message to clients
    io.emit('chatMessage', {
      uniqueId: data.uniqueId,
      comment: data.comment,
      profilePictureUrl: data.profilePictureUrl
    });
  });

  // Handle chat messages
  tiktokConnection.on('chat', data => {
    console.log(`[Chat] ${data.uniqueId}: ${data.comment}`);

    posthog.capture({
      distinctId: data.userId,
      event: "message",
      properties: {
        live: live_id,
        message: data.comment,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })

    // Add a small amount of XP for chat messages
    updateXP(10);

    // Emit the chat message to clients
    io.emit('chatMessage', {
      uniqueId: data.uniqueId,
      comment: data.comment,
      profilePictureUrl: data.profilePictureUrl
    });
  });

  tiktokConnection.on('member', data => {
    console.log(`[Room State] ${data.uniqueId} joined the stream!`);
    posthog.capture({
      distinctId: data.userId,
      event: "$pageview",
      properties: {
        live: live_id,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })


  })

  tiktokConnection.on('like', data => {
    //console.log(data);
    console.log(`[Events] ${data.uniqueId} Liked the stream! (${data.likeCount})`);
    posthog.capture({
      distinctId: data.userId,
      event: "like",
      properties: {
        live: live_id,
        likes_count: data.likeCount,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })


    // Add a small amount of XP for chat messages
    updateXP(5);

    // Emit the chat message to clients
    io.emit('chatMessage', {
      uniqueId: data.uniqueId,
      comment: "Liked your video",
      profilePictureUrl: data.profilePictureUrl
    });
  });

  // Handle gifts
  tiktokConnection.on('gift', data => {
    console.log(`[Gift] ${data.uniqueId} sent gift ${data.giftId}`);
    posthog.capture({
      distinctId: data.userId,
      event: "gift",
      properties: {
        live: live_id,
        gift: data.extendedGiftInfo,
        $current_url: 'https://tiktok.com/@danielhe4rt/live',
        $set_once: {
          name: data.nickname,
          username: data.uniqueId,
        }
      }
    })


    // Calculate XP based on gift value
    const giftXP = GIFT_XP_VALUES[data.giftId] || 1;
    // Multiply by repeat count for combo gifts
    const totalXP = giftXP * (data.repeatCount || 1);

    // Update XP
    updateXP(totalXP);

    // Emit the gift to clients
    io.emit('giftReceived', {
      uniqueId: data.uniqueId,
      giftId: data.giftId,
      repeatCount: data.repeatCount || 1,
      xpAwarded: totalXP
    });
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A client connected');

  // Send current game state to the newly connected client
  socket.emit('gameStateUpdate', gameState);

  // Handle connection requests
  socket.on('connectToTikTok', (data) => {
    const username = data.username || 'danielhe4rt';
    console.log(`Connection requested for TikTok user: ${username}`);
    connectToTikTok(username);
  });

  // Handle manual XP updates (for testing)
  socket.on('addTestXP', (data) => {
    const xpToAdd = data.xp || 100;
    console.log(`Adding test XP: ${xpToAdd}`);
    updateXP(xpToAdd);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected');
    // We don't disconnect from TikTok when a client disconnects
    // as there might be other clients still connected
  });
});

// Connect to default channel on startup
connectToTikTok(gameState.channelName);

// Start the server
const PORT = process.env.PORT || 3001;

// Function to start server and handle port conflicts
function startServer(port) {
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying ${port + 1}...`);
      setTimeout(() => {
        server.close();
        startServer(port + 1);
      }, 1000);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Store the actual port being used for client reference
    app.set('port', port);
  });
}

startServer(PORT);

// Add a route to expose the current port to clients
app.get('/api/port', (req, res) => {
  res.json({ port: app.get('port') });
});

export default app; 