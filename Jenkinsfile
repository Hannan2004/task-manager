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
                        copy %GOOGLE_APPLICATION_CREDENTIALS% key.json
                        gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://us-central1-docker.pkg.dev
                    """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    bat "docker build -t task-manager-backend:latest ."
                }
                dir('frontend') {
                    bat "docker build -t task-manager-frontend:latest ."
                }
            }
        }

        stage('Tag & Push to Artifact Registry') {
            steps {
                bat """
                    docker tag task-manager-backend:latest %BACKEND_IMAGE%:latest
                    docker tag task-manager-frontend:latest %FRONTEND_IMAGE%:latest
                    
                    docker push %BACKEND_IMAGE%:latest
                    docker push %FRONTEND_IMAGE%:latest
                """
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                bat """
                    gcloud run deploy task-manager-backend ^
                        --image %BACKEND_IMAGE%:latest ^
                        --region %REGION% ^
                        --platform managed ^
                        --allow-unauthenticated ^
                        --project %PROJECT_ID% ^
                        --port 80

                    gcloud run deploy task-manager-frontend ^
                        --image %FRONTEND_IMAGE%:latest ^
                        --region %REGION% ^
                        --platform managed ^
                        --allow-unauthenticated ^
                        --project %PROJECT_ID% ^
                        --port 80
                """
            }
        }
    }

    post {
        always {
            echo 'Cleaning up local Docker images...'
            bat 'docker system prune -af'
        }

        failure {
            echo 'Pipeline failed.'
        }

        success {
            echo "Deployment successful! 🚀"
        }
    }
}
