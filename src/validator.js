const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config.json');

class LogValidator {
  /**
   * בודקת תקינות נתיב קובץ
   */
  static validateFilePath(filePath) {
    if (!filePath || typeof filePath !== 'string') {
      throw new Error('❌ נתיב קובץ לא תקין: נתיב ריק או לא תקין');
    }

    const resolvedPath = path.resolve(filePath);
    
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`❌ קובץ לא נמצא: ${resolvedPath}`);
    }

    return resolvedPath;
  }

  /**
   * בודקת הרשאות קריאה
   */
  static validateReadPermissions(filePath) {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;
    } catch (error) {
      throw new Error(`❌ אין הרשאות קריאה לקובץ: ${filePath}`);
    }
  }

  /**
   * בודקת גודל קובץ
   */
  static validateFileSize(filePath) {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const maxSize = config.maxFileSize;

    if (fileSizeInBytes > maxSize) {
      throw new Error(
        `❌ קובץ גדול מדי: ${(fileSizeInBytes / 1024 / 1024).toFixed(2)}MB (מקסימום: ${(maxSize / 1024 / 1024).toFixed(2)}MB)`
      );
    }

    if (fileSizeInBytes === 0) {
      throw new Error('❌ קובץ ריק');
    }

    return fileSizeInBytes;
  }

  /**
   * בודקת encoding
   */
  static async validateEncoding(filePath) {
    try {
      const buffer = await fs.readFile(filePath);
      const encoding = this.detectEncoding(buffer);
      
      if (!config.allowedEncodings.includes(encoding)) {
        throw new Error(`❌ Encoding לא נתמך: ${encoding}`);
      }

      return encoding;
    } catch (error) {
      if (error.message.includes('Encoding')) {
        throw error;
      }
      throw new Error(`❌ שגיאה בקריאת קובץ: ${error.message}`);
    }
  }

  /**
   * מזהה encoding של קובץ
   */
  static detectEncoding(buffer) {
    // בדיקה פשוטה - אם כל הבייטים תקינים ב-UTF-8
    try {
      buffer.toString('utf8');
      return 'utf8';
    } catch {
      return 'ascii';
    }
  }

  /**
   * בודקת תקינות תיקייה
   */
  static validateDirectory(dirPath) {
    if (!dirPath || typeof dirPath !== 'string') {
      throw new Error('❌ נתיב תיקייה לא תקין');
    }

    const resolvedPath = path.resolve(dirPath);
    
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`❌ תיקייה לא נמצאה: ${resolvedPath}`);
    }

    const stats = fs.statSync(resolvedPath);
    if (!stats.isDirectory()) {
      throw new Error(`❌ הנתיב אינו תיקייה: ${resolvedPath}`);
    }

    return resolvedPath;
  }

  /**
   * בודקת פורמט פלט
   */
  static validateOutputFormat(format) {
    if (!config.outputFormats.includes(format.toLowerCase())) {
      throw new Error(
        `❌ פורמט פלט לא נתמך: ${format}. פורמטים נתמכים: ${config.outputFormats.join(', ')}`
      );
    }
    return format.toLowerCase();
  }

  /**
   * ולידציה מלאה של קובץ לוג
   */
  static async validateLogFile(filePath) {
    const errors = [];
    const warnings = [];

    try {
      // בדיקת נתיב
      const validPath = this.validateFilePath(filePath);
      
      // בדיקת הרשאות
      this.validateReadPermissions(validPath);
      
      // בדיקת גודל
      const fileSize = this.validateFileSize(validPath);
      
      // בדיקת encoding
      const encoding = await this.validateEncoding(validPath);

      return {
        valid: true,
        path: validPath,
        size: fileSize,
        encoding: encoding,
        errors: [],
        warnings: warnings
      };
    } catch (error) {
      return {
        valid: false,
        path: filePath,
        errors: [error.message],
        warnings: []
      };
    }
  }
}

module.exports = LogValidator;
