const config = require('../config/config.json');

class LogCalculator {
  /**
   * מנתחת שורות לוג ומחלצת מידע
   */
  static parseLogLine(line, lineNumber) {
    const result = {
      lineNumber: lineNumber,
      level: null,
      timestamp: null,
      message: line.trim(),
      responseTime: null
    };

    // חילוץ רמת לוג
    for (const [level, patterns] of Object.entries(config.logPatterns)) {
      for (const pattern of patterns) {
        if (line.includes(pattern)) {
          result.level = level;
          break;
        }
      }
      if (result.level) break;
    }

    // חילוץ timestamp
    const timeMatch = line.match(new RegExp(config.timePattern));
    if (timeMatch) {
      result.timestamp = timeMatch[0];
    }

    // חילוץ זמן תגובה
    const responseTimeMatch = line.match(new RegExp(config.responseTimePattern));
    if (responseTimeMatch) {
      result.responseTime = parseFloat(responseTimeMatch[1]);
    }

    return result;
  }

  /**
   * מחשבת סטטיסטיקות משגיאות
   */
  static calculateErrorStatistics(logEntries) {
    const errors = logEntries.filter(entry => entry.level === 'error');
    const warnings = logEntries.filter(entry => entry.level === 'warning');
    const info = logEntries.filter(entry => entry.level === 'info');
    const debug = logEntries.filter(entry => entry.level === 'debug');

    return {
      total: logEntries.length,
      errors: errors.length,
      warnings: warnings.length,
      info: info.length,
      debug: debug.length,
      errorRate: logEntries.length > 0 
        ? ((errors.length / logEntries.length) * 100).toFixed(2) 
        : '0.00'
    };
  }

  /**
   * מחשבת סטטיסטיקות זמני תגובה
   */
  static calculateResponseTimeStatistics(logEntries) {
    const responseTimes = logEntries
      .filter(entry => entry.responseTime !== null)
      .map(entry => entry.responseTime);

    if (responseTimes.length === 0) {
      return {
        count: 0,
        average: 0,
        min: 0,
        max: 0,
        median: 0
      };
    }

    const sorted = [...responseTimes].sort((a, b) => a - b);
    const sum = responseTimes.reduce((a, b) => a + b, 0);
    const average = sum / responseTimes.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return {
      count: responseTimes.length,
      average: parseFloat(average.toFixed(2)),
      min: parseFloat(min.toFixed(2)),
      max: parseFloat(max.toFixed(2)),
      median: parseFloat(median.toFixed(2))
    };
  }

  /**
   * מחשבת מגמות לפי זמן
   */
  static calculateTimeTrends(logEntries) {
    const entriesByHour = {};
    
    logEntries.forEach(entry => {
      if (entry.timestamp) {
        const hour = entry.timestamp.substring(0, 13); // YYYY-MM-DD HH
        if (!entriesByHour[hour]) {
          entriesByHour[hour] = { total: 0, errors: 0, warnings: 0 };
        }
        entriesByHour[hour].total++;
        if (entry.level === 'error') entriesByHour[hour].errors++;
        if (entry.level === 'warning') entriesByHour[hour].warnings++;
      }
    });

    return entriesByHour;
  }

  /**
   * מזהה שגיאות קריטיות
   */
  static findCriticalErrors(logEntries) {
    const criticalKeywords = ['fatal', 'critical', 'exception', 'crash', 'failed', 'timeout'];
    
    return logEntries
      .filter(entry => {
        const message = entry.message.toLowerCase();
        return entry.level === 'error' && 
               criticalKeywords.some(keyword => message.includes(keyword));
      })
      .slice(0, 10) // 10 שגיאות קריטיות ראשונות
      .map(entry => ({
        line: entry.lineNumber,
        message: entry.message.substring(0, 200), // 200 תווים ראשונים
        timestamp: entry.timestamp || 'N/A'
      }));
  }

  /**
   * מחשבת סטטיסטיקות כלליות
   */
  static calculateGeneralStatistics(logEntries) {
    const errorStats = this.calculateErrorStatistics(logEntries);
    const responseTimeStats = this.calculateResponseTimeStatistics(logEntries);
    const trends = this.calculateTimeTrends(logEntries);
    const criticalErrors = this.findCriticalErrors(logEntries);

    return {
      summary: {
        totalLines: errorStats.total,
        processedAt: new Date().toISOString()
      },
      levels: {
        errors: errorStats.errors,
        warnings: errorStats.warnings,
        info: errorStats.info,
        debug: errorStats.debug,
        errorRate: `${errorStats.errorRate}%`
      },
      responseTime: responseTimeStats,
      trends: trends,
      criticalErrors: criticalErrors,
      healthScore: this.calculateHealthScore(errorStats, responseTimeStats)
    };
  }

  /**
   * מחשבת ציון בריאות (0-100)
   */
  static calculateHealthScore(errorStats, responseTimeStats) {
    let score = 100;

    // הפחתה לפי אחוז שגיאות
    const errorRate = parseFloat(errorStats.errorRate);
    score -= errorRate * 2; // כל 1% שגיאות = -2 נקודות

    // הפחתה לפי זמני תגובה
    if (responseTimeStats.average > 1000) {
      score -= 10; // זמני תגובה איטיים
    }
    if (responseTimeStats.average > 5000) {
      score -= 20; // זמני תגובה מאוד איטיים
    }

    // הפחתה לפי שגיאות קריטיות
    if (errorStats.errors > 50) {
      score -= 15;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

module.exports = LogCalculator;
