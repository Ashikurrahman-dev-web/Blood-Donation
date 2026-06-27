"use client";

import { useEffect, useState } from "react";

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    const res = await fetch(
      `http://localhost:5000/api/users?status=${statusFilter}`
    );

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    await fetch(
      `http://localhost:5000/api/users/status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchUsers();
  };

  const updateRole = async (id, role) => {
    await fetch(
      `http://localhost:5000/api/users/role/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      }
    );

    fetchUsers();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white font-bold">
          All Users
        </h1>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="border px-4 py-2 rounded-lg text-white"
        >
          <option value="all">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Avatar</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b"
              >
                <td className="p-4">
                  <img
                    src={
                      user.image ||
                      "https://i.ibb.co/4pDNDk1/avatar.png"
                    }
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                </td>

                <td className="p-4">
                  {user.name}
                </td>

                <td className="p-4">
                  {user.email}
                </td>

                <td className="p-4 capitalize">
                  {user.role}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2 justify-center">

                    {user.status === "active" ? (
                      <button
                        onClick={() =>
                          updateStatus(
                            user._id,
                            "blocked"
                          )
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updateStatus(
                            user._id,
                            "active"
                          )
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Unblock
                      </button>
                    )}

                    {user.role !== "volunteer" &&
                      user.role !== "admin" && (
                        <button
                          onClick={() =>
                            updateRole(
                              user._id,
                              "volunteer"
                            )
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Make Volunteer
                        </button>
                      )}

                    {user.role !== "admin" && (
                      <button
                        onClick={() =>
                          updateRole(
                            user._id,
                            "admin"
                          )
                        }
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                      >
                        Make Admin
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}