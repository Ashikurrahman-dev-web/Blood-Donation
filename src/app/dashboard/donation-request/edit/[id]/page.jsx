"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function EditDonationRequest() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientDistrict: "",
    recipientUpazila: "",
    hospitalName: "",
    fullAddress: "",
    bloodGroup: "",
    donationDate: "",
    donationTime: "",
    requestMessage: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      const { data: tokenData } = await authClient.token();
      try {
        const res = await fetch(
          `http://localhost:5000/api/donation-request/${id}`,
          {
            headers: {
              authorization: `Bearer ${tokenData?.token}`
            }
          }
        );

        const data = await res.json();

        setFormData({
          recipientName: data.recipientName || "",
          recipientDistrict: data.recipientDistrict || "",
          recipientUpazila: data.recipientUpazila || "",
          hospitalName: data.hospitalName || "",
          fullAddress: data.fullAddress || "",
          bloodGroup: data.bloodGroup || "",
          donationDate: data.donationDate || "",
          donationTime: data.donationTime || "",
          requestMessage: data.requestMessage || "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Failed to load request");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-request/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Donation Request Updated Successfully");

        router.push("/dashboard/mydonationrequest");
      } else {
        toast.error(data.message || "Update Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg font-medium">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          Edit Donation Request
        </h2>

        <Link
          href="/dashboard/mydonationrequest"
          className="text-red-600 hover:text-red-700"
        >
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          name="recipientName"
          value={formData.recipientName}
          onChange={handleChange}
          placeholder="Recipient Name"
          required
          className="w-full border p-3 rounded"
        />

        <div className="grid md:grid-cols-2 gap-5">
          <input
            type="text"
            name="recipientDistrict"
            value={formData.recipientDistrict}
            onChange={handleChange}
            placeholder="District"
            required
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="recipientUpazila"
            value={formData.recipientUpazila}
            onChange={handleChange}
            placeholder="Upazila"
            required
            className="border p-3 rounded"
          />
        </div>

        <input
          type="text"
          name="hospitalName"
          value={formData.hospitalName}
          onChange={handleChange}
          placeholder="Hospital Name"
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="fullAddress"
          value={formData.fullAddress}
          onChange={handleChange}
          placeholder="Full Address"
          required
          className="w-full border p-3 rounded"
        />

        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <div className="grid md:grid-cols-2 gap-5">
          <input
            type="date"
            name="donationDate"
            value={formData.donationDate}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="time"
            name="donationTime"
            value={formData.donationTime}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />
        </div>

        <textarea
          name="requestMessage"
          rows={5}
          value={formData.requestMessage}
          onChange={handleChange}
          placeholder="Request Message"
          required
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded"
        >
          Update Donation Request
        </button>
      </form>
    </div>
  );
}