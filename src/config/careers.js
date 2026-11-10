// Configuration for Careers Application Form Submission
// Note: The first submission triggers an activation email to careers@crownstoneofficial.com
// which must be confirmed once. FormSubmit emails the CV as an attachment
// (about 10 MB total limit) without storing it. No OneDrive, CRM, or external database required.

export const CAREERS_EMAIL = "careers@crownstoneofficial.com";
export const CAREERS_ENDPOINT = "https://formsubmit.co/ajax/careers@crownstoneofficial.com";
export const MAX_CV_MB = 5;
