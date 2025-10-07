"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { downloadFile, fileToBase64 } from "@/utils/methods/helpers";

/**
 * Custom hook for file operations (upload, download, preview)
 * @param {Object} options - Configuration options
 * @returns {Object} File operation utilities and state
 */
export const useFileOperations = (options = {}) => {
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { addToast } = useToast();

  /**
   * Download a file from URL
   * @param {string} url - File URL
   * @param {string} filename - Desired filename
   */
  const download = useCallback(async (url, filename) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      downloadFile(downloadUrl, filename || "download");
      
      window.URL.revokeObjectURL(downloadUrl);
      addToast("File downloaded successfully", "success");
    } catch (error) {
      addToast(error.message || "Failed to download file", "error");
      throw error;
    } finally {
      setDownloading(false);
    }
  }, [addToast]);

  /**
   * Upload files with progress tracking
   * @param {FileList|File[]} files - Files to upload
   * @param {Function} uploadFunction - Function to handle upload
   * @param {Object} uploadOptions - Additional upload options
   */
  const upload = useCallback(async (files, uploadFunction, uploadOptions = {}) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const fileArray = Array.from(files);
      const results = [];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        
        // Validate file if validation function provided
        if (uploadOptions.validateFile) {
          const validation = uploadOptions.validateFile(file);
          if (!validation.isValid) {
            throw new Error(validation.message);
          }
        }

        // Upload file
        const result = await uploadFunction(file, {
          ...uploadOptions,
          onProgress: (progress) => {
            const totalProgress = ((i / fileArray.length) + (progress / 100 / fileArray.length)) * 100;
            setUploadProgress(totalProgress);
          },
        });

        results.push({ file, result });
      }

      setUploadedFiles(prev => [...prev, ...results]);
      addToast(`${fileArray.length} file(s) uploaded successfully`, "success");
      
      return results;
    } catch (error) {
      addToast(error.message || "Failed to upload file(s)", "error");
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [addToast]);

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   */
  const convertToBase64 = useCallback(async (file) => {
    try {
      return await fileToBase64(file);
    } catch (error) {
      addToast("Failed to convert file", "error");
      throw error;
    }
  }, [addToast]);

  /**
   * Preview file (for images, PDFs, etc.)
   * @param {File} file - File to preview
   */
  const previewFile = useCallback((file) => {
    if (!file) return null;

    const url = URL.createObjectURL(file);
    
    // Return cleanup function
    return {
      url,
      cleanup: () => URL.revokeObjectURL(url),
    };
  }, []);

  /**
   * Validate file type and size
   * @param {File} file - File to validate
   * @param {Object} rules - Validation rules
   */
  const validateFile = useCallback((file, rules = {}) => {
    const {
      allowedTypes = [],
      maxSize = Infinity,
      minSize = 0,
    } = rules;

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(", ")}`,
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`,
      };
    }

    if (file.size < minSize) {
      return {
        isValid: false,
        message: `File size is too small. Minimum size: ${(minSize / 1024).toFixed(2)}KB`,
      };
    }

    return { isValid: true, message: "" };
  }, []);

  /**
   * Remove uploaded file from state
   * @param {number} index - Index of file to remove
   */
  const removeUploadedFile = useCallback((index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Clear all uploaded files
   */
  const clearUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  /**
   * Get file extension
   * @param {string} filename - Filename
   */
  const getFileExtension = useCallback((filename) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  }, []);

  /**
   * Format file size
   * @param {number} bytes - File size in bytes
   */
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  /**
   * Check if file is an image
   * @param {File|string} file - File object or MIME type
   */
  const isImage = useCallback((file) => {
    const mimeType = typeof file === 'string' ? file : file.type;
    return mimeType.startsWith('image/');
  }, []);

  /**
   * Check if file is a PDF
   * @param {File|string} file - File object or MIME type
   */
  const isPDF = useCallback((file) => {
    const mimeType = typeof file === 'string' ? file : file.type;
    return mimeType === 'application/pdf';
  }, []);

  return {
    // State
    uploading,
    downloading,
    uploadProgress,
    uploadedFiles,

    // Operations
    download,
    upload,
    convertToBase64,
    previewFile,
    validateFile,

    // File management
    removeUploadedFile,
    clearUploadedFiles,

    // Utilities
    getFileExtension,
    formatFileSize,
    isImage,
    isPDF,
  };
};
