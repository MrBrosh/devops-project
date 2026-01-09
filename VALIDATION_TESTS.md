# בדיקות ולידציה - כל ההגנות

## ✅ הולידציות הקיימות בסקריפט

### 1. הגנה מפני ערכים לא תקינים (Type Validation)

**מה נבדק:**
- כל הפרמטרים חייבים להיות integers (לא floats, לא מחרוזות)

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - מחרוזת במקום מספר
python script.py --user_messages abc --ai_responses 5 ...
# Error: argument --user_messages: invalid int value: 'abc'

# ❌ נכשל - float במקום integer
python script.py --user_messages 5.5 --ai_responses 3 ...
# Error: argument --user_messages: invalid int value: '5.5'
```

**הגנה:** `argparse` עם `type=int` תופס את זה לפני שהקוד מגיע לולידציות שלנו.

---

### 2. הגנה מפני מספרים שליליים

**מה נבדק:**
- `user_messages >= 0`
- `ai_responses >= 0`
- `validation_errors >= 0`

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - מספר שלילי
python script.py --user_messages -5 --ai_responses 3 ...
# ERROR: user_messages must be >= 0

# ❌ נכשל - מספר שלילי
python script.py --user_messages 5 --ai_responses -3 ...
# ERROR: ai_responses must be >= 0
```

---

### 3. הגנה מפני ערכים לא ריאליסטיים (Max Values)

**מה נבדק:**
- כל הערכים חייבים להיות <= 1,000,000

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - ערך גדול מדי
python script.py --user_messages 2000000 --ai_responses 3 ...
# ERROR: user_messages must be <= 1000000

# ❌ נכשל - ערך גדול מדי
python script.py --user_messages 5 --ai_responses 3 --session_time 5000000 ...
# ERROR: session_time must be <= 1000000
```

**למה זה חשוב:** מונע overflow, בעיות ביצועים, וערכים לא ריאליסטיים.

---

### 4. הגנה מפני לוגיקה לא תקינה

**מה נבדק:**
- `ai_responses <= user_messages` (אי אפשר לענות יותר פעמים ממה שהמשתמש שלח)
- `validation_errors <= user_messages` (אי אפשר להיות יותר שגיאות מהודעות)

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - ai_responses גדול מ-user_messages
python script.py --user_messages 5 --ai_responses 10 ...
# ERROR: ai_responses must be <= user_messages

# ❌ נכשל - validation_errors גדול מ-user_messages
python script.py --user_messages 5 --ai_responses 3 --validation_errors 10 ...
# ERROR: validation_errors must be <= user_messages
```

---

### 5. הגנה מפני session_time לא תקין

**מה נבדק:**
- `session_time > 0` (חייב להיות חיובי)

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - session_time = 0
python script.py --user_messages 5 --ai_responses 3 --session_time 0 ...
# ERROR: session_time must be > 0

# ❌ נכשל - session_time שלילי
python script.py --user_messages 5 --ai_responses 3 --session_time -5 ...
# ERROR: session_time must be > 0
```

---

### 6. הגנה מפני cta_left לא תקין

**מה נבדק:**
- `cta_left` חייב להיות `"true"` או `"false"` (בדיוק)

**דוגמאות לניסיונות תקיפה:**
```bash
# ❌ נכשל - ערך לא תקין
python script.py --user_messages 5 --ai_responses 3 --cta_left maybe ...
# Error: argument --cta_left: invalid choice: 'maybe' (choose from 'true', 'false')

# ❌ נכשל - ערך לא תקין
python script.py --user_messages 5 --ai_responses 3 --cta_left yes ...
# Error: argument --cta_left: invalid choice: 'yes' (choose from 'true', 'false')

# ❌ נכשל - ערך לא תקין (case sensitive)
python script.py --user_messages 5 --ai_responses 3 --cta_left TRUE ...
# Error: argument --cta_left: invalid choice: 'TRUE' (choose from 'true', 'false')
```

**הגנה:** `argparse` עם `choices=["true", "false"]` תופס את זה.

---

### 7. הגנה מפני חלוקה באפס

**מה נבדק:**
- אם `user_messages = 0`, אז `error_rate = 0.0` (לא חלוקה באפס)

**דוגמה:**
```bash
# ✅ עובד - user_messages = 0
python script.py --user_messages 0 --ai_responses 0 --validation_errors 0 --cta_left false --session_time 1
# Report generated successfully
```

**הגנה:** יש בדיקה ב-`calculate_error_rate()`:
```python
if user_messages == 0:
    return 0.0
```

---

## 📊 סיכום כל הולידציות

| ולידציה | מה נבדק | דוגמה לניסיון תקיפה | תוצאה |
|---------|---------|---------------------|--------|
| **Type** | חייב להיות integer | `--user_messages abc` | ❌ נכשל |
| **>= 0** | כל המספרים חיוביים | `--user_messages -5` | ❌ נכשל |
| **Max Value** | <= 1,000,000 | `--user_messages 2000000` | ❌ נכשל |
| **Logic** | `ai_responses <= user_messages` | `--ai_responses 10 --user_messages 5` | ❌ נכשל |
| **Logic** | `validation_errors <= user_messages` | `--validation_errors 10 --user_messages 5` | ❌ נכשל |
| **> 0** | `session_time > 0` | `--session_time 0` | ❌ נכשל |
| **Choices** | `cta_left` רק `true`/`false` | `--cta_left maybe` | ❌ נכשל |
| **Divide by Zero** | אם `user_messages = 0` | `--user_messages 0` | ✅ עובד (error_rate = 0) |

---

## 🔒 רמת הגנה

**הסקריפט מוגן מפני:**
- ✅ ערכים לא תקינים (מחרוזות, floats)
- ✅ מספרים שליליים
- ✅ ערכים גדולים מדי
- ✅ לוגיקה לא תקינה
- ✅ חלוקה באפס
- ✅ ערכים לא תקינים ל-boolean

**כל ניסיון תקיפה יגרום ל:**
- שגיאה ברורה
- Exit code = 1
- לא יצירת קבצים

---

## 🧪 איך לבדוק

```bash
# בדיקה 1: מספר שלילי
python script.py --user_messages -5 --ai_responses 3 --validation_errors 1 --cta_left true --session_time 10

# בדיקה 2: לוגיקה לא תקינה
python script.py --user_messages 5 --ai_responses 10 --validation_errors 1 --cta_left true --session_time 10

# בדיקה 3: ערך גדול מדי
python script.py --user_messages 2000000 --ai_responses 3 --validation_errors 1 --cta_left true --session_time 10

# בדיקה 4: cta_left לא תקין
python script.py --user_messages 5 --ai_responses 3 --validation_errors 1 --cta_left maybe --session_time 10

# בדיקה 5: session_time = 0
python script.py --user_messages 5 --ai_responses 3 --validation_errors 1 --cta_left true --session_time 0
```

**כל הבדיקות האלה צריכות להיכשל עם שגיאה ברורה!**
