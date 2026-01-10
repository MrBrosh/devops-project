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
                    try {
                        def userMessages = params.USER_MESSAGES.toInteger()
                        def aiResponses = params.AI_RESPONSES.toInteger()
                        def validationErrors = params.VALIDATION_ERRORS.toInteger()
                        def sessionTime = params.SESSION_TIME.toInteger()

                        // Validate USER_MESSAGES
                        if (userMessages < 0 || userMessages > 1000000) {
                            error("❌ Validation Failed: USER_MESSAGES = ${userMessages}, expected: >= 0 and <= 1,000,000")
                        }
                        
                        // Validate AI_RESPONSES
                        if (aiResponses < 0) {
                            error("❌ Validation Failed: AI_RESPONSES = ${aiResponses}, expected: >= 0")
                        }
                        if (aiResponses > userMessages) {
                            error("❌ Validation Failed: AI_RESPONSES = ${aiResponses} > USER_MESSAGES = ${userMessages}, expected: AI_RESPONSES <= USER_MESSAGES")
                        }
                        
                        // Validate VALIDATION_ERRORS
                        if (validationErrors < 0) {
                            error("❌ Validation Failed: VALIDATION_ERRORS = ${validationErrors}, expected: >= 0")
                        }
                        if (validationErrors > userMessages) {
                            error("❌ Validation Failed: VALIDATION_ERRORS = ${validationErrors} > USER_MESSAGES = ${userMessages}, expected: VALIDATION_ERRORS <= USER_MESSAGES")
                        }
                        
                        // Validate SESSION_TIME
                        if (sessionTime <= 0) {
                            error("❌ Validation Failed: SESSION_TIME = ${sessionTime}, expected: > 0")
                        }
                        if (sessionTime > 1000000) {
                            error("❌ Validation Failed: SESSION_TIME = ${sessionTime}, expected: <= 1,000,000")
                        }
                        
                        // Validate CTA_LEFT
                        if (params.CTA_LEFT != 'true' && params.CTA_LEFT != 'false') {
                            error("❌ Validation Failed: CTA_LEFT = '${params.CTA_LEFT}', expected: 'true' or 'false'")
                        }

                        echo "✅ All parameters validated successfully"
                        echo "   USER_MESSAGES: ${userMessages}"
                        echo "   AI_RESPONSES: ${aiResponses}"
                        echo "   VALIDATION_ERRORS: ${validationErrors}"
                        echo "   CTA_LEFT: ${params.CTA_LEFT}"
                        echo "   SESSION_TIME: ${sessionTime}"
                        echo "   AGENT_SELECTION: ${params.AGENT_SELECTION}"
                    } catch (NumberFormatException e) {
                        error("❌ Validation Failed: Invalid number format. Please ensure all numeric parameters are valid integers.")
                    } catch (Exception e) {
                        error("❌ Validation Failed: ${e.getMessage()}")
                    }
                }
            }
        }

        stage('Run Script') {
            steps {
                script {
                    echo "🔍 Running chat session report script on ${params.AGENT_SELECTION}..."
                    
                    try {
                        // Check if script.py exists
                        if (!fileExists('script.py')) {
                            error("❌ Script file not found: script.py is missing in workspace!")
                        }
                        echo "✅ Found script.py"
                        
                        if (params.AGENT_SELECTION == 'agent') {
                            node('agent') {
                                checkout scm
                                if (isUnix()) {
                                    sh "python3 script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                } else {
                                    bat "C:\\Users\\Asus-pc1\\AppData\\Local\\Programs\\Python\\Launcher\\py.exe script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                                }
                            }
                        } else {
                            if (isUnix()) {
                                sh "python3 script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                            } else {
                                bat "C:\\Users\\Asus-pc1\\AppData\\Local\\Programs\\Python\\Launcher\\py.exe script.py --user_messages ${params.USER_MESSAGES} --ai_responses ${params.AI_RESPONSES} --validation_errors ${params.VALIDATION_ERRORS} --cta_left ${params.CTA_LEFT} --session_time ${params.SESSION_TIME}"
                            }
                        }
                    } catch (Exception e) {
                        echo "❌ Script execution failed: ${e.getMessage()}"
                        currentBuild.result = 'FAILURE'
                        error("❌ Script execution failed: ${e.getMessage()}")
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
