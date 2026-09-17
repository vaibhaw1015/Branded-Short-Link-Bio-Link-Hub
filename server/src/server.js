import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`\n🚀 [ShortLink Hub Server] Running in ${config.nodeEnv} mode`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`🔗 Redirection prefix: http://localhost:${config.port}/r/:shortCode`);
      console.log(`🎯 Frontend client: ${config.clientUrl}\n`);
    });

    const shutdown = () => {
      console.log('\nGracefully shutting down server...');
      server.close(() => {
        console.log('Server closed. Process terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
