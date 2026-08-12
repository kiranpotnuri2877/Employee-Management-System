pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/kiranpotnuri2877/Employee-Management-System.git'
        BRANCH   = 'main'
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo 'Checking out source code from GitHub...'
                git url: "${REPO_URL}", branch: "${BRANCH}"
            }
        }

        stage('2. Build & Deploy with Docker Compose') {
            steps {
                echo 'Stopping old containers and building fresh Docker images...'
                sh 'docker-compose down'
                sh 'docker-compose up --build -d'
            }
        }

        stage('3. Health Check & Status') {
            steps {
                echo 'Waiting 15 seconds for MySQL, Express, and React to initialize...'
                sleep 15
                
                echo 'Checking running Docker containers:'
                sh 'docker ps'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up dangling Docker images...'
            sh 'docker image prune -f'
        }
        success {
            echo '✅ Deployment Successful! Your application is live.'
        }
        failure {
            echo '❌ Deployment Failed. Checking container status:'
            sh 'docker-compose ps'
        }
    }
}
