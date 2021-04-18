pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'cd client && npm install'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
