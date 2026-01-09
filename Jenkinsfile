pipeline {
    agent any

    parameters {
        choice(
            name: 'AGENT_SELECTION',
            choices: ['master', 'agent'],
            description: 'Select where to run the pipeline (master or agent)'
        )
        string(
            name: 'USER_MESSAGES',
            defaultValue: '10',
            description: 'Number of messages sent by user (integer >= 0)'
        )
        string(
            name: 'AI_RESPONSES',
            defaultValue: '8',
            description: 'Number of AI responses (integer >= 0, must be <= USER_MESSAGES)'
        )
        string(
            name: 'VALIDATION_ERRORS',
            defaultValue: '2',
            description: 'Number of validation errors (integer >= 0, must be <= USER_MESSAGES)'
        )
        choice(
            name: 'CTA_LEFT',
            choices: ['true', 'false'],
            description: 'Whether user left details in CTA message'
        )
        string(
            name: 'SESSION_TIME',
            defaultValue: '15',
            description: 'Session time in minutes (integer > 0)'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Validate Parameters') {
            steps {
                echo '✅ Validating input parameters...'
                script {
                    def userMessages = params.USER_MESSAGES.toInteger()
                    def aiResponses = params.AI_RESPONSES.toInteger()
                    def validationErrors = params.VALIDATION_ERRORS.toInteger()
                    def sessionTime = params.SESSION_TIME.toInteger()

                    if (userMessages < 0 || userMessages > 1000000) {
                        error("USER_MESSAGES must be >= 0 and <= 1,000,000")
                    }
                    if (aiResponses < 0 || aiResponses > userMessages) {
                        error("AI_RESPONSES must be >= 0 and <= USER_MESSAGES")
                    }
                    if (validationErrors < 0 || validationErrors > userMessages) {
                        error("VALIDATION_ERRORS must be >= 0 and <= USER_MESSAGES")
                    }
                    if (sessionTime <= 0 || sessionTime > 1000000) {
                        error("SESSION_TIME must be > 0 and <= 1,000,000")
                    }

                    echo "✅ All parameters validated successfully"
                    echo "   USER_MESSAGES: ${userMessages}"
                    echo "   AI_RESPONSES: ${aiResponses}"
                    echo "   VALIDATION_ERRORS: ${validationErrors}"
                    echo "   CTA_LEFT: ${params.CTA_LEFT}"
                    echo "   SESSION_TIME: ${sessionTime}"
                    echo "   AGENT_SELECTION: ${params.AGENT_SELECTION}"
                }
            }
        }

        stage('Run Script') {
            steps {
                script {
                    echo "🔍 Running chat session report script on ${params.AGENT_SELECTION}..."
                    
                    def runCommand = { nodeLabel ->
                        if (nodeLabel == 'agent') {
                            node('agent') {
                                if (isUnix()) {
                                    sh "python3 script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                } else {
                                    bat "\"C:\\Users\\Asus-pc1\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe\" script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                }
                            }
                        } else {
                            node {
                                if (isUnix()) {
                                    sh "python3 script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                } else {
                                    bat "\"C:\\Users\\Asus-pc1\\AppData\\Local\\Microsoft\\WindowsApps\\python.exe\" script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                }
                            }
                        }
                    }
                    
                    try {
                        runCommand(params.AGENT_SELECTION)
                    } catch (Exception e) {
                        echo "❌ Script execution failed: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        throw e
                    }
                }
            }
        }

        stage('Generate HTML') {
            steps {
                echo '📄 HTML file already generated by script'
                script {
                    if (!fileExists('result.html')) {
                        error("HTML file (result.html) was not generated!")
                    }
                    echo "✅ HTML file generated successfully"
                }
            }
        }

        stage('Validate Output') {
            steps {
                echo '✅ Validating generated files...'
                script {
                    if (!fileExists('log.txt')) {
                        error("Log file (log.txt) was not generated!")
                    }
                    if (!fileExists('result.html')) {
                        error("HTML file (result.html) was not generated!")
                    }
                    echo "✅ Both files generated successfully"
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo '📦 Archiving results...'
                script {
                    archiveArtifacts artifacts: 'log.txt, result.html', allowEmptyArchive: false
                    echo "✅ Artifacts archived successfully"
                }
            }
        }
    }

    post {
        always {
            echo '📊 Pipeline Summary:'
            script {
                def duration = currentBuild.durationString
                echo "⏱️  Duration: ${duration}"
                echo "   Agent used: ${params.AGENT_SELECTION}"
                echo "   Build result: ${currentBuild.result ?: 'SUCCESS'}"
            }
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo '   Check the console output for details.'
        }
        cleanup {
            echo '🧹 Cleaning up...'
        }
    }
}
