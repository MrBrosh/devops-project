const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class LogReporter {
  /**
   * מדפיסה דוח בפורמט טקסט
   */
  static generateTextReport(statistics, filePath) {
    const report = [];

    report.push(chalk.bold.cyan('\n' + '='.repeat(60)));
    report.push(chalk.bold.cyan('📊 דוח ניתוח לוגים'));
    report.push(chalk.bold.cyan('='.repeat(60)));
    report.push(`\n📁 קובץ: ${filePath}`);
    report.push(`⏰ נוצר ב: ${statistics.summary.processedAt}\n`);

    // סיכום כללי
    report.push(chalk.bold.yellow('\n📈 סיכום כללי:'));
    report.push(`   סך שורות: ${statistics.summary.totalLines}`);
    report.push(`   ציון בריאות: ${this.getHealthScoreColor(statistics.healthScore)}`);

    // רמות לוג
    report.push(chalk.bold.yellow('\n🔍 רמות לוג:'));
    report.push(`   ${chalk.red('❌ שגיאות:')} ${statistics.levels.errors}`);
    report.push(`   ${chalk.yellow('⚠️  אזהרות:')} ${statistics.levels.warnings}`);
    report.push(`   ${chalk.blue('ℹ️  מידע:')} ${statistics.levels.info}`);
    report.push(`   ${chalk.gray('🔍 Debug:')} ${statistics.levels.debug}`);
    report.push(`   ${chalk.bold('אחוז שגיאות:')} ${statistics.levels.errorRate}`);

    // זמני תגובה
    if (statistics.responseTime.count > 0) {
      report.push(chalk.bold.yellow('\n⏱️  זמני תגובה (ms):'));
      report.push(`   ממוצע: ${statistics.responseTime.average}ms`);
      report.push(`   מינימום: ${statistics.responseTime.min}ms`);
      report.push(`   מקסימום: ${statistics.responseTime.max}ms`);
      report.push(`   חציון: ${statistics.responseTime.median}ms`);
    }

    // שגיאות קריטיות
    if (statistics.criticalErrors.length > 0) {
      report.push(chalk.bold.red('\n🚨 שגיאות קריטיות:'));
      statistics.criticalErrors.forEach((error, index) => {
        report.push(`   ${index + 1}. שורה ${error.line}: ${error.message.substring(0, 80)}...`);
      });
    }

    // מגמות
    const trendKeys = Object.keys(statistics.trends);
    if (trendKeys.length > 0) {
      report.push(chalk.bold.yellow('\n📊 מגמות לפי שעה:'));
      trendKeys.slice(0, 5).forEach(hour => {
        const trend = statistics.trends[hour];
        report.push(`   ${hour}: ${trend.total} שורות (${trend.errors} שגיאות, ${trend.warnings} אזהרות)`);
      });
    }

    report.push(chalk.bold.cyan('\n' + '='.repeat(60) + '\n'));

    return report.join('\n');
  }

  /**
   * מחזירה צבע לפי ציון בריאות
   */
  static getHealthScoreColor(score) {
    if (score >= 80) return chalk.green(`${score}/100 ✅`);
    if (score >= 60) return chalk.yellow(`${score}/100 ⚠️`);
    return chalk.red(`${score}/100 ❌`);
  }

  /**
   * יוצרת דוח בפורמט JSON
   */
  static generateJsonReport(statistics) {
    return JSON.stringify(statistics, null, 2);
  }

  /**
   * יוצרת דוח בפורמט HTML
   */
  static generateHtmlReport(statistics, filePath) {
    const healthColor = statistics.healthScore >= 80 ? 'green' : 
                        statistics.healthScore >= 60 ? 'orange' : 'red';
    const healthIcon = statistics.healthScore >= 80 ? '✅' : 
                       statistics.healthScore >= 60 ? '⚠️' : '❌';

    return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>דוח ניתוח לוגים</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 20px;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 10px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        .card {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #4CAF50;
        }
        .card.error { border-left-color: #f44336; }
        .card.warning { border-left-color: #ff9800; }
        .card.info { border-left-color: #2196F3; }
        .health-score {
            font-size: 2em;
            color: ${healthColor};
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: right;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        .critical {
            background-color: #ffebee;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 דוח ניתוח לוגים</h1>
        <p><strong>קובץ:</strong> ${filePath}</p>
        <p><strong>נוצר ב:</strong> ${statistics.summary.processedAt}</p>
        
        <div class="summary">
            <div class="card">
                <h3>סך שורות</h3>
                <p style="font-size: 2em;">${statistics.summary.totalLines}</p>
            </div>
            <div class="card error">
                <h3>שגיאות</h3>
                <p style="font-size: 2em;">${statistics.levels.errors}</p>
            </div>
            <div class="card warning">
                <h3>אזהרות</h3>
                <p style="font-size: 2em;">${statistics.levels.warnings}</p>
            </div>
            <div class="card">
                <h3>ציון בריאות</h3>
                <p class="health-score">${statistics.healthScore}/100 ${healthIcon}</p>
            </div>
        </div>

        <h2>🔍 פירוט רמות לוג</h2>
        <table>
            <tr>
                <th>סוג</th>
                <th>כמות</th>
                <th>אחוז</th>
            </tr>
            <tr>
                <td>❌ שגיאות</td>
                <td>${statistics.levels.errors}</td>
                <td>${statistics.levels.errorRate}%</td>
            </tr>
            <tr>
                <td>⚠️ אזהרות</td>
                <td>${statistics.levels.warnings}</td>
                <td>${((statistics.levels.warnings / statistics.summary.totalLines) * 100).toFixed(2)}%</td>
            </tr>
            <tr>
                <td>ℹ️ מידע</td>
                <td>${statistics.levels.info}</td>
                <td>${((statistics.levels.info / statistics.summary.totalLines) * 100).toFixed(2)}%</td>
            </tr>
        </table>

        ${statistics.responseTime.count > 0 ? `
        <h2>⏱️ זמני תגובה</h2>
        <table>
            <tr>
                <th>ממוצע</th>
                <th>מינימום</th>
                <th>מקסימום</th>
                <th>חציון</th>
            </tr>
            <tr>
                <td>${statistics.responseTime.average}ms</td>
                <td>${statistics.responseTime.min}ms</td>
                <td>${statistics.responseTime.max}ms</td>
                <td>${statistics.responseTime.median}ms</td>
            </tr>
        </table>
        ` : ''}

        ${statistics.criticalErrors.length > 0 ? `
        <h2>🚨 שגיאות קריטיות</h2>
        <table>
            <tr>
                <th>שורה</th>
                <th>הודעה</th>
                <th>זמן</th>
            </tr>
            ${statistics.criticalErrors.map(error => `
            <tr class="critical">
                <td>${error.line}</td>
                <td>${error.message}</td>
                <td>${error.timestamp}</td>
            </tr>
            `).join('')}
        </table>
        ` : ''}
    </div>
</body>
</html>`;
  }

  /**
   * שומרת דוח לקובץ
   */
  static async saveReport(report, outputPath, format) {
    await fs.ensureDir(path.dirname(outputPath));
    await fs.writeFile(outputPath, report, 'utf8');
    return outputPath;
  }
}

module.exports = LogReporter;
