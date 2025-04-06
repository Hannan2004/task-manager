pipeline {
    agent any
    
    environment {
        PROJECT_ID = 'task-manager-project-456010'
        REGION = 'us-central1'
        REPO = 'task-manager-repo'
        
        BACKEND_IMAGE = "us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/task-manager-backend"
        FRONTEND_IMAGE = "us-central1-docker.pkg.dev/${PROJECT_ID}/${REPO}/task-manager-frontend"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Hannan2004/task-manager.git'
            }
        }
        
        stage('Authenticate with GCP') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    // Create temp directory properly with double backslashes for Windows
                    bat 'if not exist "%WORKSPACE%\\temp" mkdir "%WORKSPACE%\\temp"'
                    
                    // Copy credentials with proper quoting
                    bat 'copy "%GOOGLE_APPLICATION_CREDENTIALS%" "%WORKSPACE%\\temp\\key.json"'
                    
                    // Set environment variable for gcloud
                    bat 'set GOOGLE_APPLICATION_CREDENTIALS=%WORKSPACE%\\temp\\key.json'
                    
                    // Authenticate with GCP
                    bat 'gcloud auth activate-service-account --key-file="%WORKSPACE%\\temp\\key.json"'
                    bat 'gcloud config set project %PROJECT_ID%'
                    
                    // Configure Docker for Artifact Registry - separated for clarity
                    bat 'gcloud auth configure-docker us-central1-docker.pkg.dev --quiet'
                }
            }
        }
        
        stage('Docker Login to Artifact Registry') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    // Direct Docker login approach (alternative to access token)
                    bat '''
                        FOR /F "tokens=*" %%i IN ('gcloud auth print-access-token') DO SET ACCESS_TOKEN=%%i
                        echo !ACCESS_TOKEN! | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
                    '''
                }
            }
        }
        
        stage('Build Docker Images') {
            steps {
                bat 'docker build -t task-manager-backend ./backend'
                bat 'docker build -t task-manager-frontend ./frontend'
            }
        }
        
        stage('Push to Artifact Registry') {
            steps {
                // Tag images with full repository paths
                bat 'docker tag task-manager-backend %BACKEND_IMAGE%'
                bat 'docker tag task-manager-frontend %FRONTEND_IMAGE%'
                
                // Push images - split into separate commands for easier debugging
                bat 'docker push %BACKEND_IMAGE%'
                bat 'docker push %FRONTEND_IMAGE%'
            }
        }
        
        stage('Deploy to Cloud Run') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    // Set GCP credentials and deploy services
                    bat 'gcloud auth activate-service-account --key-file="%GOOGLE_APPLICATION_CREDENTIALS%"'
                    bat 'gcloud run deploy task-manager-backend --image %BACKEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated --project %PROJECT_ID%'
                    bat 'gcloud run deploy task-manager-frontend --image %FRONTEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated --project %PROJECT_ID%'
                }
            }
        }
    }
    
    post {
        always {
            // Clean up temporary files
            bat 'if exist "%WORKSPACE%\\temp" rmdir /s /q "%WORKSPACE%\\temp"'
            
            // Clean up Docker images to save space
            bat 'docker rmi %BACKEND_IMAGE% task-manager-backend || true'
            bat 'docker rmi %FRONTEND_IMAGE% task-manager-frontend || true'
        }
    }
}