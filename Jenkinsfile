pipeline {
    agent {
        label 'agent1'   // Targets your newly created agent node
    }

    environment {
        REPO_URL = 'https://github.com/kiranpotnuri2877/Employee-Management-System.git'
        BRANCH   = 'main'
    }

    stages {
        stage('1. Checkout Source Code') {
            steps {
                echo "Checking out code on agent1..."
                git branch: "${BRANCH}", url: "${REPO_URL}"
            }
        }

        stage('2. Build & Deploy with Docker Compose') {
            steps {
                echo "Deploying via agent1..."
                sh 'docker rm -f emp-db emp-backend emp-frontend || true'
                sh 'docker-compose down'
                sh 'docker-compose up --build -d'
            }
        }

        stage('3. Health Check & Status') {
            steps {
                sh 'docker-compose ps'
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
    }
}
