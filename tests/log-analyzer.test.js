const LogValidator = require('../src/validator');
const LogCalculator = require('../src/calculator');
const LogReporter = require('../src/reporter');
const fs = require('fs-extra');
const path = require('path');

describe('Log Validator', () => {
  const testLogPath = path.join(__dirname, 'test.log');

  beforeAll(async () => {
    // יצירת קובץ לוג לבדיקה
    await fs.writeFile(testLogPath, 
      '2024-01-15 10:00:00 INFO Test message\n' +
      '2024-01-15 10:00:05 ERROR Test error\n' +
      '2024-01-15 10:00:10 WARN Test warning\n',
      'utf8'
    );
  });

  afterAll(async () => {
    // ניקוי
    if (await fs.pathExists(testLogPath)) {
      await fs.remove(testLogPath);
    }
  });

  test('should validate existing file path', () => {
    const result = LogValidator.validateFilePath(testLogPath);
    expect(result).toBe(testLogPath);
  });

  test('should throw error for non-existent file', () => {
    expect(() => {
      LogValidator.validateFilePath('/nonexistent/file.log');
    }).toThrow();
  });

  test('should validate file size', () => {
    const size = LogValidator.validateFileSize(testLogPath);
    expect(size).toBeGreaterThan(0);
  });

  test('should validate read permissions', () => {
    expect(() => {
      LogValidator.validateReadPermissions(testLogPath);
    }).not.toThrow();
  });

  test('should validate output format', () => {
    expect(LogValidator.validateOutputFormat('json')).toBe('json');
    expect(LogValidator.validateOutputFormat('text')).toBe('text');
    expect(LogValidator.validateOutputFormat('html')).toBe('html');
  });

  test('should throw error for invalid output format', () => {
    expect(() => {
      LogValidator.validateOutputFormat('xml');
    }).toThrow();
  });

  test('should validate log file completely', async () => {
    const result = await LogValidator.validateLogFile(testLogPath);
    expect(result.valid).toBe(true);
    expect(result.path).toBe(testLogPath);
    expect(result.size).toBeGreaterThan(0);
  });
});

describe('Log Calculator', () => {
  test('should parse log line correctly', () => {
    const line = '2024-01-15 10:00:00 INFO User logged in responseTime: 45.2';
    const result = LogCalculator.parseLogLine(line, 1);
    
    expect(result.level).toBe('info');
    expect(result.timestamp).toBe('2024-01-15 10:00:00');
    expect(result.responseTime).toBe(45.2);
  });

  test('should identify error level', () => {
    const line = '2024-01-15 10:00:00 ERROR Something went wrong';
    const result = LogCalculator.parseLogLine(line, 1);
    expect(result.level).toBe('error');
  });

  test('should calculate error statistics', () => {
    const entries = [
      { level: 'error', lineNumber: 1, message: 'Error 1' },
      { level: 'error', lineNumber: 2, message: 'Error 2' },
      { level: 'warning', lineNumber: 3, message: 'Warning 1' },
      { level: 'info', lineNumber: 4, message: 'Info 1' }
    ];

    const stats = LogCalculator.calculateErrorStatistics(entries);
    expect(stats.total).toBe(4);
    expect(stats.errors).toBe(2);
    expect(stats.warnings).toBe(1);
    expect(stats.info).toBe(1);
    expect(parseFloat(stats.errorRate)).toBe(50.00);
  });

  test('should calculate response time statistics', () => {
    const entries = [
      { responseTime: 10, lineNumber: 1 },
      { responseTime: 20, lineNumber: 2 },
      { responseTime: 30, lineNumber: 3 },
      { responseTime: 40, lineNumber: 4 },
      { responseTime: 50, lineNumber: 5 }
    ];

    const stats = LogCalculator.calculateResponseTimeStatistics(entries);
    expect(stats.count).toBe(5);
    expect(stats.average).toBe(30);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(50);
    expect(stats.median).toBe(30);
  });

  test('should find critical errors', () => {
    const entries = [
      { level: 'error', lineNumber: 1, message: 'Fatal error occurred', timestamp: '2024-01-15 10:00:00' },
      { level: 'error', lineNumber: 2, message: 'System crash detected', timestamp: '2024-01-15 10:00:05' },
      { level: 'info', lineNumber: 3, message: 'Normal operation', timestamp: '2024-01-15 10:00:10' }
    ];

    const critical = LogCalculator.findCriticalErrors(entries);
    expect(critical.length).toBeGreaterThan(0);
    expect(critical[0].message.toLowerCase()).toContain('fatal');
  });

  test('should calculate health score', () => {
    const errorStats = {
      errors: 5,
      total: 100,
      errorRate: '5.00'
    };
    const responseTimeStats = {
      average: 100,
      count: 10
    };

    const score = LogCalculator.calculateHealthScore(errorStats, responseTimeStats);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('Log Reporter', () => {
  test('should generate text report', () => {
    const statistics = {
      summary: {
        totalLines: 100,
        processedAt: '2024-01-15T10:00:00.000Z'
      },
      levels: {
        errors: 5,
        warnings: 10,
        info: 80,
        debug: 5,
        errorRate: '5.00%'
      },
      responseTime: {
        count: 50,
        average: 100,
        min: 10,
        max: 500,
        median: 95
      },
      trends: {},
      criticalErrors: [],
      healthScore: 85
    };

    const report = LogReporter.generateTextReport(statistics, 'test.log');
    expect(report).toContain('דוח ניתוח לוגים');
    expect(report).toContain('100');
    expect(report).toContain('5');
  });

  test('should generate JSON report', () => {
    const statistics = {
      summary: { totalLines: 100 },
      levels: { errors: 5 },
      healthScore: 85
    };

    const report = LogReporter.generateJsonReport(statistics);
    const parsed = JSON.parse(report);
    expect(parsed.summary.totalLines).toBe(100);
    expect(parsed.levels.errors).toBe(5);
  });

  test('should generate HTML report', () => {
    const statistics = {
      summary: {
        totalLines: 100,
        processedAt: '2024-01-15T10:00:00.000Z'
      },
      levels: {
        errors: 5,
        warnings: 10,
        info: 80,
        debug: 5,
        errorRate: '5.00%'
      },
      responseTime: {
        count: 50,
        average: 100,
        min: 10,
        max: 500,
        median: 95
      },
      trends: {},
      criticalErrors: [],
      healthScore: 85
    };

    const report = LogReporter.generateHtmlReport(statistics, 'test.log');
    expect(report).toContain('<!DOCTYPE html>');
    expect(report).toContain('100');
    expect(report).toContain('85');
  });
});
