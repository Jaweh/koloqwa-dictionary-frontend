export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: "User" | "Admin" | "SuperAdmin";
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: string;
  user: AuthUser;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SubmissionItem {
  id: string;
  entryType: string;
  entryId: string;
  entryPreview: string;
  status: string;
  submitterName: string;
  submitterEmail: string;
  adminNote: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}
