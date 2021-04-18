pipeline {
    agent any
    environment {
        CI = 'true'
    }
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Server - Clean') {
            steps {
                dir('server') {
                    sh './mvnw clean compile'
                }
            }
        }
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
                        docker.build('peterith/support-ticket-portal-client').push('latest')
                    }
                }     
            }
        }
    }
}
