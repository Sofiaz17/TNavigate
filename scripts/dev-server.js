#!/usr/bin/env node

require('dotenv').config();

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

        // Run setup script
        this.runSetupScript(() => {
            // Start the server after setup is complete
            this.startServer();
            
            // Set up file watching for hot reload
            this.setupFileWatching();
            
            // Handle graceful shutdown
            this.setupGracefulShutdown();
        });
    }

    /**
     * Create a sample .env file
     */
    createSampleEnvFile() {
        const envContent = `# Database
DB_URL=mongodb://localhost:27017/tnavigate

# JWT Secret (use a strong secret in production)
SUPER_SECRET=your_super_secret_jwt_key_here_change_this_in_production
SESSION_SECRET=your_strong_session_secret_here

# Server Configuration
PORT=3000
NODE_ENV=development
BACKEND_URL=http://localhost:3000

# Frontend URL for CORS
FRONTEND=http://Sofiaz17.github.io/TNavigateVue/

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
`;

        fs.writeFileSync('.env', envContent);
        console.log(' Sample .env file created. Please update the values as needed.\n');
    }

    /**
     * Run the setup script to populate the database
     */
    runSetupScript(callback) {
        const setupPath = path.join(__dirname, '..', 'scripts', 'setup.js');
        console.log(' Running database setup script...');
        
        const setupProcess = spawn('node', ['-r', 'dotenv/config', setupPath], {
            stdio: 'inherit'
        });

        setupProcess.on('error', (error) => {
            console.error(' Error running setup script:', error);
        });

        setupProcess.on('exit', (code) => {
            if (code === 0) {
                console.log(' Database setup script completed successfully.\n');
            } else {
                console.log(`\n  Setup script exited with code ${code}.`);
            }
            callback();
        });
    }

    /**
     * Start the Node.js server
     */
    startServer() {
        const serverPath = path.join(__dirname, '..', 'index.js');
        
        this.serverProcess = spawn('node', [serverPath], {
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

        console.log(' File watching enabled for hot reload');
    }

    /**
     * Restart the server
     */
    restartServer() {
        if (this.isRunning) {
            console.log(' Restarting server...');
            this.serverProcess.kill('SIGTERM');
            
            setTimeout(() => {
                this.runSetupScript(() => {
                    this.startServer();
                });
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
 Frontend: http://Sofiaz17.github.io/TNavigateVue/

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
