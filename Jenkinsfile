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
                    bat """
                        gcloud auth activate-service-account --key-file=%GOOGLE_APPLICATION_CREDENTIALS%
                        gcloud config set project %PROJECT_ID%
                    """
                    
                    // Save the key to a location Docker can access for credential helper
                    bat """
                        copy %GOOGLE_APPLICATION_CREDENTIALS% key.json
                        gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
                    """
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
                bat """
                    docker tag task-manager-backend %BACKEND_IMAGE%
                    docker tag task-manager-frontend %FRONTEND_IMAGE%
                    docker push %BACKEND_IMAGE%
                    docker push %FRONTEND_IMAGE%
                """
            }
        }
        
        stage('Deploy to Cloud Run') {
            steps {
                bat """
                    gcloud run deploy task-manager-backend --image %BACKEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated
                    gcloud run deploy task-manager-frontend --image %FRONTEND_IMAGE% --region %REGION% --platform managed --allow-unauthenticated
                """
            }
        }
    }
}