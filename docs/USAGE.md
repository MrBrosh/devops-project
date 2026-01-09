# מדריך שימוש

## פקודות בסיסיות

### ניתוח קובץ לוג

```bash
npm start -- --file <path-to-log-file>
```

דוגמה:
```bash
npm start -- --file logs/app.log
```

### ניתוח תיקיית לוגים

```bash
npm start -- --dir <path-to-logs-directory>
```

דוגמה:
```bash
npm start -- --dir logs/
```

## אפשרויות מתקדמות

### פורמטי פלט

#### פורמט טקסט (ברירת מחדל)
```bash
npm start -- --file logs/app.log --format text
```

#### פורמט JSON
```bash
npm start -- --file logs/app.log --format json
```

#### פורמט HTML
```bash
npm start -- --file logs/app.log --format html
```

### שמירת דוח לקובץ

```bash
npm start -- --file logs/app.log --format json --output results/analysis.json
```

```bash
npm start -- --file logs/app.log --format html --output reports/report.html
```

## דוגמאות שימוש

### ניתוח עם שמירה ל-JSON
```bash
npm start -- --file logs/app.log --format json --output analysis.json
```

### ניתוח תיקייה עם פורמט HTML
```bash
npm start -- --dir logs/ --format html --output reports/
```

### שימוש ב-Jenkins Pipeline

ה-Jenkinsfile כולל:
1. בדיקת קוד (Checkout)
2. התקנת תלויות (Install)
3. בדיקות (Test)
4. יצירת קבצי לוג לדוגמה
5. הרצת ניתוח
6. ארכוב תוצאות

התוצאות נשמרות כ-artifacts ב-Jenkins.

## פורמט קובץ לוג

המערכת תומכת בפורמטים הבאים:

```
YYYY-MM-DD HH:MM:SS LEVEL Message
```

דוגמה:
```
2024-01-15 10:00:00 INFO Application started
2024-01-15 10:00:05 ERROR Database connection failed
2024-01-15 10:00:10 WARN High memory usage
```

### רמות לוג נתמכות:
- ERROR / error / Error
- WARN / warn / WARN / WARNING
- INFO / info / Info
- DEBUG / debug / Debug

### חילוץ זמן תגובה:
המערכת מזהה `responseTime: <number>` או `responseTime: <number>`.

## פלט

### פורמט JSON

```json
{
  "summary": {
    "totalLines": 100,
    "processedAt": "2024-01-15T10:00:00.000Z"
  },
  "levels": {
    "errors": 5,
    "warnings": 10,
    "info": 80,
    "debug": 5,
    "errorRate": "5.00%"
  },
  "responseTime": {
    "count": 50,
    "average": 100.5,
    "min": 10.2,
    "max": 500.8,
    "median": 95.0
  },
  "healthScore": 85
}
```

### פורמט HTML

יוצר דוח HTML מלא עם:
- סיכום כללי
- טבלאות מפורטות
- גרפים ויזואליים
- שגיאות קריטיות

### פורמט טקסט

דוח מפורט בקונסול עם:
- סיכום כללי
- פירוט רמות לוג
- זמני תגובה
- שגיאות קריטיות
- מגמות
