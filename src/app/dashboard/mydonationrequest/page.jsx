"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function MyDonationRequests() {
  const { data: session } = useSession();
  const user = session?.user;

  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  const fetchRequests = useCallback(async () => {
    if (!user?.email) return;
console.log("SESSION USER:", user);
console.log("SESSION EMAIL:", user?.email);
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:5000/api/my-donation-requests?email=${user.email}&status=${statusFilter}&page=${currentPage}&limit=${limit}`
      );

      const data = await res.json();

      setRequests(data.requests || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [user, statusFilter, currentPage]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-request/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (data.deletedCount > 0) {
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-request/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (data.success) {
        fetchRequests();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          My Donation Requests
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            Loading...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center">
            No Request Found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Blood</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {request.recipientName}
                    </td>

                    <td className="p-3">
                      {request.recipientDistrict}
                      <br />
                      <span className="text-xs text-gray-500">
                        {request.recipientUpazila}
                      </span>
                    </td>

                    <td className="p-3">
                      {request.donationDate}
                    </td>

                    <td className="p-3">
                      {request.bloodGroup}
                    </td>

                    <td className="p-3">
                      {request.donationStatus}

                      {request.donationStatus ===
                        "inprogress" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleStatusChange(
                                request._id,
                                "done"
                              )
                            }
                            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
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
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex gap-3">
                        <a
                          href={`/dashboard/donation-request/view/${request._id}`}
                        >
                          <Eye size={18} />
                        </a>

                        <a
                          href={`/dashboard/donation-request/edit/${request._id}`}
                        >
                          <Edit size={18} />
                        </a>

                        <button
                          onClick={() =>
                            handleDelete(request._id)
                          }
                        >
                          <Trash2
                            size={18}
                            className="text-red-500"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center p-4 border-t">
              <p>
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => prev - 1)
                  }
                  className="border p-2 rounded"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((prev) => prev + 1)
                  }
                  className="border p-2 rounded"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}