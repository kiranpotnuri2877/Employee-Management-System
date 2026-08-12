pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/kiranpotnuri2877/Employee-Management-System.git'
        BRANCH   = 'main'
    }

    options {
        // Automatically timeout the build if it takes longer than 15 minutes
        timeout(time: 15, unit: 'MINUTES')
        // Keep logs clean
        ansiColor('xterm')
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo 'Checking out source code from GitHub...'
                git url: "${REPO_URL}", branch: "${BRANCH}"
            }
        }

        stage('2. Backend Dependency & Syntax Check') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('3. Frontend Test & Build Check') {
            steps {
                echo 'Installing frontend dependencies and verifying React build...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('4. Deploy Stack via Docker Compose') {
            steps {
                echo 'Spinning down existing containers and deploying updated stack...'
                // Stop and remove existing containers (avoids port binding conflicts)
                sh 'docker-compose down'
                // Rebuild and start containers in background (-d)
                sh 'docker-compose up --build -d'
            }
        }

        stage('5. Health Check & Deployment Status') {
            steps {
                echo 'Waiting 10 seconds for MySQL and API to initialize...'
                sleep 10
                
                echo 'Checking running Docker containers:'
                sh 'docker ps'
                
                echo 'Verifying Backend Endpoint:'
                sh 'curl -I http://localhost:5000/employees || exit 1'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up dangling Docker images...'
            sh 'docker image prune -f'
        }
        success {
            echo '✅ Deployment Successful! Application is running at http://localhost:3000'
        }
        failure {
            echo '❌ Pipeline failed! Fetching logs from backend and database:'
            sh 'docker-compose logs api'
            sh 'docker-compose logs db'
        }
    }
}
