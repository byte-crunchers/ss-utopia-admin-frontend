

pipeline {
    agent any
    stages {
        stage('Submit Stack') {
            steps {
            sh "aws cloudformation create-stack --stack-name s3bucket --template-body file://S3Stack.yaml --region 'us-east-2'"
              }
             }
            }
            }
