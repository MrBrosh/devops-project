# מדריך שלב אחר שלב - הפעלת הפרויקט

## שלב 0: בדיקה מקדימה

### ✅ בדוק שהקבצים קיימים:

```bash
cd c:\Users\Asus-pc1\OneDrive\Desktop\devops-project
dir
```

**צריך לראות:**
- ✅ `script.py`
- ✅ `Jenkinsfile`
- ✅ `README.md`
- ✅ `.gitignore`

### ✅ בדוק שהסקריפט עובד מקומית:

```bash
python script.py --user_messages 5 --ai_responses 3 --validation_errors 1 --cta_left true --session_time 10
```

**צריך לראות:**
- ✅ "Report generated successfully"
- ✅ קובץ `log.txt` נוצר
- ✅ קובץ `result.html` נוצר

---

## שלב 1: העלאה ל-GitHub

### 1.1 בדוק סטטוס Git:

```bash
git status
```

### 1.2 הוסף קבצים (אם צריך):

```bash
git add .
```

### 1.3 Commit:

```bash
git commit -m "Initial commit - DevOps project with Jenkins pipeline"
```

### 1.4 Push ל-GitHub:

```bash
git push origin main
```

**✅ אחרי שלב זה:** ודא שהקוד ב-GitHub וניתן לגישה.

---

## שלב 2: הגדרת Jenkins Job

### 2.1 פתח Jenkins Dashboard

1. פתח את Jenkins (בדרך כלל: `http://localhost:8080` או הכתובת של ה-Master)
2. התחבר עם המשתמש שלך

### 2.2 צור Pipeline חדש

1. לחץ על **"New Item"** (או "New Job")
2. הזן שם לפרויקט (למשל: `devops-chat-report`)
3. בחר **"Pipeline"**
4. לחץ **"OK"**

### 2.3 הגדר את ה-Pipeline

בדף ההגדרות, תחת **"Pipeline"**:

1. **Definition**: בחר **"Pipeline script from SCM"**
2. **SCM**: בחר **"Git"**
3. **Repository URL**: הזן את ה-URL של ה-repository ב-GitHub
   - לדוגמה: `https://github.com/yourusername/devops-project.git`
4. **Branch**: `*/main` (או `*/master` אם זה ה-branch שלך)
5. **Script Path**: `Jenkinsfile`
6. לחץ **"Save"**

**✅ אחרי שלב זה:** ה-Job נוצר ב-Jenkins.

---

## שלב 3: הרצה ראשונה (Build Now)

### 3.1 הרץ את ה-Job

1. חזור ל-Jenkins Dashboard
2. לחץ על ה-Job שיצרת
3. לחץ **"Build Now"**

### 3.2 בדוק את התוצאה

1. לחץ על המספר של ה-Build (למשל: #1)
2. לחץ על **"Console Output"**
3. בדוק את הלוג

**✅ אם הכל עובד:** תראה שהכל עבר בהצלחה.

**❌ אם יש שגיאה:** העתק את השגיאה ושלוח לי.

---

## שלב 4: הרצה עם Parameters

### 4.1 בנה עם Parameters

1. חזור ל-Job
2. לחץ **"Build with Parameters"** (אם לא רואה, זה אומר שה-parameters לא הוגדרו נכון)

### 4.2 מלא את הפרמטרים

- **AGENT_SELECTION**: בחר `master` (להתחלה)
- **USER_MESSAGES**: `10`
- **AI_RESPONSES**: `8`
- **VALIDATION_ERRORS**: `2`
- **CTA_LEFT**: `true`
- **SESSION_TIME**: `15`

### 4.3 לחץ "Build"

### 4.4 בדוק את התוצאה

1. לחץ על ה-Build
2. בדוק **"Console Output"**
3. בדוק **"Artifacts"** - צריך לראות `log.txt` ו-`result.html`

**✅ אם הכל עובד:** תראה שהכל עבר בהצלחה עם הפרמטרים.

**❌ אם יש שגיאה:** העתק את השגיאה ושלוח לי.

---

## שלב 5: הרצה על Agent

### 5.1 ודא שה-Agent מחובר

1. ב-Jenkins Dashboard, לחץ **"Manage Jenkins"**
2. לחץ **"Manage Nodes and Clouds"**
3. בדוק שיש node בשם `agent` (או השם שהגדרת)
4. ודא שהוא **"Online"**

### 5.2 הרץ על Agent

1. חזור ל-Job
2. לחץ **"Build with Parameters"**
3. **AGENT_SELECTION**: בחר `agent`
4. מלא את שאר הפרמטרים
5. לחץ **"Build"**

### 5.3 בדוק את התוצאה

1. בדוק **"Console Output"**
2. ודא שכתוב "Running on agent" (או משהו דומה)
3. בדוק שה-Artifacts נוצרו

**✅ אם הכל עובד:** ה-Pipeline רץ על ה-Agent.

**❌ אם יש שגיאה:** העתק את השגיאה ושלוח לי.

---

## שלב 6: בדיקת ולידציות

### 6.1 נסה פרמטרים לא תקינים

1. **Build with Parameters**
2. נסה:
   - **USER_MESSAGES**: `-5` (מספר שלילי)
   - לחץ **"Build"**

**✅ צריך לראות:** שגיאה ב-"Validate Parameters" stage

### 6.2 נסה עוד ולידציות

1. **USER_MESSAGES**: `5`
2. **AI_RESPONSES**: `10` (גדול מ-USER_MESSAGES)
3. לחץ **"Build"**

**✅ צריך לראות:** שגיאה ב-"Validate Parameters" stage

---

## שלב 7: צילום Screenshots

צלם את הדברים הבאים:

1. ✅ Jenkins job configuration (הדף של הגדרות ה-Job)
2. ✅ Parameter input screen (כשמקליקים "Build with Parameters")
3. ✅ Pipeline execution view (ה-Stage View)
4. ✅ Console output (דוגמה של הרצה מוצלחת)
5. ✅ HTML result (פתח את result.html בדפדפן)
6. ✅ Log file (פתח את log.txt)
7. ✅ GitHub repository structure (תמונה של הקבצים ב-GitHub)
8. ✅ Master/Agent configuration (תמונה מ-"Manage Nodes")

---

## מה לעשות אם משהו לא עובד?

1. **העתק את השגיאה המלאה** מה-Console Output
2. **ציין באיזה שלב** זה קרה
3. **שלח לי** ואני אעזור לתקן

---

## סיכום

אחרי שכל השלבים עובדים:
- ✅ הקוד ב-GitHub
- ✅ Jenkins Job מוגדר
- ✅ Pipeline רץ עם parameters
- ✅ רץ על master ו-agent
- ✅ ולידציות עובדות
- ✅ Screenshots צולמו

**הפרויקט מוכן להגשה!** 🎉
