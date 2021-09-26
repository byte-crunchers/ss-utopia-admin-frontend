pipeline {
    agent any

    stages {
      stage('checkout') {
        steps {
          git branch: 'feature_jenkins', credentialsId: 'git_login', url: 'https://github.com/byte-crunchers/ss-utopia-admin-frontend.git'
        }
      }
        
        stage("SonarQube analysis") {
            steps {
              withSonarQubeEnv('SonarQube') {
                dir('admin-app'){
                   sh 'npm install'
                  sh 'npm install sonarqube-scanner --save-dev'
                  sh 'npm run sonar'
                }
               
              }
            }
          }
          stage('Build') {
            steps {
                  
              dir('admin-app'){
                sh 'docker build . -t jbnilles/ss-utopia-admin-frontend:latest'
              }
                 
            }
        }
          
        stage('Deploy') {
            steps {
                sh 'docker push jbnilles/ss-utopia-admin-frontend:latest'
            }
        }
    }

}