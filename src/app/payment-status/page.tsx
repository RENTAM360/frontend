"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatedLogo } from "@/components/loading-logo";
import { SuccessModal } from "@/components/success-modal";
import { enqueueSnackbar } from "notistack";

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentStatus = searchParams.get("status");
  const paymentAmount = searchParams.get("amount");

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!paymentStatus) {
      enqueueSnackbar(
        "Invalid payment response. Please check your transaction history.",
        { variant: "error" }
      );
      setIsLoading(false);
      return;
    }

    const isSuccessful =
      paymentStatus.toLowerCase() === "success" ||
      paymentStatus.toLowerCase() === "successful";

    if (isSuccessful && paymentAmount) {
      setShowModal(true);
      setIsLoading(false);
    } else {
      enqueueSnackbar("Your payment was not successful. Please try again.", {
        variant: "error",
      });
      setTimeout(() => {
        router.replace("/dashboard/profile");
      }, 3000);

      setIsLoading(false);
    }
  }, [paymentStatus, paymentAmount, router]);

  const handleModalAction = () => {
    setShowModal(false);
    router.push("/dashboard/profile?wallet");
  };

  const amountToDisplay = paymentAmount ? parseFloat(paymentAmount) : 0;
  const formattedAmount = isNaN(amountToDisplay) ? 0 : amountToDisplay;

  if (isLoading) {
    return <AnimatedLogo />;
  }

  if (showModal) {
    return (
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Success! Your transaction of ${formattedAmount} has been completed successfully`}
        icon="success"
        amount={formattedAmount}
        actionLabel="View My Profile"
        onAction={handleModalAction}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Processing Transaction...</h1>
      <p className="text-gray-600">You will be redirected shortly.</p>
    </div>
  );
}
