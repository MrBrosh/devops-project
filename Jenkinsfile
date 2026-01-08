pipeline {
  agent { label 'linux' }
  stages {
    stage('Checkout'){ steps { checkout scm } }
    stage('Build'){ steps { echo 'Build stage' } }
    stage('Test'){ steps { echo 'Test stage' } }
    stage('Run'){ steps { echo 'Run stage' } }
  }
}
