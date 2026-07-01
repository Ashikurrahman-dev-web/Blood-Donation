"use client";

import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

import { MoreVertical } from "lucide-react";
import { authClient } from "@/lib/auth-client";
export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    const { data: tokenData } = await authClient.token();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/users?status=${statusFilter}`,
      {
        headers: {
          authorization: `Bearer ${tokenData?.token}`
        }
      }
    );

    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const updateStatus = async (id, status) => {
    const { data: tokenData } = await authClient.token();
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/users/status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
        },
        body: JSON.stringify({ status }),
      }
    );

    fetchUsers();
  };

  const updateRole = async (id, role) => {
    const { data: tokenData } = await authClient.token();
    await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/users/role/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData?.token}`
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
    <th className="p-4 text-left">
      Avatar
    </th>
    <th className="p-4 text-left">
      Name
    </th>
    <th className="p-4 text-left">
      Email
    </th>
    <th className="p-4 text-left">
      Role
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
  {users.map((user) => (
    <tr
      key={user._id}
      className="border-b hover:bg-gray-50"
    >
      {/* Avatar */}
      <td className="p-4">
        <img
          src={
            user.image ||
            "https://i.ibb.co/4pDNDk1/avatar.png"
          }
          alt={user.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      </td>

      {/* Name */}
      <td className="p-4 font-medium">
        {user.name}
      </td>

      {/* Email */}
      <td className="p-4">
        {user.email}
      </td>

      {/* Role */}
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : user.role === "volunteer"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {user.role}
        </span>
      </td>

      {/* Status */}
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            user.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 text-center">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              variant="light"
            >
              <MoreVertical size={18} />
            </Button>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="User Actions"
          >
            {user.status === "active" ? (
              <DropdownItem
                key="block"
                color="danger"
                onPress={() =>
                  updateStatus(
                    user._id,
                    "blocked"
                  )
                }
              >
                Block User
              </DropdownItem>
            ) : (
              <DropdownItem
                key="unblock"
                color="success"
                onPress={() =>
                  updateStatus(
                    user._id,
                    "active"
                  )
                }
              >
                Unblock User
              </DropdownItem>
            )}

            {user.role !==
              "volunteer" &&
              user.role !== "admin" && (
                <DropdownItem
                  key="volunteer"
                  color="primary"
                  onPress={() =>
                    updateRole(
                      user._id,
                      "volunteer"
                    )
                  }
                >
                  Make Volunteer
                </DropdownItem>
              )}

            {user.role !==
              "admin" && (
              <DropdownItem
                key="admin"
                color="secondary"
                onPress={() =>
                  updateRole(
                    user._id,
                    "admin"
                  )
                }
              >
                Make Admin
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </td>
    </tr>
  ))}
</tbody>
        </table>
      </div>
    </div>
  );
}