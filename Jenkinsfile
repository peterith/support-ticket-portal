pipeline {
    agent any
    environment {
        CI = 'true'
    }
    tools {
        nodejs 'nodejs'
    }
    stages {
        stage('Server - Build') {
            steps {
                dir('server') {
                    sh './mvnw clean compile'
                }
            }
        }
        stage('Server - Test') {
            steps {
                dir('server') {
                    sh './mvnw test'
                }
            }
        }
        stage('Server - Deploy') {
            steps {
                dir('server') {
                    sh './mvnw package -Dmaven.test.skip=true'
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                            docker.build('peterith/support-ticket-portal-server').push('latest')
                        }
                    }
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
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                            docker.build('peterith/support-ticket-portal-client').push('latest')
                        }
                    }
                }     
            }
        }
    }
}
