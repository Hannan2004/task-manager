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
                git branch: 'main', url: 'https://github.com/your-repo/task-manager.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                sh 'docker build -t $IMAGE_BACKEND ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh 'docker build -t $IMAGE_FRONTEND ./frontend'
            }
        }

        stage('Start Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker ps'
            }
        }

        stage('Cleanup Old Containers') {
            steps {
                sh 'docker system prune -f'
            }
        }
    }
}
