const APPROVED_LEGAL_DETAILS = {
  operatorName: "Corsin Curtins / SwissTrails",
  operatorAddress: "Gottfried-Kellerstrasse 22, 8192 Glattfelden, Zürich",
  operatorCountry: "Switzerland",
  supportEmail: "admin@swisstrails.app",
  vatStatus: "Not registered for Swiss VAT (operator-declared turnover below CHF 100,000)",
  refundPolicySummary: "Full refund available on request within 14 calendar days of purchase; feedback is optional.",
} as const;

export const LEGAL_DETAILS = {
  operatorName: process.env.LEGAL_OPERATOR_NAME?.trim() || APPROVED_LEGAL_DETAILS.operatorName,
  operatorAddress: process.env.LEGAL_OPERATOR_ADDRESS?.trim() || APPROVED_LEGAL_DETAILS.operatorAddress,
  operatorCountry: process.env.LEGAL_OPERATOR_COUNTRY?.trim() || APPROVED_LEGAL_DETAILS.operatorCountry,
  supportEmail: process.env.SUPPORT_EMAIL?.trim() || APPROVED_LEGAL_DETAILS.supportEmail,
  vatStatus: process.env.LEGAL_VAT_STATUS?.trim() || APPROVED_LEGAL_DETAILS.vatStatus,
  refundPolicySummary: process.env.REFUND_POLICY_SUMMARY?.trim() || APPROVED_LEGAL_DETAILS.refundPolicySummary,
  complete: true,
} as const;
