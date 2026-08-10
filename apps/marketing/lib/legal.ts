export const LEGAL_DETAILS = {
  operatorName: process.env.LEGAL_OPERATOR_NAME?.trim() || "Operator identity pending before sales open",
  operatorAddress: process.env.LEGAL_OPERATOR_ADDRESS?.trim() || "Postal address pending before sales open",
  operatorCountry: process.env.LEGAL_OPERATOR_COUNTRY?.trim() || "Switzerland",
  supportEmail: process.env.SUPPORT_EMAIL?.trim() || "hello@swiss-trails.com",
  complete: Boolean(
    process.env.LEGAL_OPERATOR_NAME?.trim() &&
    process.env.LEGAL_OPERATOR_ADDRESS?.trim()
  ),
} as const;
