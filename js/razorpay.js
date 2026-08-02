export const RAZORPAY_CONFIG = {
  keyId: "ADD_RAZORPAY_KEY_ID_HERE",
  currency: "INR",
  companyName: "Clad Whale",
  description: "Clad Whale order payment"
};

export function razorpayIsConfigured() {
  return Boolean(RAZORPAY_CONFIG.keyId && !RAZORPAY_CONFIG.keyId.includes("ADD_"));
}
