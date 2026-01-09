pipeline {
    agent { label 'Built-In Node' }


    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Run Script') {
            steps {
                echo '🔍 Running chat session report script...'
                script {
                    // Run with sample data
                    sh '''
                        python3 script.py \
                            --user_messages 10 \
                            --ai_responses 8 \
                            --validation_errors 2 \
                            --cta_left true \
                            --session_time 15
                    '''
                }
            }
        }

        stage('Validate Output') {
            steps {
                echo '✅ Validating generated files...'
                script {
                    sh '''
                        test -f log.txt || exit 1
                        test -f result.html || exit 1
                        echo "✅ Both files generated successfully"
                    '''
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo '📦 Archiving results...'
                archiveArtifacts artifacts: 'log.txt, result.html', 
                                 allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            echo '📊 Pipeline Summary:'
            script {
                def duration = currentBuild.durationString
                echo "⏱️  Duration: ${duration}"
            }
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
