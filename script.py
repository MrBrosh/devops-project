#!/usr/bin/env python3
"""
Simple chat session report generator
Generates log.txt and result.html based on manually entered data
"""

import sys
import argparse
from datetime import datetime


def validate_inputs(user_messages, ai_responses, validation_errors, cta_left, session_time):
    """
    Validate all input parameters
    Returns (is_valid, error_message)
    """
    # Check all numbers are integers (not floats)
    if not isinstance(user_messages, int):
        return False, "user_messages must be an integer"
    
    if not isinstance(ai_responses, int):
        return False, "ai_responses must be an integer"
    
    if not isinstance(validation_errors, int):
        return False, "validation_errors must be an integer"
    
    if not isinstance(session_time, int):
        return False, "session_time must be an integer"
    
    # Check all numbers are >= 0
    if user_messages < 0:
        return False, "user_messages must be >= 0"
    
    if ai_responses < 0:
        return False, "ai_responses must be >= 0"
    
    if validation_errors < 0:
        return False, "validation_errors must be >= 0"
    
    # Check reasonable maximum values (prevent unrealistic inputs)
    MAX_REASONABLE = 1000000  # 1 million
    if user_messages > MAX_REASONABLE:
        return False, f"user_messages must be <= {MAX_REASONABLE}"
    
    if ai_responses > MAX_REASONABLE:
        return False, f"ai_responses must be <= {MAX_REASONABLE}"
    
    if validation_errors > MAX_REASONABLE:
        return False, f"validation_errors must be <= {MAX_REASONABLE}"
    
    if session_time > MAX_REASONABLE:
        return False, f"session_time must be <= {MAX_REASONABLE}"
    
    # Check ai_responses <= user_messages
    if ai_responses > user_messages:
        return False, "ai_responses must be <= user_messages"
    
    # Check validation_errors <= user_messages (logical constraint)
    if validation_errors > user_messages:
        return False, "validation_errors must be <= user_messages"
    
    # Check session_time > 0
    if session_time <= 0:
        return False, "session_time must be > 0"
    
    # Check cta_left is boolean
    if cta_left not in [True, False]:
        return False, "cta_left must be true or false"
    
    return True, ""


def calculate_error_rate(validation_errors, user_messages):
    """
    Calculate error rate
    """
    if user_messages == 0:
        return 0.0
    return validation_errors / user_messages


def determine_status(error_rate, cta_left):
    """
    Determine session status based on error rate and CTA
    """
    if error_rate > 0.3:
        status = "Problematic"
    else:
        status = "OK"
    
    # Add CTA note if applicable
    if cta_left:
        status += " (CTA left)"
    
    return status


def create_log_file(user_messages, ai_responses, validation_errors, cta_left, 
                    session_time, error_rate, status):
    """
    Create log.txt file with all data and calculations
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    log_content = f"""Chat Session Report
Generated: {timestamp}

Input Values:
- User Messages: {user_messages}
- AI Responses: {ai_responses}
- Validation Errors: {validation_errors}
- CTA Left: {cta_left}
- Session Time: {session_time} minutes

Calculations:
- Error Rate: {error_rate:.2%} ({validation_errors}/{user_messages})

Final Status: {status}
"""
    
    with open("log.txt", "w", encoding="utf-8") as f:
        f.write(log_content)


def create_html_file(user_messages, ai_responses, validation_errors, cta_left,
                     session_time, error_rate, status):
    """
    Create result.html file with basic HTML table
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Chat Session Report</title>
</head>
<body>
    <h1>Chat Session Report</h1>
    <p>Generated: {timestamp}</p>
    
    <table border="1" cellpadding="10" cellspacing="0">
        <tr>
            <th>Parameter</th>
            <th>Value</th>
        </tr>
        <tr>
            <td>User Messages</td>
            <td>{user_messages}</td>
        </tr>
        <tr>
            <td>AI Responses</td>
            <td>{ai_responses}</td>
        </tr>
        <tr>
            <td>Validation Errors</td>
            <td>{validation_errors}</td>
        </tr>
        <tr>
            <td>CTA Left</td>
            <td>{cta_left}</td>
        </tr>
        <tr>
            <td>Session Time (minutes)</td>
            <td>{session_time}</td>
        </tr>
        <tr>
            <td>Error Rate</td>
            <td>{error_rate:.2%}</td>
        </tr>
        <tr>
            <td><strong>Status</strong></td>
            <td><strong>{status}</strong></td>
        </tr>
    </table>
    
    <p><em>Report generated based on manually entered data</em></p>
</body>
</html>
"""
    
    with open("result.html", "w", encoding="utf-8") as f:
        f.write(html_content)


def main():
    """
    Main function - parse arguments, validate, calculate, generate reports
    """
    parser = argparse.ArgumentParser(description="Generate chat session report")
    parser.add_argument("--user_messages", type=int, required=True,
                       help="Number of messages sent by user")
    parser.add_argument("--ai_responses", type=int, required=True,
                       help="Number of AI responses in chatbot")
    parser.add_argument("--validation_errors", type=int, required=True,
                       help="Number of validation errors in session")
    parser.add_argument("--cta_left", type=str, required=True,
                       choices=["true", "false"],
                       help="Whether user left details in CTA message (true/false)")
    parser.add_argument("--session_time", type=int, required=True,
                       help="Session time in minutes")
    
    args = parser.parse_args()
    
    # Convert cta_left string to boolean
    cta_left_bool = args.cta_left.lower() == "true"
    
    # Validate inputs
    is_valid, error_msg = validate_inputs(
        args.user_messages,
        args.ai_responses,
        args.validation_errors,
        cta_left_bool,
        args.session_time
    )
    
    if not is_valid:
        print(f"ERROR: {error_msg}", file=sys.stderr)
        sys.exit(1)
    
    # Calculate error rate
    error_rate = calculate_error_rate(args.validation_errors, args.user_messages)
    
    # Determine status
    status = determine_status(error_rate, cta_left_bool)
    
    # Generate log.txt
    create_log_file(
        args.user_messages,
        args.ai_responses,
        args.validation_errors,
        cta_left_bool,
        args.session_time,
        error_rate,
        status
    )
    
    # Generate result.html
    create_html_file(
        args.user_messages,
        args.ai_responses,
        args.validation_errors,
        cta_left_bool,
        args.session_time,
        error_rate,
        status
    )
    
    print("Report generated successfully:")
    print("  - log.txt")
    print("  - result.html")


if __name__ == "__main__":
    main()
