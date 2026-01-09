# רשימת דרישות מלאה - פרויקט DevOps

## 📋 תוכן עניינים
1. [תוכנות בסיסיות](#תוכנות-בסיסיות)
2. [Jenkins - Master](#jenkins---master)
3. [Jenkins - Agent](#jenkins---agent)
4. [Git & GitHub](#git--github)
5. [Python](#python)
6. [הגדרות Jenkins](#הגדרות-jenkins)
7. [הגדרות Agent](#הגדרות-agent)
8. [הגדרות Git/GitHub](#הגדרות-gitgithub)
9. [בדיקות סופיות](#בדיקות-סופיות)
10. [פתרון בעיות נפוצות](#פתרון-בעיות-נפוצות)

---

## 🖥️ תוכנות בסיסיות

### 1. Java JDK
- **גרסה מינימלית**: Java 8 (JDK 8)
- **גרסה מומלצת**: Java 11 או Java 17 (LTS)
- **למה**: Jenkins דורש Java כדי לרוץ
- **איפה להוריד**: 
  - [Oracle JDK](https://www.oracle.com/java/technologies/downloads/)
  - [OpenJDK](https://adoptium.net/)
- **איך לבדוק**: 
  ```bash
  java -version
  ```
  צריך לראות משהו כמו:
  ```
  java version "17.0.x"
  ```

### 2. Python
- **גרסה**: Python 3.6 ומעלה
- **גרסה מומלצת**: Python 3.8, 3.9, 3.10, או 3.11
- **למה**: הסקריפט `script.py` רץ על Python
- **איפה להוריד**: 
  - [Python.org](https://www.python.org/downloads/)
  - Windows: [Microsoft Store](https://apps.microsoft.com/store/detail/python-311/9NRWMJP3717K)
- **איך לבדוק**: 
  ```bash
  python --version
  # או
  python3 --version
  # או
  py --version
  ```
  צריך לראות:
  ```
  Python 3.x.x
  ```
- **חשוב**: 
  - ✅ סמן "Add Python to PATH" בהתקנה
  - ✅ התקן Python Launcher (py.exe) - זה מה ש-Jenkins משתמש בו
  - **למשתמש Windows**: הנתיב המלא ל-`py.exe` מוגדר ב-Jenkinsfile:
    ```
    C:\Users\Asus-pc1\AppData\Local\Programs\Python\Launcher\py.exe
    ```
    אם הנתיב שלך שונה, עדכן את ה-Jenkinsfile!

### 3. Git
- **גרסה**: Git 2.0 ומעלה
- **גרסה מומלצת**: Git 2.30+ (הגרסה האחרונה)
- **למה**: להעלות קוד ל-GitHub ולגרור מ-GitHub ב-Jenkins
- **איפה להוריד**: 
  - [Git-SCM.com](https://git-scm.com/download/win)
- **איך לבדוק**: 
  ```bash
  git --version
  ```
  צריך לראות:
  ```
  git version 2.x.x
  ```

---

## 🔧 Jenkins - Master

### התקנה

#### Windows:
1. **הורד Jenkins WAR**:
   - גרסה: Jenkins 2.400+ (LTS מומלץ)
   - [Jenkins.io/download](https://www.jenkins.io/download/)
   - בחר: "Windows" → "Generic Java package (.war)"

2. **הרצה**:
   ```bash
   java -jar jenkins.war --httpPort=8080
   ```

3. **או התקן כשירות Windows**:
   - הורד Jenkins Installer מ-[Jenkins.io](https://www.jenkins.io/download/)
   - הרץ את ה-installer
   - Jenkins ירוץ אוטומטית כשירות

#### Linux:
```bash
# Ubuntu/Debian
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt-get update
sudo apt-get install jenkins

# Red Hat/CentOS
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum install jenkins
```

### גישה ראשונית
1. פתח דפדפן: `http://localhost:8080`
2. מצא את ה-initial admin password:
   ```bash
   # Windows
   type C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword
   
   # Linux
   cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
3. התקן plugins מומלצים
4. צור admin user

### הגדרות נדרשות

#### 1. Git Configuration
- **מיקום**: Manage Jenkins → Global Tool Configuration → Git
- **הגדר**:
  - Name: `Default`
  - Path to Git executable: 
    - Windows: `C:\Program Files\Git\cmd\git.exe`
    - Linux: `/usr/bin/git`
  - ✅ Apply & Save

#### 2. GitHub Integration
- **מיקום**: Manage Jenkins → Configure System → GitHub
- **הגדר**:
  - GitHub Server: `https://github.com`
  - אם צריך credentials, צור ב-Manage Jenkins → Credentials

#### 3. Credentials (אם Repository הוא Private)
- **מיקום**: Manage Jenkins → Credentials → System → Global credentials
- **צור**:
  - Kind: `Username with password` או `SSH Username with private key`
  - Scope: `Global`
  - Username: שם המשתמש ב-GitHub
  - Password/Private Key: הסיסמה או המפתח

---

## 🤖 Jenkins - Agent

### דרישות Agent
- **מערכת הפעלה**: Windows או Linux
- **Java**: אותה גרסה כמו Master (Java 8+)
- **Python**: Python 3.6+ (אותו כמו Master)
- **Git**: Git 2.0+ (אותו כמו Master)
- **רשת**: חיבור יציב ל-Master

### הגדרת Agent (Windows)

#### 1. הורד Agent JAR
- **מיקום**: Jenkins Master → Manage Jenkins → Manage Nodes and Clouds → New Node
- **שם**: `agent` (חייב להתאים ל-`node('agent')` ב-Jenkinsfile!)
- **Type**: `Permanent Agent`
- **הגדרות**:
  - Remote root directory: `C:\Jenkins\agent` (או כל נתיב)
  - Launch method: `Launch agent via Java Web Start` או `Launch agent by connecting it to the master`
  - **Labels**: `agent` (חשוב מאוד!)
  - **חשוב**: העתק את ה-command שמופיע

#### 2. הרצת Agent
**אפשרות A - Java Web Start**:
```bash
# הורד את agent.jar מ-Jenkins Master
# הרץ:
java -jar agent.jar -jnlpUrl http://MASTER_IP:8080/computer/agent/slave-agent.jnlp -secret SECRET_KEY -workDir C:\Jenkins\agent
```

**אפשרות B - כשירות Windows**:
1. צור קובץ `jenkins-agent.bat`:
   ```batch
   @echo off
   java -jar agent.jar -jnlpUrl http://MASTER_IP:8080/computer/agent/slave-agent.jnlp -secret SECRET_KEY -workDir C:\Jenkins\agent
   ```
2. התקן כ-Windows Service (דרך NSSM או WinSW)

#### 3. בדיקת Agent
- **מיקום**: Jenkins Master → Manage Jenkins → Manage Nodes and Clouds
- **צריך לראות**: Agent עם סטטוס "Connected" (ירוק)

### הגדרת Agent (Linux)
```bash
# צור תיקייה
sudo mkdir -p /opt/jenkins-agent
sudo chown jenkins:jenkins /opt/jenkins-agent

# הורד agent.jar
cd /opt/jenkins-agent
wget http://MASTER_IP:8080/jnlpJars/agent.jar

# הרץ agent
java -jar agent.jar -jnlpUrl http://MASTER_IP:8080/computer/agent/slave-agent.jnlp -secret SECRET_KEY -workDir /opt/jenkins-agent
```

---

## 📦 Git & GitHub

### הגדרת Git

#### 1. הגדרת זהות
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### 2. בדיקת הגדרות
```bash
git config --list
```

### הגדרת GitHub

#### 1. יצירת Repository
1. היכנס ל-[GitHub.com](https://github.com)
2. לחץ על "+" → "New repository"
3. שם: `devops-project` (או כל שם)
4. ✅ Public (או Private אם צריך)
5. ❌ אל תסמן "Initialize with README" (כבר יש לך קוד)
6. לחץ "Create repository"

#### 2. העלאת קוד
```bash
cd c:\Users\Asus-pc1\OneDrive\Desktop\devops-project

# הוסף remote
git remote add origin https://github.com/YOUR_USERNAME/devops-project.git

# העלה
git branch -M main
git push -u origin main
```

#### 3. בדיקת Repository
- פתח: `https://github.com/YOUR_USERNAME/devops-project`
- צריך לראות:
  - ✅ `script.py`
  - ✅ `Jenkinsfile`
  - ✅ `README.md`
  - ✅ `REQUIREMENTS.md`

---

## 🐍 Python

### התקנה (Windows)

#### 1. הורד והתקן
1. הורד מ-[Python.org](https://www.python.org/downloads/)
2. ✅ **חשוב**: סמן "Add Python to PATH"
3. ✅ סמן "Install Python Launcher for Windows"
4. לחץ "Install Now"

#### 2. בדיקה
```bash
# בדוק Python
python --version

# בדוק Python Launcher
py --version

# בדוק נתיב
where python
where py
```

#### 3. עדכון Jenkinsfile (אם צריך)
אם הנתיב ל-`py.exe` שלך שונה, עדכן את ה-Jenkinsfile:
```groovy
bat "C:\\YOUR\\PATH\\TO\\py.exe script.py ..."
```

### התקנה (Linux)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip

# Red Hat/CentOS
sudo yum install python3 python3-pip

# בדיקה
python3 --version
```

---

## ⚙️ הגדרות Jenkins

### 1. יצירת Pipeline Job

#### שלבים:
1. **Jenkins Dashboard** → "New Item"
2. **שם**: `devops-pipeline` (או כל שם)
3. **Type**: "Pipeline"
4. לחץ "OK"

#### הגדרות Pipeline:
- **General**:
  - ✅ "This project is parameterized" (אופציונלי - כבר מוגדר ב-Jenkinsfile)
  
- **Pipeline**:
  - Definition: **"Pipeline script from SCM"**
  - SCM: **"Git"**
  - Repository URL: `https://github.com/YOUR_USERNAME/devops-project.git`
  - Credentials: (אם Repository הוא Private)
  - Branch: `*/main` (או `*/master`)
  - Script Path: `Jenkinsfile`
  
- **Apply** → **Save**

### 2. הגדרת Tools

#### Git:
- **מיקום**: Manage Jenkins → Global Tool Configuration → Git
- **Name**: `Default`
- **Path to Git executable**: 
  - Windows: `C:\Program Files\Git\cmd\git.exe`
  - Linux: `/usr/bin/git`

---

## 🔗 הגדרות Agent

### 1. תיוג Agent
- **מיקום**: Manage Jenkins → Manage Nodes and Clouds → [Agent Name] → Configure
- **Labels**: `agent` (חייב להתאים ל-`node('agent')` ב-Jenkinsfile!)
- **Usage**: "Only build jobs with label expressions matching this node"

### 2. בדיקת Agent
- **מיקום**: Manage Jenkins → Manage Nodes and Clouds
- **צריך לראות**:
  - ✅ Status: "Connected" (ירוק)
  - ✅ Executors: 1 (או יותר)
  - ✅ Labels: `agent`

### 3. בדיקת Python ב-Agent
- **מיקום**: Manage Jenkins → Manage Nodes and Clouds → [Agent Name] → Script Console
- **הרץ**:
  ```groovy
  if (isUnix()) {
      sh "python3 --version"
  } else {
      bat "py --version"
  }
  ```

---

## 📝 הגדרות Git/GitHub

### 1. SSH Key (אופציונלי - מומלץ)

#### יצירת SSH Key:
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

#### הוספה ל-GitHub:
1. העתק את התוכן של `~/.ssh/id_ed25519.pub`
2. GitHub → Settings → SSH and GPG keys → New SSH key
3. הדבק והשמור

### 2. HTTPS עם Personal Access Token

#### יצירת Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. **Scopes**: סמן `repo` (כל ה-repo permissions)
4. Generate token
5. **חשוב**: העתק את ה-token מיד (לא תראה אותו שוב!)

#### שימוש ב-Token:
```bash
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/devops-project.git
```

---

## ✅ בדיקות סופיות

### 1. בדיקת Java
```bash
java -version
# צריך: java version "x.x.x"
```

### 2. בדיקת Python
```bash
python --version
# או
py --version
# צריך: Python 3.x.x
```

### 3. בדיקת Git
```bash
git --version
# צריך: git version 2.x.x
```

### 4. בדיקת Jenkins
- פתח: `http://localhost:8080`
- צריך לראות: Jenkins Dashboard

### 5. בדיקת Agent
- Jenkins → Manage Jenkins → Manage Nodes and Clouds
- צריך לראות: Agent עם סטטוס "Connected" (ירוק)

### 6. בדיקת GitHub Repository
- פתח: `https://github.com/YOUR_USERNAME/devops-project`
- צריך לראות:
  - ✅ `script.py`
  - ✅ `Jenkinsfile`
  - ✅ `README.md`
  - ✅ `REQUIREMENTS.md`

### 7. בדיקת Pipeline
- Jenkins → `devops-pipeline` → "Build with Parameters"
- מלא פרמטרים:
  - AGENT_SELECTION: `master`
  - USER_MESSAGES: `10`
  - AI_RESPONSES: `8`
  - VALIDATION_ERRORS: `2`
  - CTA_LEFT: `true`
  - SESSION_TIME: `15`
- לחץ "Build"
- צריך לראות: ✅ Build #X SUCCESS (ירוק)

---

## 📊 סיכום גרסאות

| תוכנה | גרסה מינימלית | גרסה מומלצת | מיקום התקנה |
|-------|----------------|--------------|--------------|
| **Java JDK** | 8 | 11 או 17 (LTS) | Master + Agent |
| **Python** | 3.6 | 3.8-3.11 | Master + Agent |
| **Git** | 2.0 | 2.30+ | Master + Agent |
| **Jenkins** | 2.300 | 2.400+ (LTS) | Master בלבד |
| **GitHub** | - | - | Repository מקוון |

---

## 🔧 פתרון בעיות נפוצות

### Python לא נמצא
**תסמינים**: `'python' is not recognized` או `Python not found`
**פתרון**:
1. בדוק ש-Python מותקן: `py --version`
2. אם הנתיב שונה, עדכן את ה-Jenkinsfile עם הנתיב המלא ל-`py.exe`
3. או הוסף ל-PATH של Jenkins (Global properties → Environment variables)

### Agent לא מתחבר
**תסמינים**: Agent עם סטטוס "Disconnected"
**פתרון**:
1. בדוק ש-Java מותקן ב-Agent: `java -version`
2. בדוק חיבור רשת ל-Master (ping, firewall)
3. בדוק שה-agent.jar רץ
4. בדוק שה-Label של Agent הוא `agent` (חייב להתאים ל-Jenkinsfile)

### Git לא נמצא
**תסמינים**: `git: command not found`
**פתרון**:
1. התקן Git
2. הגדר ב-Jenkins: Global Tool Configuration → Git → Path

### Repository לא נגיש
**תסמינים**: `Repository not found` או `Authentication failed`
**פתרון**:
1. בדוק שה-URL נכון
2. אם Private: הוסף Credentials ב-Jenkins
3. בדוק permissions ב-GitHub

### Script לא נמצא ב-Agent
**תסמינים**: `can't open file 'script.py': No such file or directory`
**פתרון**:
- זה כבר תוקן ב-Jenkinsfile עם `checkout scm` בתוך `node('agent')`
- אם עדיין לא עובד, ודא שה-Agent יכול לגשת ל-GitHub

### Workspace Issues
**תסמינים**: קובץ לא נמצא למרות שהוא ב-repository
**פתרון**:
- על Master: הקובץ כבר ב-workspace (מ-checkout הראשוני)
- על Agent: ה-Jenkinsfile עושה `checkout scm` בתוך `node('agent')` כדי להביא את הקבצים

---

## 📞 תמיכה

אם משהו לא עובד:
1. בדוק את ה-Console Output ב-Jenkins (הכי חשוב!)
2. בדוק את ה-logs:
   - Windows: `C:\ProgramData\Jenkins\.jenkins\logs\`
   - Linux: `/var/log/jenkins/`
3. בדוק את ה-README.md לפרטים נוספים
4. ודא שכל הגרסאות תואמות (ראה טבלת סיכום)

---

**עודכן אחרון**: 2024  
**גרסת Jenkinsfile**: a871743  
**סטטוס**: ✅ Production Ready
