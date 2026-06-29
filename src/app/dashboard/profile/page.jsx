"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { data: session } = useSession();

  const userEmail = session?.user?.email;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    image: "https://i.ibb.co/4pDNDk1/avatar.png",
    district: "",
    upazila: "",
    bloodGroup: "",
  });

  useEffect(() => {
    if (!userEmail) return;

    fetch(`http://localhost:5000/api/user/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          district: data.district || "",
          upazila: data.upazila || "",
          bloodGroup: data.bloodGroup || "",
        });

        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [userEmail]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };
const handleSave = async () => {
  if (!userEmail) {
    toast.error("User email not found");
    return;
  }
  try {
    const res = await fetch(
      `http://localhost:5000/api/user/${encodeURIComponent(
        userEmail
      )}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success("Profile Updated Successfully");
      setIsEditing(false);
    }
  } catch (error) {
    console.log(error);
    toast.error("Update Failed");
  }
};
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">
          My Profile
        </h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-5 py-2 rounded-lg"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-5 py-2 rounded-lg"
          >
            Save
          </button>
        )}
      </div>

      <div className="flex justify-center mb-8">
        <img
  src={
    profile.image ||
    "https://i.ibb.co/4pDNDk1/avatar.png"
  }
  alt="Profile"
  className="w-28 h-28 rounded-full border object-cover"
/>
      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <label className="block mb-1 font-medium">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Email
          </label>

          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border rounded-lg p-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Avatar URL
          </label>

          <input
            type="text"
            name="image"
            value={profile.image}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Blood Group
          </label>

          <select
            name="bloodGroup"
            value={profile.bloodGroup}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">
            District
          </label>

          <input
            type="text"
            name="district"
            value={profile.district}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Upazila
          </label>

          <input
            type="text"
            name="upazila"
            value={profile.upazila}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border rounded-lg p-3"
          />
        </div>

      </div>
    </div>
  );
}