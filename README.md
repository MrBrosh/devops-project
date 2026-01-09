# Chat Session Report Generator

DevOps Final Project - Jenkins Master/Agent Pipeline

A Python script that generates a chat session report based on manually entered data, integrated with Jenkins CI/CD pipeline.

## Project Description

This project simulates a real DevOps workflow using Jenkins, GitHub, and Python scripting. The system analyzes chat session data, performs calculations, validates inputs, and generates both HTML and log file outputs.

**Main Features:**
- Parameterized Jenkins pipeline
- Master/Agent selection
- Input validation
- Error rate calculation
- Health score calculation
- HTML report generation
- Log file generation

## Prerequisites

### System Requirements
- Python 3.x
- Jenkins Master installed on Linux
- Jenkins Agent installed on Windows
- Stable connection between Master and Agent
- GitHub repository access

### Jenkins Setup
- Jenkins user with permission to run jobs
- Public access to the Master (URL or tunneling)
- Agent configured and connected to Master

## How to Run the Script Manually

### Basic Usage

```bash
python3 script.py \
    --user_messages <int> \
    --ai_responses <int> \
    --validation_errors <int> \
    --cta_left <true/false> \
    --session_time <int>
```

### Example

```bash
python3 script.py \
    --user_messages 10 \
    --ai_responses 8 \
    --validation_errors 2 \
    --cta_left true \
    --session_time 15
```

### Parameters

| Parameter | Type | Description | Constraints |
|-----------|------|-------------|-------------|
| `--user_messages` | Integer | Number of messages sent by user | >= 0, <= 1,000,000 |
| `--ai_responses` | Integer | Number of AI responses | >= 0, <= user_messages |
| `--validation_errors` | Integer | Number of validation errors | >= 0, <= user_messages |
| `--cta_left` | Boolean | Whether user left details in CTA | `true` or `false` |
| `--session_time` | Integer | Session time in minutes | > 0, <= 1,000,000 |

### Output Files

The script generates two files:

1. **log.txt** - Text file containing:
   - All input values
   - Calculated error rate
   - Final status
   - Timestamp

2. **result.html** - HTML file containing:
   - Formatted table with all parameters
   - Error rate calculation
   - Session status
   - Timestamp

## How to Run the Jenkins Job

### Step 1: Configure Jenkins Job

1. Open Jenkins dashboard
2. Click "New Item"
3. Select "Pipeline"
4. Enter project name
5. In "Pipeline" section:
   - Select "Pipeline script from SCM"
   - SCM: Git
   - Repository URL: Your GitHub repository URL
   - Branch: `main`
   - Script Path: `Jenkinsfile`

### Step 2: Run the Job

1. Click "Build with Parameters"
2. Fill in the parameters:
   - **AGENT_SELECTION**: Choose `master` or `agent`
   - **USER_MESSAGES**: Enter number (e.g., 10)
   - **AI_RESPONSES**: Enter number (e.g., 8)
   - **VALIDATION_ERRORS**: Enter number (e.g., 2)
   - **CTA_LEFT**: Choose `true` or `false`
   - **SESSION_TIME**: Enter minutes (e.g., 15)
3. Click "Build"

### Step 3: View Results

1. Click on the build number
2. View "Console Output" for execution details
3. Download artifacts:
   - `log.txt`
   - `result.html`

## Explanation of Each Stage

### 1. Checkout
- **Purpose**: Retrieves code from GitHub repository
- **Action**: Uses `checkout scm` to pull the latest code
- **Output**: Code available in workspace

### 2. Validate Parameters
- **Purpose**: Validates all input parameters before execution
- **Validations**:
  - All numbers >= 0
  - `ai_responses <= user_messages`
  - `validation_errors <= user_messages`
  - `session_time > 0`
  - All values <= 1,000,000
- **Output**: Validation success message or error

### 3. Run Script
- **Purpose**: Executes the Python script with provided parameters
- **Agent Selection**: Runs on selected agent (master or agent)
- **Action**: Calls `python3 script.py` with all parameters
- **Output**: Generates `log.txt` and `result.html`

### 4. Generate HTML
- **Purpose**: Verifies HTML file was created
- **Action**: Checks if `result.html` exists
- **Output**: Confirmation message

### 5. Validate Output
- **Purpose**: Ensures both output files were generated
- **Action**: Checks existence and size of `log.txt` and `result.html`
- **Output**: File validation results

### 6. Archive Artifacts
- **Purpose**: Saves output files as Jenkins artifacts
- **Action**: Archives `log.txt` and `result.html`
- **Output**: Files available for download

## Parameter Validation Rules

### Input Validation

1. **Type Validation**
   - All numeric parameters must be integers
   - `cta_left` must be exactly `true` or `false`

2. **Range Validation**
   - All numbers must be >= 0
   - All numbers must be <= 1,000,000
   - `session_time` must be > 0

3. **Logical Validation**
   - `ai_responses` must be <= `user_messages`
   - `validation_errors` must be <= `user_messages`

4. **Error Handling**
   - Invalid inputs cause script to exit with code 1
   - Clear error messages displayed
   - No output files generated on validation failure

### Validation Examples

```bash
# ❌ Will fail - negative number
python3 script.py --user_messages -5 ...

# ❌ Will fail - ai_responses > user_messages
python3 script.py --user_messages 5 --ai_responses 10 ...

# ❌ Will fail - session_time = 0
python3 script.py ... --session_time 0

# ✅ Will succeed
python3 script.py --user_messages 10 --ai_responses 8 --validation_errors 2 --cta_left true --session_time 15
```

## Logging Explanation

### Log File Structure

The `log.txt` file contains:

```
Chat Session Report
Generated: YYYY-MM-DD HH:MM:SS

Input Values:
- User Messages: <number>
- AI Responses: <number>
- Validation Errors: <number>
- CTA Left: <true/false>
- Session Time: <number> minutes

Calculations:
- Error Rate: <percentage> (<errors>/<messages>)

Final Status: <OK/Problematic> [optional: (CTA left)]
```

### Logging Features

1. **Timestamp**: Every log includes generation timestamp
2. **Input Recording**: All parameters are logged
3. **Calculation Details**: Error rate calculation shown
4. **Status Summary**: Final status clearly indicated

### Log File Example

```
Chat Session Report
Generated: 2024-01-15 10:30:45

Input Values:
- User Messages: 10
- AI Responses: 8
- Validation Errors: 2
- CTA Left: True
- Session Time: 15 minutes

Calculations:
- Error Rate: 20.00% (2/10)

Final Status: OK (CTA left)
```

## Example HTML Output

The `result.html` file contains a formatted HTML table with:

- **Header**: Chat Session Report title
- **Timestamp**: Generation time
- **Data Table**: All parameters and calculated values
- **Status Row**: Final session status highlighted

### HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chat Session Report</title>
</head>
<body>
    <h1>Chat Session Report</h1>
    <p>Generated: 2024-01-15 10:30:45</p>
    
    <table border="1">
        <tr>
            <th>Parameter</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>User Messages</td>
            <td>10</td>
        </tr>
        <!-- More rows... -->
        <tr>
            <td><strong>Status</strong></td>
            <td><strong>OK (CTA left)</strong></td>
        </tr>
    </table>
</body>
</html>
```

## Example Log File

See the `log.txt` example in the "Logging Explanation" section above.

## Calculations

### Error Rate

```
error_rate = validation_errors / user_messages
```

If `user_messages = 0`, then `error_rate = 0.0`

### Status Determination

- If `error_rate > 0.3` → Status: **"Problematic"**
- Otherwise → Status: **"OK"**
- If `cta_left == true` → Adds **"(CTA left)"** to status

### Example

- `user_messages = 10`
- `validation_errors = 2`
- `error_rate = 2/10 = 0.2 (20%)`
- Status: **"OK"** (because 0.2 < 0.3)

## Repository Structure

```
devops-project/
├── script.py              # Main Python script
├── Jenkinsfile            # Jenkins pipeline definition
├── README.md              # This file
├── .gitignore            # Git ignore rules
└── VALIDATION_TESTS.md   # Detailed validation documentation
```

## Screenshots Required

The following screenshots should be included (in README or separate folder):

1. ✅ Jenkins job configuration
2. ✅ Parameter input screen
3. ✅ Pipeline execution view
4. ✅ Console output
5. ✅ HTML result
6. ✅ Log file
7. ✅ GitHub repository structure
8. ✅ Master/Agent configuration

## Troubleshooting

### Common Issues

1. **Script not found**
   - Ensure Python 3 is installed
   - Check script path in Jenkinsfile

2. **Agent not available**
   - Verify agent is connected to master
   - Check agent label matches parameter

3. **Files not generated**
   - Check script execution logs
   - Verify write permissions

4. **Validation errors**
   - Review parameter constraints
   - Check input values match requirements

## Contact & Support

For questions or issues, refer to the validation documentation in `VALIDATION_TESTS.md`.
