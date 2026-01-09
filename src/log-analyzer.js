#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');
const LogValidator = require('./validator');
const LogCalculator = require('./calculator');
const LogReporter = require('./reporter');

/**
 * קוראת ומנתחת קובץ לוג
 */
async function analyzeLogFile(filePath, options = {}) {
  try {
    console.log(`\n🔍 מתחיל ניתוח: ${filePath}\n`);

    // ולידציה
    const validation = await LogValidator.validateLogFile(filePath);
    if (!validation.valid) {
      console.error('❌ שגיאות ולידציה:');
      validation.errors.forEach(error => console.error(`   ${error}`));
      process.exit(1);
    }

    // קריאת קובץ
    const content = await fs.readFile(validation.path, validation.encoding);
    const lines = content.split('\n').filter(line => line.trim().length > 0);

    if (lines.length === 0) {
      console.warn('⚠️  קובץ ריק או ללא תוכן');
      return null;
    }

    // ניתוח שורות
    console.log(`📊 מנתח ${lines.length} שורות...`);
    const logEntries = lines.map((line, index) => 
      LogCalculator.parseLogLine(line, index + 1)
    );

    // חישוב סטטיסטיקות
    console.log('🧮 מחשב סטטיסטיקות...');
    const statistics = LogCalculator.calculateGeneralStatistics(logEntries);

    // יצירת דוח
    const format = options.format || 'text';
    let report;

    switch (format) {
      case 'json':
        report = LogReporter.generateJsonReport(statistics);
        break;
      case 'html':
        report = LogReporter.generateHtmlReport(statistics, filePath);
        break;
      default:
        report = LogReporter.generateTextReport(statistics, filePath);
    }

    // הדפסה או שמירה
    if (options.output) {
      const outputPath = path.resolve(options.output);
      await LogReporter.saveReport(report, outputPath, format);
      console.log(`\n✅ דוח נשמר ל: ${outputPath}\n`);
    } else {
      if (format !== 'html') {
        console.log(report);
      } else {
        const defaultOutput = path.join(process.cwd(), 'report.html');
        await LogReporter.saveReport(report, defaultOutput, format);
        console.log(`\n✅ דוח HTML נשמר ל: ${defaultOutput}\n`);
      }
    }

    return statistics;
  } catch (error) {
    console.error(`\n❌ שגיאה בניתוח: ${error.message}\n`);
    process.exit(1);
  }
}

/**
 * מנתחת תיקיית לוגים
 */
async function analyzeLogDirectory(dirPath, options = {}) {
  try {
    const resolvedPath = LogValidator.validateDirectory(dirPath);
    const files = await fs.readdir(resolvedPath);
    
    const logFiles = files.filter(file => 
      file.endsWith('.log') || file.endsWith('.txt')
    );

    if (logFiles.length === 0) {
      console.warn('⚠️  לא נמצאו קבצי לוג בתיקייה');
      return;
    }

    console.log(`\n📁 נמצאו ${logFiles.length} קבצי לוג\n`);

    const results = [];
    for (const file of logFiles) {
      const filePath = path.join(resolvedPath, file);
      try {
        const stats = await analyzeLogFile(filePath, options);
        if (stats) {
          results.push({ file, statistics: stats });
        }
      } catch (error) {
        console.error(`❌ שגיאה בניתוח ${file}: ${error.message}`);
      }
    }

    // סיכום כולל
    if (results.length > 0 && options.format === 'json') {
      const summary = {
        totalFiles: results.length,
        files: results.map(r => ({
          file: r.file,
          totalLines: r.statistics.summary.totalLines,
          errors: r.statistics.levels.errors,
          healthScore: r.statistics.healthScore
        }))
      };
      console.log(JSON.stringify(summary, null, 2));
    }

  } catch (error) {
    console.error(`❌ שגיאה: ${error.message}`);
    process.exit(1);
  }
}

// הגדרת CLI
program
  .name('log-analyzer')
  .description('מערכת ניתוח לוגים עם ולידציות והגנות')
  .version('1.0.0');

program
  .option('-f, --file <path>', 'נתיב לקובץ לוג לניתוח')
  .option('-d, --dir <path>', 'נתיב לתיקיית לוגים לניתוח')
  .option('-o, --output <path>', 'נתיב לשמירת דוח')
  .option('--format <type>', 'פורמט פלט (text, json, html)', 'text')
  .action(async (options) => {
    if (options.file) {
      await analyzeLogFile(options.file, options);
    } else if (options.dir) {
      await analyzeLogDirectory(options.dir, options);
    } else {
      console.error('❌ יש לציין --file או --dir');
      program.help();
      process.exit(1);
    }
  });

// הרצה
if (require.main === module) {
  program.parse();
}

module.exports = { analyzeLogFile, analyzeLogDirectory };
