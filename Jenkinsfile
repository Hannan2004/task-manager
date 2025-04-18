pipeline {
    agent any

    environment {
        PROJECT_ID = 'task-manager-project-456010'
        REGION = 'us-central1'
        ARTIFACT_REGISTRY = "${REGION}-docker.pkg.dev/${PROJECT_ID}/task-manager-repo"
        IMAGE_BACKEND = "${ARTIFACT_REGISTRY}/task-manager-backend"
        IMAGE_FRONTEND = "${ARTIFACT_REGISTRY}/task-manager-frontend"
        CONTAINER_BACKEND = "task-manager-backend-container"
        CONTAINER_FRONTEND = "task-manager-frontend"
        CREDENTIALS_ID = 'gcp-service-key' // Jenkins credential ID for GCP service account
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/Hannan2004/task-manager.git'
            }
        }

        stage('Authenticate to GCP') {
            steps {
                withCredentials([file(credentialsId: "${CREDENTIALS_ID}", variable: 'GCP_KEY')]) {
                    bat "gcloud auth activate-service-account --key-file=%GCP_KEY%"
                    bat "gcloud config set project ${PROJECT_ID}"
                    bat "gcloud auth configure-docker ${REGION}-docker.pkg.dev"
                }
            }
        }

        stage('Build Backend Image') {
            steps {
                bat "docker build -t ${IMAGE_BACKEND}:latest ./backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat "docker build -t ${IMAGE_FRONTEND}:latest ./frontend"
            }
        }

        stage('Push Images to Artifact Registry') {
            steps {
                bat "docker push ${IMAGE_BACKEND}:latest"
                bat "docker push ${IMAGE_FRONTEND}:latest"
            }
        }

        stage('Deploy to Cloud Run') {
            steps {
                // Deploy Backend
                bat "gcloud run deploy ${CONTAINER_BACKEND} --image=${IMAGE_BACKEND}:latest --platform=managed --region=${REGION} --allow-unauthenticated --timeout=600 --port=8080 --set-env-vars=MONGO_URI=mongodb+srv://Hannan:Hannan@hannan.u7dma.mongodb.net/"
                bat "gcloud run deploy ${CONTAINER_FRONTEND} --image=${IMAGE_FRONTEND}:latest --platform=managed --region=${REGION} --allow-unauthenticated --timeout=600 --port=80"
            }
        }

        stage('Cleanup Local Images') {
            steps {
                bat 'docker system prune -f'
            }
        }
    }
}