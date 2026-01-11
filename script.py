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
    Create result.html file with professional dashboard design
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Determine status color
    status_color = "#e74c3c" if "Problematic" in status else "#2ecc71"
    
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat Session Report Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #121212;
            color: #e0e0e0;
            line-height: 1.6;
            padding: 2rem;
            min-height: 100vh;
        }}
        
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        
        .header {{
            text-align: center;
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 2px solid #333;
        }}
        
        .header h1 {{
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }}
        
        .header p {{
            color: #b0b0b0;
            font-size: 0.95rem;
        }}
        
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }}
        
        .kpi-card {{
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }}
        
        .kpi-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }}
        
        .kpi-card.success {{
            border-left: 4px solid #2ecc71;
        }}
        
        .kpi-card.warning {{
            border-left: 4px solid #f39c12;
        }}
        
        .kpi-card.error {{
            border-left: 4px solid #e74c3c;
        }}
        
        .kpi-card h3 {{
            font-size: 0.9rem;
            font-weight: 500;
            color: #b0b0b0;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.5rem;
        }}
        
        .kpi-card .value {{
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 0.5rem;
        }}
        
        .kpi-card.success .value {{
            color: #2ecc71;
        }}
        
        .kpi-card.warning .value {{
            color: #f39c12;
        }}
        
        .kpi-card.error .value {{
            color: #e74c3c;
        }}
        
        .chart-section {{
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
        }}
        
        .chart-section h2 {{
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 1.5rem;
            text-align: center;
        }}
        
        .chart-container {{
            position: relative;
            height: 400px;
            max-width: 600px;
            margin: 0 auto;
        }}
        
        .details-section {{
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border-radius: 16px;
            padding: 2rem;
            margin-bottom: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
        }}
        
        .details-section h2 {{
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffffff;
            margin-bottom: 1.5rem;
        }}
        
        .details-table {{
            width: 100%;
            border-collapse: collapse;
            border-radius: 12px;
            overflow: hidden;
        }}
        
        .details-table th {{
            background-color: #2a2a2a;
            color: #ffffff;
            font-weight: 600;
            padding: 1rem 1.5rem;
            text-align: left;
            border-bottom: 2px solid #333;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .details-table td {{
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #2a2a2a;
            color: #e0e0e0;
            transition: background-color 0.2s ease;
        }}
        
        .details-table tbody tr:hover {{
            background-color: #2a2a2a;
        }}
        
        .details-table tbody tr:last-child td {{
            border-bottom: none;
        }}
        
        .status-badge {{
            display: inline-block;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
            background-color: {status_color};
            color: #ffffff;
        }}
        
        .jenkins-banner {{
            background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
            border-radius: 16px;
            padding: 1.5rem 2rem;
            margin-top: 3rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid #333;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            border-top: 3px solid #d33833;
        }}
        
        .jenkins-banner svg {{
            width: 32px;
            height: 32px;
        }}
        
        .jenkins-banner p {{
            color: #e0e0e0;
            font-weight: 500;
            font-size: 1rem;
            margin: 0;
        }}
        
        @media (max-width: 768px) {{
            body {{
                padding: 1rem;
            }}
            
            .header h1 {{
                font-size: 2rem;
            }}
            
            .kpi-grid {{
                grid-template-columns: 1fr;
            }}
            
            .chart-container {{
                height: 300px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
    <h1>Chat Session Report</h1>
    <p>Generated: {timestamp}</p>
        </div>
        
        <div class="kpi-grid">
            <div class="kpi-card success">
                <h3>User Messages</h3>
                <div class="value">{user_messages}</div>
                <p style="color: #b0b0b0; font-size: 0.85rem;">Total messages sent by user</p>
            </div>
            
            <div class="kpi-card success">
                <h3>AI Responses</h3>
                <div class="value">{ai_responses}</div>
                <p style="color: #b0b0b0; font-size: 0.85rem;">Total AI responses generated</p>
            </div>
            
            <div class="kpi-card error">
                <h3>Validation Errors</h3>
                <div class="value">{validation_errors}</div>
                <p style="color: #b0b0b0; font-size: 0.85rem;">Errors during validation</p>
            </div>
        </div>
        
        <div class="chart-section">
            <h2>Data Overview</h2>
            <div class="chart-container">
                <canvas id="dataChart"></canvas>
            </div>
        </div>
        
        <div class="details-section">
            <h2>Session Details</h2>
            <table class="details-table">
                <thead>
        <tr>
            <th>Parameter</th>
            <th>Value</th>
        </tr>
                </thead>
                <tbody>
        <tr>
                        <td><strong>User Messages</strong></td>
            <td>{user_messages}</td>
        </tr>
        <tr>
                        <td><strong>AI Responses</strong></td>
            <td>{ai_responses}</td>
        </tr>
        <tr>
                        <td><strong>Validation Errors</strong></td>
            <td>{validation_errors}</td>
        </tr>
        <tr>
                        <td><strong>CTA Left</strong></td>
                        <td>{'Yes' if cta_left else 'No'}</td>
        </tr>
        <tr>
                        <td><strong>Session Time</strong></td>
                        <td>{session_time} minutes</td>
        </tr>
        <tr>
                        <td><strong>Error Rate</strong></td>
            <td>{error_rate:.2%}</td>
        </tr>
        <tr>
            <td><strong>Status</strong></td>
                        <td><span class="status-badge">{status}</span></td>
        </tr>
                </tbody>
    </table>
        </div>
        
        <div class="jenkins-banner">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L20 8H12L16 4Z" fill="#d33833"/>
                <rect x="12" y="8" width="8" height="12" fill="#d33833"/>
                <path d="M16 20L20 24H12L16 20Z" fill="#d33833"/>
                <circle cx="16" cy="16" r="14" stroke="#d33833" stroke-width="1.5" fill="none"/>
            </svg>
            <p>Build Verified by Jenkins Agent</p>
        </div>
    </div>
    
    <script>
        const ctx = document.getElementById('dataChart').getContext('2d');
        const chart = new Chart(ctx, {{
            type: 'bar',
            data: {{
                labels: ['User Messages', 'AI Responses', 'Validation Errors'],
                datasets: [{{
                    label: 'Count',
                    data: [{user_messages}, {ai_responses}, {validation_errors}],
                    backgroundColor: [
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
                    borderColor: [
                        'rgba(46, 204, 113, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {{
                    legend: {{
                        display: false
                    }},
                    tooltip: {{
                        backgroundColor: 'rgba(30, 30, 30, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#e0e0e0',
                        borderColor: '#333',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true
                    }}
                }},
                scales: {{
                    y: {{
                        beginAtZero: true,
                        ticks: {{
                            color: '#b0b0b0',
                            font: {{
                                family: 'Inter'
                            }}
                        }},
                        grid: {{
                            color: '#2a2a2a'
                        }}
                    }},
                    x: {{
                        ticks: {{
                            color: '#b0b0b0',
                            font: {{
                                family: 'Inter',
                                weight: '500'
                            }}
                        }},
                        grid: {{
                            display: false
                        }}
                    }}
                }}
            }}
        }});
    </script>
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
