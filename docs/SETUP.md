# מדריך התקנה והגדרה

## דרישות מערכת

- Node.js 16.x ומעלה
- npm 7.x ומעלה
- Git

## התקנה

```bash
# שכפול הפרויקט
git clone <repository-url>
cd devops-project

# התקנת תלויות
npm install
```

## הגדרת Jenkins

### 1. התקנת Jenkins

התקן Jenkins על השרת שלך לפי המדריך הרשמי.

### 2. הגדרת Pipeline

1. פתח Jenkins Dashboard
2. לחץ על "New Item"
3. בחר "Pipeline"
4. הזן שם לפרויקט
5. בקטגוריה "Pipeline", בחר "Pipeline script from SCM"
6. בחר Git כסוג SCM
7. הזן את URL של ה-repository
8. בחר את ה-branch (בדרך כלל `main`)
9. בנתיב Script Path, הזן `Jenkinsfile`
10. שמור

### 3. הגדרת Webhook (אופציונלי)

להפעלה אוטומטית ב-push ל-GitHub:

1. ב-GitHub, לך ל-Settings > Webhooks
2. הוסף webhook חדש
3. URL: `http://your-jenkins-url/github-webhook/`
4. Content type: `application/json`
5. בחר אירועים: `Just the push event`

## הרצה מקומית

### ניתוח קובץ יחיד:
```bash
npm start -- --file logs/sample.log
```

### ניתוח תיקייה:
```bash
npm start -- --dir logs/
```

### עם פורמט JSON:
```bash
npm start -- --file logs/sample.log --format json
```

### עם פורמט HTML:
```bash
npm start -- --file logs/sample.log --format html --output report.html
```

## בדיקות

```bash
# הרצת כל הבדיקות
npm test

# עם coverage
npm test -- --coverage

# במצב watch
npm run test:watch
```

## פתרון בעיות

### שגיאת הרשאות
אם אתה מקבל שגיאת הרשאות, ודא שיש לך הרשאות קריאה לקבצים:
```bash
chmod +r logs/*.log
```

### שגיאת encoding
אם יש בעיות עם encoding, ודא שהקבצים ב-UTF-8:
```bash
file -i logs/*.log
```

### שגיאת גודל קובץ
אם קובץ גדול מדי, ערוך את `config/config.json`:
```json
{
  "maxFileSize": 104857600  // 100MB
}
```
