// File Status Enum
export enum FileStatus {
    UploadedByUser = 0,
    InProgress = 1,
    Completed = 2,
    ReturnedToUser = 3,
    SoftDeleted = 4,
  }
  
  // Status labels mapping
  export const FileStatusLabels: Record<FileStatus, { label: string; color: string }> = {
    [FileStatus.UploadedByUser]: { label: "הועלה על ידי המשתמש", color: "info" },
    [FileStatus.InProgress]: { label: "בתהליך", color: "warning" },
    [FileStatus.Completed]: { label: "הושלם", color: "success" },
    [FileStatus.ReturnedToUser]: { label: "הוחזר למשתמש", color: "primary" },
    [FileStatus.SoftDeleted]: { label: "נמחק", color: "error" },
  }
  
  export interface User {
    id: string
    name: string
  }
  
  export interface FileItem {
    id: string | number
    fileName: string
    name?: string
    userId: string | number
    userName?: string
    createdAt?: string
    hasTypedVersion?: boolean
    status?: number
    typedFileName?: string
    uploadDate?: string
    size?: number
    type?: string
    lastModified?: string
  }
  
  export interface ExtendedFileItem extends FileItem {
    statusLabel?: string
    statusColor?: string
  }
  
  export interface SnackbarState {
    open: boolean
    message: string
    severity: "success" | "error"
  }