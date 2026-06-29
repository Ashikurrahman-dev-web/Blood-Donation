"use client";
import CheckoutForm from "@/components/funding/CheckoutForm";
import StripeProvider from "@/providers/StripeProvider";
export default function DonatePage() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Give Fund
      </h1>
<StripeProvider>
      <CheckoutForm />
      </StripeProvider>
    </div>
  );
}