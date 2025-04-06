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
                    // Create a temporary directory for credentials
                    bat 'mkdir -p %WORKSPACE%\\temp'
                    // Copy credentials to a known location
                    bat 'copy %GOOGLE_APPLICATION_CREDENTIALS% %WORKSPACE%\\temp\\key.json'
                    // Authenticate with GCP
                    bat '''
                        gcloud auth activate-service-account --key-file=%WORKSPACE%\\temp\\key.json
                        gcloud config set project %PROJECT_ID%
                        
                        REM Configure Docker for Artifact Registry
                        gcloud auth configure-docker us-central1-docker.pkg.dev --quiet
                        
                        REM Get an access token and use it for Docker login explicitly
                        FOR /F "tokens=*" %%i IN ('gcloud auth print-access-token') DO SET ACCESS_TOKEN=%%i
                        echo %ACCESS_TOKEN% | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
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
                bat '''
                    docker tag task-manager-backend %BACKEND_IMAGE%
                    docker tag task-manager-frontend %FRONTEND_IMAGE%
                    docker push %BACKEND_IMAGE%
                    docker push %FRONTEND_IMAGE%
                '''
            }
        }
        
        stage('Deploy to Cloud Run') {
            steps {
                withCredentials([file(credentialsId: 'gcp-service-key', variable: 'GOOGLE_APPLICATION_CREDENTIALS')]) {
                    bat '''
                        gcloud auth activate-service-account --key-file=%GOOGLE_APPLICATION_CREDENTIALS%
                        gcloud run deploy task-manager-backend --image %BACKEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated --project %PROJECT_ID%
                        gcloud run deploy task-manager-frontend --image %FRONTEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated --project %PROJECT_ID%
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Clean up temporary files
            bat 'if exist %WORKSPACE%\\temp rmdir /s /q %WORKSPACE%\\temp'
        }
    }
}