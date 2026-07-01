"use client";

import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import {
  Users,
  Droplets,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function VolunteerDashboardHome() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({
    totalUsers:0,
    totalRequests: 0,
    totalFunding: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: tokenData } =  authClient.token();
    fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/admin-stats`,{
            headers: {
              authorization: `Bearer ${tokenData?.token}`
            }
          })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome Back, {user?.name || "Admin"} 👋
        </h1>

        <p className="mt-2 text-red-100">
          Manage users, blood donation requests and platform activities.
        </p>
      </div>

      {/* Stats Section */}
      {loading ? (
        <div className="text-center py-10">
          Loading statistics...
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between">
              <Users className="w-10 h-10 text-blue-600" />
              <span className="text-3xl font-bold">
                {stats.totalUsers}
              </span>
            </div>

            <h3 className="mt-4 text-gray-600 font-medium">
              Total Donors
            </h3>
          </div>

          {/* Total Funding */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between">
              <DollarSign className="w-10 h-10 text-green-600" />
              <span className="text-3xl font-bold">
                ৳ {stats.totalFunding}
              </span>
            </div>

            <h3 className="mt-4 text-gray-600 font-medium">
              Total Funding
            </h3>
          </div>

          {/* Total Requests */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex items-center justify-between">
              <Droplets className="w-10 h-10 text-red-600" />
              <span className="text-3xl font-bold">
                {stats.totalRequests}
              </span>
            </div>

            <h3 className="mt-4 text-gray-200 font-medium">
              Blood Donation Requests
            </h3>
          </div>
          <button>
            <Link className="text-white" href={'/'}>Back to Home</Link>
          </button>
        </div>
      )}
    </div>
  );
}