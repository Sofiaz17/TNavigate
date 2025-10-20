#!/usr/bin/env node

/**
 * Development Server for TNavigate
 * Provides hot reloading and development utilities
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class DevServer {
    constructor() {
        this.serverProcess = null;
        this.isRunning = false;
        this.watchedFiles = new Set();
    }

    /**
     * Start the development server
     */
    start() {
        console.log(' Starting TNavigate Development Server...\n');
        
        // Check if .env file exists
        if (!fs.existsSync('.env')) {
            console.log('  Warning: .env file not found. Creating a sample .env file...');
            this.createSampleEnvFile();
        }

        // Start the server
        this.startServer();
        
        // Set up file watching for hot reload
        this.setupFileWatching();
        
        // Handle graceful shutdown
        this.setupGracefulShutdown();
    }

    /**
     * Create a sample .env file
     */
    createSampleEnvFile() {
        const envContent = `# Database
DB_URL=mongodb://localhost:27017/tnavigate

# JWT Secret (use a strong secret in production)
SUPER_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Configuration
PORT=3000
NODE_ENV=development

# Frontend URL for CORS
FRONTEND=http://localhost:5173
`;

        fs.writeFileSync('.env', envContent);
        console.log(' Sample .env file created. Please update the values as needed.\n');
    }

    /**
     * Start the Node.js server
     */
    startServer() {
        const serverPath = path.join(__dirname, '..', 'index.js');
        
        this.serverProcess = spawn('node', ['-r', 'dotenv/config', serverPath], {
            stdio: 'inherit',
            env: { ...process.env, NODE_ENV: 'development' }
        });

        this.isRunning = true;

        this.serverProcess.on('error', (error) => {
            console.error(' Server error:', error);
        });

        this.serverProcess.on('exit', (code) => {
            this.isRunning = false;
            if (code !== 0) {
                console.log(`\n  Server exited with code ${code}`);
            }
        });
    }

    /**
     * Set up file watching for hot reload
     */
    setupFileWatching() {
        const watchPaths = [
            path.join(__dirname, '..', 'app'),
            path.join(__dirname, '..', 'index.js')
        ];

        watchPaths.forEach(watchPath => {
            if (fs.existsSync(watchPath)) {
                fs.watch(watchPath, { recursive: true }, (eventType, filename) => {
                    if (filename && !filename.includes('node_modules') && !filename.includes('.git')) {
                        console.log(`\n File changed: ${filename}`);
                        this.restartServer();
                    }
                });
            }
        });

        console.log('👀 File watching enabled for hot reload');
    }

    /**
     * Restart the server
     */
    restartServer() {
        if (this.isRunning) {
            console.log(' Restarting server...');
            this.serverProcess.kill('SIGTERM');
            
            setTimeout(() => {
                this.startServer();
            }, 1000);
        }
    }

    /**
     * Set up graceful shutdown
     */
    setupGracefulShutdown() {
        const shutdown = () => {
            console.log('\n Shutting down development server...');
            if (this.serverProcess && this.isRunning) {
                this.serverProcess.kill('SIGTERM');
            }
            process.exit(0);
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    }

    /**
     * Show development information
     */
    showDevInfo() {
        console.log(`
 Development Information:
========================
 API Server: http://localhost:3000
 API Documentation: http://localhost:3000/api-docs
 Swagger JSON: http://localhost:3000/swagger.json
 Frontend: http://localhost:5173 (if running)

 Available Commands:
- npm test          : Run all tests
- npm run test:api  : Run API tests
- npm run test:watch: Watch mode for tests
- npm run coverage  : Generate test coverage

 API Endpoints:
- POST /api/v1/users/register     : Register new user
- POST /api/v1/authentications    : Authenticate user
- GET  /api/v1/users/{id}         : Get user profile
- PUT  /api/v1/users/{id}         : Update user profile
- DELETE /api/v1/users/{id}       : Delete user account

 Tips:
- Check .env file for configuration
- Use Postman or curl to test endpoints
- Check console for server logs
- Press Ctrl+C to stop the server
        `);
    }
}

// Run if this script is executed directly
if (require.main === module) {
    const devServer = new DevServer();
    devServer.start();
    devServer.showDevInfo();
}

module.exports = DevServer;
