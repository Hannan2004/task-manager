pipeline {
    agent any

    environment {
        PROJECT_ID = 'task-manager-project-456010'
        REGION = 'us-central1'
        ARTIFACT_REGISTRY = "${REGION}-docker.pkg.dev/${PROJECT_ID}/task-manager"
        IMAGE_BACKEND = "${ARTIFACT_REGISTRY}/task-manager-backend"
        IMAGE_FRONTEND = "${ARTIFACT_REGISTRY}/task-manager-frontend"
        CONTAINER_BACKEND = "task-manager-backend-container"
        CONTAINER_FRONTEND = "task-manager-frontend-container"
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
                bat "gcloud run deploy ${CONTAINER_BACKEND} --image=${IMAGE_BACKEND}:latest --platform=managed --region=${REGION} --allow-unauthenticated"
                
                // Get the backend URL and set it as environment variable for frontend
                script {
                    def backendUrl = bat(script: "gcloud run services describe ${CONTAINER_BACKEND} --region=${REGION} --format='value(status.url)'", returnStdout: true).trim()
                    bat "gcloud run deploy ${CONTAINER_FRONTEND} --image=${IMAGE_FRONTEND}:latest --platform=managed --region=${REGION} --set-env-vars=REACT_APP_API_URL=${backendUrl} --allow-unauthenticated"
                }
            }
        }

        stage('Run Tests') {
            steps {
                bat "gcloud run services describe ${CONTAINER_BACKEND} --region=${REGION}"
                bat "gcloud run services describe ${CONTAINER_FRONTEND} --region=${REGION}"
            }
        }

        stage('Cleanup Local Images') {
            steps {
                bat 'docker system prune -f'
            }
        }
    }

    post {
        success {
            script {
                def backendUrl = bat(script: "gcloud run services describe ${CONTAINER_BACKEND} --region=${REGION} --format='value(status.url)'", returnStdout: true).trim()
                def frontendUrl = bat(script: "gcloud run services describe ${CONTAINER_FRONTEND} --region=${REGION} --format='value(status.url)'", returnStdout: true).trim()
                
                echo "Deployment completed successfully!"
                echo "Backend URL: ${backendUrl}"
                echo "Frontend URL: ${frontendUrl}"
            }
        }
        failure {
            echo "Deployment failed!"
        }
    }
}