"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
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
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const limit = 5;

  const fetchRequests = useCallback(async () => {
    const { data: tokenData } = await authClient.token();
    if (!user?.email) return;

    try {
      setLoading(true);

      const res = await fetch(
`http://localhost:5000/api/my-donation-requests?email=${user.email}&status=${statusFilter}&page=${currentPage}&limit=${limit}`,{
            headers: {
              authorization: `Bearer ${tokenData?.token}`
            }
          }
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
      "Are you sure you want to delete this request?"
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

  const handleStatusChange = async (
    id,
    status
  ) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/donation-request/status/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
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

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "inprogress":
        return "bg-blue-100 text-blue-700";

      case "done":
        return "bg-green-100 text-green-700";

      case "canceled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-white">
          My Donation Requests
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(
              e.target.value
            );
            setCurrentPage(1);
          }}
          className="border rounded-lg px-3 py-2 bg-white text-black"
        >
          <option value="all">
            All Requests
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="inprogress">
            In Progress
          </option>

          <option value="done">
            Done
          </option>

          <option value="canceled">
            Canceled
          </option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            Loading...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-10 text-center">
            No donation requests found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">
                    Recipient Name
                  </th>

                  <th className="p-4 text-left">
                    Donation Date
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {
                        request.recipientName
                      }
                    </td>

                    <td className="p-4">
                      {
                        request.donationDate
                      }
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                          request.donationStatus
                        )}`}
                      >
                        {
                          request.donationStatus
                        }
                      </span>

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

                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <Link
                          href={`/dashboard/donation-request/view/${request._id}`}
                        >
                          <Eye
                            size={18}
                            className="text-blue-600"
                          />
                        </Link>

                        {request.donationStatus ===
                          "pending" && (
                          <>
                            <Link
                              href={`/dashboard/donation-request/edit/${request._id}`}
                            >
                              <Edit
                                size={18}
                                className="text-green-600"
                              />
                            </Link>

                            <button
                              onClick={() =>
                                handleDelete(
                                  request._id
                                )
                              }
                            >
                              <Trash2
                                size={18}
                                className="text-red-600"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t">
              <p className="text-sm">
                Page {currentPage} of{" "}
                {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev - 1
                    )
                  }
                  className="border p-2 rounded disabled:opacity-50"
                >
                  <ChevronLeft
                    size={18}
                  />
                </button>

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) => prev + 1
                    )
                  }
                  className="border p-2 rounded disabled:opacity-50"
                >
                  <ChevronRight
                    size={18}
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}