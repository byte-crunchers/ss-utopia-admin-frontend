const sonarqubeScanner = require('sonarqube-scanner');
     sonarqubeScanner({
       serverUrl: 'http://localhost:9000',
       options : {
       'sonar.sources': '.',
       'sonar.branch.name': 'feature_jenkins',
       'sonar.inclusions' : 'admin-app/src/**' // Entry point of your code
       }
     }, () => {});