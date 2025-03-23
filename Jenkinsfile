pipeline {
    agent any

    environment {
        IMAGE_BACKEND = "task-manager-backend"
        IMAGE_FRONTEND = "task-manager-frontend"
        CONTAINER_BACKEND = "task-manager-backend-container"
        CONTAINER_FRONTEND = "task-manager-frontend-container"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'master', url: 'https://github.com/Hannan2004/task-manager.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t $IMAGE_BACKEND ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t $IMAGE_FRONTEND ./frontend'
            }
        }

        stage('Start Containers') {
            steps {
                bat 'docker-compose up -d'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'docker ps'
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                bat 'docker system prune -f'
            }
        }
    }
}
