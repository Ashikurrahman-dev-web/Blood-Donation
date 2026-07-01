"use client"
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { authClient, useSession } from '@/lib/auth-client';
import Link from 'next/link';

const DonorDashboardHome = () => {
  const { data: session } = useSession();
  const user = session?.user;

  const [requests, setRequests] = useState([]);

useEffect(() => {
    const { data: tokenData } =  authClient.token();
  if (!user?.email) return;

  fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URI}/recent-donation-requests/${user.email}`,{
            headers: {
              authorization: `Bearer ${tokenData?.token}`
            }
          }
  )
    .then((res) => res.json())
    .then((data) => setRequests(data));
}, [user]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    const { data: tokenData } = await authClient.token();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/donation-request/status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data = await res.json();

    if (data.success) {
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id
            ? { ...req, donationStatus: newStatus }
            : req
        )
      );
    }
  } catch (error) {
    console.log(error);
  }
};

  const openDeleteModal = (id) => {
    setSelectedRequestId(id);
    setIsModalOpen(true);
  };
const handleDelete = async () => {
  const { data: tokenData } = await authClient.token();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/donation-request/${selectedRequestId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${tokenData?.token}`
        }
      }
    );

    const data = await res.json();

    if (data.deletedCount > 0) {
      setRequests((prev) =>
        prev.filter(
          (req) => req._id !== selectedRequestId
        )
      );
    }

    setIsModalOpen(false);
    setSelectedRequestId(null);
  } catch (error) {
    console.log(error);
  }
};

  const recentRequests = requests.slice(0, 3);

  return (
    <div className="space-y-8 w-full">
      
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 md:p-8 text-white shadow-lg">
<h1 className="text-2xl md:text-4xl font-bold">Welcome Back, {user?.name || 'Donor'}! 👋</h1>
        <p className="text-red-100 mt-2 text-sm md:text-base">
          Thank you for being a lifeline. Your active contributions save lives everyday.
        </p>
      </div>

      {/* 2. Recent Donation Requests (রিকোয়েস্ট না থাকলে পুরো সেকশন হাইড থাকবে) */}
      {recentRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Your Recent Donation Requests</h2>
<span className="bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
              Latest {recentRequests.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
<tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4 text-center">Blood</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Donor Info</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {recentRequests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Recipient Name */}
                    <td className="p-4 font-medium text-gray-900">{request.recipientName}</td>
                    
                    {/* Location (District & Upazila) */}
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{request.recipientDistrict}</p>
                      <p className="text-xs text-gray-500">{request.recipientUpazila}</p>
                    </td>
                    
                    {/* Date & Time */}
                    <td className="p-4">
                      <p className="font-medium">{request.donationDate}</p>
                      <p className="text-xs text-gray-500">{request.donationTime}</p>
                    </td>
                    
                    {/* Blood Group */}
                    <td className="p-4 text-center">
                      <span className="inline-block bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs">
                        {request.bloodGroup}
                      </span>
                    </td>
                    
                    {/* Status & Dynamic Done/Cancel Buttons */}
                    <td className="p-4">
<span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize mb-2
                  ${request.donationStatus === 'pending' && 'bg-amber-100 text-amber-800'}
                 ${request.donationStatus === 'inprogress' && 'bg-blue-100 text-blue-800'}
                     ${request.donationStatus === 'done' && 'bg-green-100 text-green-800'}
                   ${request.donationStatus === 'canceled' && 'bg-rose-100 text-rose-800'}
                      `}>
                        {request.donationStatus}
                      </span>

                      {/* Buttons show only when status is 'inprogress' */}
                      {request.donationStatus === 'inprogress' && (
                        <div className="flex gap-1.5 mt-1">
                          <button 
                            onClick={() => handleStatusChange(request.id, 'done')}
className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-[11px] font-medium px-2 py-1 rounded transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" /> Done
                          </button>
                          <button 
                            onClick={() => handleStatusChange(request._id, 'canceled')}
className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-medium px-2 py-1 rounded transition-colors"
                          >
                            <XCircle className="w-3 h-3" /> Cancel
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Donor Information (shows only when inprogress) */}
                    <td className="p-4">
                {request.donationStatus === 'inprogress' && request.donorName ? (
                        <div>
                <p className="font-medium text-gray-800 text-xs">{request.donor.name}</p>
                          <p className="text-[11px] text-gray-500">{request.donor.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs">N/A</span>
                      )}
                    </td>

                    {/* Action Action links matching your routing style */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <a 
                          href={`/dashboard/donation-request/view/${request._id}`}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        
                        <a 
                          href={`/dashboard/donation-request/edit/${request._id}`}
                          className="text-gray-400 hover:text-amber-600 transition-colors"
                          title="Edit Request"
                        >
                          <Edit className="w-4 h-4" />
                        </a>

                        <button 
                          onClick={() => openDeleteModal(request._id)}
                          className="text-gray-400 hover:text-rose-600 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
            <a 
              href="/dashboard/mydonationrequest" 
className="inline-block bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-lg border border-gray-300 shadow-sm transition-all"
            >
              View My All Requests
            </a>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 dynamic-modal">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Donation Request?</h3>
            <p className="text-gray-600 text-sm mb-5">
              Are you sure you want to delete this donation request? This action cannot be reverted.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
<button>
                  <Link className="text-white" href={'/'}>Back to Home</Link>
                </button>
    </div>
  );
};

export default DonorDashboardHome;