# Chat Session Report Generator

DevOps Final Project - Jenkins Master/Agent Pipeline

A Python script that generates a chat session report based on manually entered data, integrated with Jenkins CI/CD pipeline.

---

## 📖 Project History & Development Journey

### How We Got Here

This project started as a DevOps assignment requiring a complete CI/CD pipeline using Jenkins, GitHub, and a Python script. The journey involved multiple iterations and problem-solving:

#### Phase 1: Initial Setup
- Created a Python script (`script.py`) that accepts command-line parameters
- Implemented comprehensive input validation (type, range, logical constraints)
- Added error rate calculation and status determination
- Generated both `log.txt` and `result.html` output files

#### Phase 2: Jenkins Integration
- Created `Jenkinsfile` with declarative pipeline syntax
- Implemented parameterized builds (6 parameters total)
- Added master/agent selection capability
- Configured stages: Checkout, Validate Parameters, Run Script, Generate HTML, Validate Output, Archive Artifacts

#### Phase 3: Cross-Platform Challenges
**Problem**: Jenkins on Windows couldn't find Python executable
- **Solution 1**: Tried using `bat` commands with direct Python path
- **Solution 2**: Switched to PowerShell with dynamic Python detection
- **Solution 3**: Used full path to Python Launcher (`py.exe`) for Windows
- **Final Solution**: Direct `bat` command with full path to `py.exe` on Windows, `python3` on Linux

#### Phase 4: Workspace Issues
**Problem**: When using `node {}` block, Jenkins created new workspace (`@2`) where `script.py` wasn't found
- **Root Cause**: `node {}` creates isolated workspace
- **Solution**: Removed `node {}` wrapper for master execution, kept it only for agent with `checkout scm` inside

#### Phase 5: Final Optimization
- Added file existence check before script execution
- Added `checkout scm` inside agent node block to ensure files are available
- Simplified pipeline structure for better reliability

**Current Status**: ✅ Pipeline runs successfully on both master and agent nodes

---

## Project Description

This project simulates a real DevOps workflow using Jenkins, GitHub, and Python scripting. The system analyzes chat session data, performs calculations, validates inputs, and generates both HTML and log file outputs.

**Main Features:**
- Parameterized Jenkins pipeline
- Master/Agent selection
- Comprehensive input validation
- Error rate calculation
- HTML report generation
- Log file generation
- Artifact archiving

---

## Prerequisites

See `REQUIREMENTS.md` for complete installation and setup instructions.

**Quick Summary:**
- Python 3.6+ (3.8-3.11 recommended)
- Jenkins 2.300+ (2.400+ LTS recommended)
- Java JDK 8+ (11 or 17 LTS recommended)
- Git 2.0+
- GitHub repository

---

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

---

## How to Run the Jenkins Job

### Step 1: Configure Jenkins Job

1. Open Jenkins dashboard
2. Click "New Item"
3. Select "Pipeline"
4. Enter project name (e.g., `devops-pipeline`)
5. In "Pipeline" section:
   - Select "Pipeline script from SCM"
   - SCM: Git
   - Repository URL: `https://github.com/YOUR_USERNAME/devops-project.git`
   - Branch: `main`
   - Script Path: `Jenkinsfile`
6. Click "Save"

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

---

## Pipeline Stages Explained

### 1. Checkout
- **Purpose**: Retrieves code from GitHub repository
- **Action**: Uses `checkout scm` to pull the latest code
- **Output**: Code available in workspace

### 2. Validate Parameters
- **Purpose**: Validates all input parameters before execution
- **Validations**:
  - All numbers >= 0 and <= 1,000,000
  - `ai_responses <= user_messages`
  - `validation_errors <= user_messages`
  - `session_time > 0`
- **Output**: Validation success message or error

### 3. Run Script
- **Purpose**: Executes the Python script with provided parameters
- **Agent Selection**: 
  - If `master`: Runs directly in current workspace
  - If `agent`: Uses `node('agent')` with `checkout scm` to ensure files are available
- **Action**: 
  - Windows: `C:\Users\Asus-pc1\AppData\Local\Programs\Python\Launcher\py.exe script.py ...`
  - Linux: `python3 script.py ...`
- **Output**: Generates `log.txt` and `result.html`

### 4. Generate HTML
- **Purpose**: Verifies HTML file was created
- **Action**: Checks if `result.html` exists
- **Output**: Confirmation message

### 5. Validate Output
- **Purpose**: Ensures both output files were generated
- **Action**: Checks existence of `log.txt` and `result.html`
- **Output**: File validation results

### 6. Archive Artifacts
- **Purpose**: Saves output files as Jenkins artifacts
- **Action**: Archives `log.txt` and `result.html`
- **Output**: Files available for download

---

## Parameter Validation Rules

### Input Validation

1. **Type Validation**
   - All numeric parameters must be integers (not floats or strings)
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

---

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

---

## Repository Structure

```
devops-project/
├── script.py              # Main Python script
├── Jenkinsfile            # Jenkins pipeline definition
├── README.md              # This file (main documentation)
├── REQUIREMENTS.md        # Complete setup and requirements guide
└── .gitignore            # Git ignore rules
```

---

## Troubleshooting

### Common Issues

1. **Script not found**
   - Ensure Python 3 is installed
   - Check Python path in Jenkinsfile matches your installation
   - For Windows: Verify `py.exe` exists at the specified path

2. **Agent not available**
   - Verify agent is connected to master
   - Check agent label matches `agent` in Jenkinsfile
   - Ensure agent has Python installed

3. **Files not generated**
   - Check script execution logs in Console Output
   - Verify write permissions in workspace
   - Check that validation passed (invalid inputs prevent file generation)

4. **Validation errors**
   - Review parameter constraints in this README
   - Check input values match requirements
   - Ensure all numbers are integers

5. **Python path issues on Windows**
   - Jenkins service may not have access to user PATH
   - Solution: Use full path to `py.exe` (as in current Jenkinsfile)
   - Or: Add Python to system PATH for Jenkins service account

---

## Screenshots Required

The following screenshots should be included for project submission:

1. ✅ Jenkins job configuration
2. ✅ Parameter input screen
3. ✅ Pipeline execution view (both master and agent)
4. ✅ Console output (successful build)
5. ✅ HTML result (opened in browser)
6. ✅ Log file content
7. ✅ GitHub repository structure
8. ✅ Master/Agent configuration in Jenkins

---

## Additional Resources

- **Complete Setup Guide**: See `REQUIREMENTS.md` for detailed installation instructions
- **GitHub Repository**: [Your repository URL]
- **Jenkins Documentation**: https://www.jenkins.io/doc/

---

**Last Updated**: 2024  
**Pipeline Version**: a871743  
**Status**: ✅ Production Ready
