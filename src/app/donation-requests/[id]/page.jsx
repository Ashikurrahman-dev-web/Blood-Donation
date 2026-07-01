"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DonationRequestDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { data: session, isPending } = useSession();
  const user = session?.user;
  useEffect(() => {
    if (!session) return;
    const { data: tokenData } = authClient.token();
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/donation-request/${id}`,{
          headers: {
            authorization: `Bearer ${tokenData?.token}`
          }
        })
      .then((res) => res.json())
      .then((data) => {
        setRequest(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, session]);
  const handleDonate = async () => {
    const { data: tokenData } = await authClient.token();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/donation-request/donate/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${tokenData?.token}`,
          },
          body: JSON.stringify({
            donorName: user?.name,
            donorEmail: user?.email,
          }),
        }
      );

      const data = await res.json();
 if (data.success) {
        toast.success("Donation Confirmed");
      setRequest({
        ...request,
        donationStatus: "inprogress",
        donorName: user?.name,
        donorEmail: user?.email,
      });

      setShowModal(false);
      setTimeout(() => {
          router.refresh();
        }, 1000)}
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  if (isPending) {
  return (
    <div className="text-center py-20">
      Loading...
    </div>
  );
}

if (!session) {
  router.push("/login");
  return null;
};
if (loading) { return ( <div className="text-center py-20"> Loading... </div> ); }
  return (
    <div className="max-w-5xl mx-auto py-10 px-4">

      <div className="bg-white rounded-xl shadow border p-8">

        <h1 className="text-3xl font-bold mb-8">
          Blood Donation Request Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
<div>
  <p className="font-semibold">Requester Name</p>
  <p>{request.requesterName}</p>
</div>

<div>
  <p className="font-semibold">Requester Email</p>
  <p>{request.requesterEmail}</p>
</div>
          <div>
            <p className="font-semibold">
              Blood Group
            </p>
            <p>{request.bloodGroup}</p>
          </div>

          <div>
            <p className="font-semibold">
              District
            </p>
            <p>{request.recipientDistrict}</p>
          </div>

          <div>
            <p className="font-semibold">
              Upazila
            </p>
            <p>{request.recipientUpazila}</p>
          </div>

          <div>
            <p className="font-semibold">
              Hospital Name
            </p>
            <p>{request.hospitalName}</p>
          </div>

          <div>
            <p className="font-semibold">
              Donation Date
            </p>
            <p>{request.donationDate}</p>
          </div>

          <div>
            <p className="font-semibold">
              Donation Time
            </p>
            <p>{request.donationTime}</p>
          </div>

          <div>
            <p className="font-semibold">
              Status
            </p>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.donationStatus === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : request.donationStatus === "inprogress"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {request.donationStatus}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold">
            Full Address
          </p>

          <p>{request.fullAddress}</p>
        </div>

        <div className="mt-6">
          <p className="font-semibold">
            Request Message
          </p>

          <p>{request.requestMessage}</p>
        </div>

        {request.requesterEmail !== user?.email &&
 request.donationStatus === "pending" && (
   <button
     onClick={() => setShowModal(true)}
   >
     Donate
   </button>
)}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-full max-w-md">

            <h2 className="text-2xl font-bold mb-5">
              Confirm Donation
            </h2>

            <div className="space-y-4">

              <div>
                <label className="block mb-1 font-medium">
                  Donor Name
                </label>

                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full border p-3 rounded bg-gray-100"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Donor Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full border p-3 rounded bg-gray-100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">

              <button
                onClick={handleDonate}
                className="bg-red-600 text-white px-5 py-2 rounded"
              >
                Confirm
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-5 py-2 rounded"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}