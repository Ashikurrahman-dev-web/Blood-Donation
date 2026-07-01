"use client";

import {
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const { data: session } =
    useSession();

  const [amount, setAmount] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: tokenData } = await authClient.token(); 
const response = await fetch(
  `${process.env.NEXT_PUBLIC_SERVER_URI}/create-payment-intent`,
  {
    method: "POST",
    headers: {
      "Content-Type":
        "application/json",
        authorization: `Bearer ${tokenData?.token}`
    },
    body: JSON.stringify({
      amount: Number(amount),
    }),
  }
);

const data = await response.json();

console.log(data.clientSecret);

    const { clientSecret } =
      await response.json();

    const card =
      elements.getElement(CardElement);

    const result =
      await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name:
                session?.user?.name,
              email:
                session?.user?.email,
            },
          },
        }
      );

    if (result.error) {
      toast.error(
        result.error.message
      );
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/fundings`, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify({
        donorName:
          session?.user?.name,

        donorEmail:
          session?.user?.email,

        amount: Number(amount),

        transactionId:
          result.paymentIntent.id,
      }),
    });

    toast.success(
      "Donation Successful"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        type="number"
        placeholder="Amount"
        className="input input-bordered w-full"
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <CardElement />

      <button
        className="btn btn-primary w-full"
      >
        Pay
      </button>
    </form>
  );
}