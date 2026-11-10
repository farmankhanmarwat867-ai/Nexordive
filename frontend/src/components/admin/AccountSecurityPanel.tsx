'use client';

import React, { useState, useEffect, useRef, useId } from 'react';
import {
  ShieldCheck,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Info,
  AlertTriangle,
} from 'lucide-react';
import {
  ensureAdminCredentials,
  getDefaultAdminEmail,
  getStoredCredentials,
  isUsingDefaultCredentials,
  updateAdminEmail,
  updateAdminPassword,
  validateEmail,
  validatePasswordStrength,
  StoredAdminCredentials,
} from '../../services/adminAuth';
import { EmailField } from './common/EmailField';
import { PasswordField, PasswordRequirementsList } from './common/PasswordField';

interface AccountSecurityPanelProps {
  currentEmail?: string;
  onEmailUpdated?: (newEmail: string) => void;
  onSignOut?: () => void;
}

interface FeedbackState {
  type: 'success' | 'error';
  message: string;
}

function formatUpdatedDate(iso?: string): string {
  if (!iso) return 'Just now';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Recently';
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export const AccountSecurityPanel: React.FC<AccountSecurityPanelProps> = ({
  currentEmail,
  onEmailUpdated,
  onSignOut,
}) => {
  const [stored, setStored] = useState<StoredAdminCredentials | null>(() => getStoredCredentials());
  const [usingDefaults, setUsingDefaults] = useState<boolean>(() => isUsingDefaultCredentials());

  // Change Email state
  const [newEmail, setNewEmail] = useState('');
  const [emailConfirmPassword, setEmailConfirmPassword] = useState('');
  const [newEmailBlurred, setNewEmailBlurred] = useState(false);
  const [emailPassBlurred, setEmailPassBlurred] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<FeedbackState | null>(null);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassBlurred, setCurrentPassBlurred] = useState(false);
  const [newPassBlurred, setNewPassBlurred] = useState(false);
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<FeedbackState | null>(null);

  const newEmailRef = useRef<HTMLInputElement>(null);
  const emailConfirmPassRef = useRef<HTMLInputElement>(null);
  const currentPassRef = useRef<HTMLInputElement>(null);
  const newPassRef = useRef<HTMLInputElement>(null);

  const emailFormTitleId = useId();
  const passwordFormTitleId = useId();
  const passwordRulesId = useId();

  useEffect(() => {
    let active = true;
    void ensureAdminCredentials().then((creds) => {
      if (!active || !creds) return;
      setStored(creds);
      setUsingDefaults(creds.source !== 'custom');
    });
    return () => {
      active = false;
    };
  }, []);

  const refreshStored = () => {
    const next = getStoredCredentials();
    setStored(next);
    setUsingDefaults(isUsingDefaultCredentials());
  };

  const activeEmail = stored?.email || currentEmail || getDefaultAdminEmail();

  const newEmailErr =
    emailSubmitted || (newEmailBlurred && newEmail.length > 0)
      ? validateEmail(newEmail)
      : null;
  const emailConfirmPassErr =
    emailSubmitted || (emailPassBlurred && emailConfirmPassword.length > 0)
      ? !emailConfirmPassword
        ? 'Enter your current password to confirm.'
        : null
      : null;

  const currentPassErr =
    passwordSubmitted || (currentPassBlurred && currentPassword.length > 0)
      ? !currentPassword
        ? 'Please enter your current password.'
        : null
      : null;
  const newPassErr =
    passwordSubmitted || (newPassBlurred && newPassword.length > 0)
      ? validatePasswordStrength(newPassword)
      : null;

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSubmitted(true);
    setEmailFeedback(null);

    const errEmail = validateEmail(newEmail);
    if (errEmail) {
      newEmailRef.current?.focus();
      return;
    }
    if (!emailConfirmPassword) {
      emailConfirmPassRef.current?.focus();
      return;
    }

    setEmailSaving(true);
    try {
      const res = await updateAdminEmail(newEmail, emailConfirmPassword);
      if (!res.success || !res.email) {
        setEmailFeedback({
          type: 'error',
          message: res.error || 'Unable to update login email.',
        });
        if (res.error?.toLowerCase().includes('password')) {
          emailConfirmPassRef.current?.focus();
        } else {
          newEmailRef.current?.focus();
        }
        return;
      }

      refreshStored();
      onEmailUpdated?.(res.email);
      setNewEmail('');
      setEmailConfirmPassword('');
      setNewEmailBlurred(false);
      setEmailPassBlurred(false);
      setEmailSubmitted(false);
      setEmailFeedback({
        type: 'success',
        message: `Admin login email updated to ${res.email}. Use this email next time you sign in.`,
      });
    } finally {
      setEmailSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSubmitted(true);
    setPasswordFeedback(null);

    if (!currentPassword) {
      currentPassRef.current?.focus();
      return;
    }
    const errNewPass = validatePasswordStrength(newPassword);
    if (errNewPass) {
      newPassRef.current?.focus();
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await updateAdminPassword(currentPassword, newPassword);
      if (!res.success) {
        setPasswordFeedback({
          type: 'error',
          message: res.error || 'Unable to update password.',
        });
        if (res.error?.toLowerCase().includes('current password')) {
          currentPassRef.current?.focus();
        } else {
          newPassRef.current?.focus();
        }
        return;
      }

      refreshStored();
      setCurrentPassword('');
      setNewPassword('');
      setCurrentPassBlurred(false);
      setNewPassBlurred(false);
      setPasswordSubmitted(false);
      setPasswordFeedback({
        type: 'success',
        message:
          'Admin password updated and re-encrypted. Use your new password on your next sign-in.',
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  const renderFeedback = (feedback: FeedbackState | null) => {
    if (!feedback) return null;
    const isSuccess = feedback.type === 'success';
    return (
      <div
        role="status"
        aria-live="polite"
        className={`p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
        ) : (
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
        )}
        <span>{feedback.message}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Account Status Overview */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-display">
                  Admin Account &amp; Credentials
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  PBKDF2-SHA256 Protected
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 break-all">
                Active admin login email:{' '}
                <strong className="text-slate-800">{activeEmail}</strong>
                {stored && (
                  <span className="text-slate-400">
                    {' '}
                    · Last updated {formatUpdatedDate(stored.updatedAt)}
                  </span>
                )}
              </p>
            </div>
          </div>

          {onSignOut && (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>Sign Out &amp; Lock</span>
            </button>
          )}
        </div>

        {usingDefaults && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              You are currently signed in with the default admin credentials. Update your login
              email and password below to personalize your access.
            </span>
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            Custom credentials are salted and hashed locally in this browser&apos;s storage.
            Updating your email or password here takes effect immediately for this browser.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Card 1: Update Login Email */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#004d6a] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id={emailFormTitleId}
                className="text-base font-bold text-slate-900 font-display"
              >
                Change Login Email
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Requires your current password to verify the change.
              </p>
            </div>
          </div>

          {renderFeedback(emailFeedback)}

          <form
            onSubmit={handleEmailUpdate}
            noValidate
            aria-labelledby={emailFormTitleId}
            className="nexor-auth-form space-y-4"
          >
            <EmailField
              inputRef={newEmailRef}
              id="security-new-email"
              name="new-email"
              label="New Admin Email"
              value={newEmail}
              onChange={(val) => {
                setNewEmail(val);
                if (emailFeedback) setEmailFeedback(null);
              }}
              onBlur={() => setNewEmailBlurred(true)}
              autoComplete="email"
              enterKeyHint="next"
              hint={`Current: ${activeEmail}`}
              error={newEmailErr}
            />

            <PasswordField
              inputRef={emailConfirmPassRef}
              id="security-email-current-password"
              name="current-password"
              label="Current Password"
              value={emailConfirmPassword}
              onChange={(val) => {
                setEmailConfirmPassword(val);
                if (emailFeedback) setEmailFeedback(null);
              }}
              onBlur={() => setEmailPassBlurred(true)}
              autoComplete="current-password"
              enterKeyHint="done"
              error={emailConfirmPassErr}
            />

            <button
              type="submit"
              disabled={emailSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{emailSaving ? 'Updating Email...' : 'Update Login Email'}</span>
            </button>
          </form>
        </div>

        {/* Card 2: Change Password */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <h3
                id={passwordFormTitleId}
                className="text-base font-bold text-slate-900 font-display"
              >
                Change Password
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Re-encrypts your admin password with a fresh cryptographic salt.
              </p>
            </div>
          </div>

          {renderFeedback(passwordFeedback)}

          <form
            onSubmit={handlePasswordUpdate}
            noValidate
            aria-labelledby={passwordFormTitleId}
            className="nexor-auth-form space-y-4"
          >
            {/* Hidden username hint for browser password managers */}
            <input
              type="email"
              name="username"
              autoComplete="username"
              value={activeEmail}
              readOnly
              tabIndex={-1}
              aria-hidden="true"
              className="visually-hidden"
            />

            <PasswordField
              inputRef={currentPassRef}
              id="security-current-password"
              name="current-password"
              label="Current Password"
              value={currentPassword}
              onChange={(val) => {
                setCurrentPassword(val);
                if (passwordFeedback) setPasswordFeedback(null);
              }}
              onBlur={() => setCurrentPassBlurred(true)}
              autoComplete="current-password"
              enterKeyHint="next"
              error={currentPassErr}
            />

            <PasswordField
              inputRef={newPassRef}
              id="security-new-password"
              name="new-password"
              label="New Password"
              value={newPassword}
              onChange={(val) => {
                setNewPassword(val);
                if (passwordFeedback) setPasswordFeedback(null);
              }}
              onBlur={() => setNewPassBlurred(true)}
              autoComplete="new-password"
              minLength={8}
              enterKeyHint="done"
              hintId={passwordRulesId}
              aboveHint={
                <PasswordRequirementsList
                  id={passwordRulesId}
                  password={newPassword}
                  hasError={Boolean(newPassErr)}
                />
              }
              error={newPassErr}
            />

            <button
              type="submit"
              disabled={passwordSaving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 min-h-11 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#004d6a] hover:bg-[#093c47] shadow-sm transition-colors cursor-pointer disabled:opacity-60"
            >
              <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
