pipeline {
    agent any
    environment {
        CI = 'true'
    }
    tools {
        nodejs "nodejs"
    }
    stages {
        stage('Client - Build') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }
        stage('Client - Test') {
            steps {
                dir('client') {
                    sh 'npm test'
                }            
            }
        }
        stage('Client - Deploy') {
            steps {
                dir('client') {
                    script {
                        def clientApp = docker.build 'peterith/support-ticket-portal-client:latest'
                        clientApp.push()
                    }
                }     
            }
        }
    }
}
