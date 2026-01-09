# Chat Session Report Generator

DevOps final project – Jenkins Master/Agent pipeline

Simple Python script that generates a chat session report based on manually entered data.

## Requirements

- Python 3.x
- Linux/Windows environment
- No external libraries (uses only standard library)

## Usage

```bash
python3 script.py \
    --user_messages <int> \
    --ai_responses <int> \
    --validation_errors <int> \
    --cta_left <true/false> \
    --session_time <int>
```

## Example

```bash
python3 script.py \
    --user_messages 10 \
    --ai_responses 8 \
    --validation_errors 2 \
    --cta_left true \
    --session_time 15
```

## Output

The script generates two files:

1. **log.txt** - Text file with all input values, calculations, and final status
2. **result.html** - HTML file with a table containing all data and summary

## Validation Rules

- All numbers must be >= 0
- `ai_responses` must be <= `user_messages`
- `validation_errors` must be <= `user_messages`
- `session_time` must be > 0
- `cta_left` must be `true` or `false`
- All values must be <= 1,000,000

## Status Determination

- If error_rate > 0.3 → "Problematic"
- Otherwise → "OK"
- If CTA left → adds "(CTA left)" to status

## Jenkins Integration

The `Jenkinsfile` includes a pipeline that:
1. Checks out code from GitHub
2. Runs the script with sample data
3. Validates output files
4. Archives artifacts

