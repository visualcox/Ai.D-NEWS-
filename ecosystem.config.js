module.exports = {
  apps: [
    {
      name: 'aid-news-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        NEXT_PUBLIC_API_URL: 'http://localhost:3001'
      },
      restart_delay: 3000,
      max_restarts: 10
    },
    {
      name: 'aid-news-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
        FRONTEND_URL: 'http://localhost:3000',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/aid_news',
        JWT_SECRET: 'your-super-secure-jwt-secret-key-development-only',
        OPENAI_API_KEY: 'your-openai-api-key',
        ELEVENLABS_API_KEY: 'your-elevenlabs-api-key'
      },
      restart_delay: 3000,
      max_restarts: 10
    }
  ]
}