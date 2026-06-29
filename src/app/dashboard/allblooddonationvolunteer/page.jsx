"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Eye } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AllBloodDonationVolunteer() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, [status]);

  const fetchRequests = async () => {
    const { data: tokenData } = await authClient.token();
    try {
      const res = await fetch(
        `http://localhost:5000/api/all-blood-donation-requests?status=${status}`,
        {
          headers: {
            authorization: `Bearer ${tokenData?.token}`,
          },
        }
      );

      const data = await res.json();

      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-request/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Status Updated");
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">
          All Blood Donation Requests
        </h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">

          <thead>
            <tr>
              <th>Recipient</th>
              <th>Location</th>
              <th>Blood Group</th>
              <th>Date & Time</th>
              <th>Requester</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>

                <td>{request.recipientName}</td>

                <td>
                  {request.recipientDistrict}
                  <br />
                  <span className="text-xs text-gray-500">
                    {request.recipientUpazila}
                  </span>
                </td>

                <td>
                  <span className="font-bold text-red-600">
                    {request.bloodGroup}
                  </span>
                </td>

                <td>
                  {request.donationDate}
                  <br />
                  <span className="text-xs text-gray-500">
                    {request.donationTime}
                  </span>
                </td>

                <td>
                  {request.requesterName}
                  <br />
                  <span className="text-xs text-gray-500">
                    {request.requesterEmail}
                  </span>
                </td>

                <td>
                  <span className="capitalize font-medium">
                    {request.donationStatus}
                  </span>

                  {request.donationStatus === "inprogress" && (
                    <div className="flex gap-2 mt-2">

                      <button
                        onClick={() =>
                          handleStatusChange(
                            request._id,
                            "done"
                          )
                        }
                        className="btn btn-success btn-xs"
                      >
                        Done
                      </button>

                      <button
                        onClick={() =>
                          handleStatusChange(
                            request._id,
                            "canceled"
                          )
                        }
                        className="btn btn-error btn-xs"
                      >
                        Cancel
                      </button>

                    </div>
                  )}
                </td>

                <td>
                  <Link
                    href={`/dashboard/donation-request/view/${request._id}`}
                    className="inline-flex"
                  >
                    <Eye size={18} />
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}