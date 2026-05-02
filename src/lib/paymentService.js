export const initiatePayment = async (order) => {
  // Simulate processing time
  await new Promise((res) => setTimeout(res, 1500));

  // Simulate success/failure randomly (80% success)
  const isSuccess = Math.random() > 0.2;

  if (!isSuccess) {
    throw new Error("Payment failed");
  }

  return {
    paymentId: "pay_" + Date.now(),
    status: "success",
  };
};
