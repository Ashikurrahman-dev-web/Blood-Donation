"use client";

import { useEffect, useState } from "react";

import districtsData from "@/data/districts.json";
import upazilasData from "@/data/upazilas.json";

const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");

  const [filteredUpazilas, setFilteredUpazilas] =
    useState([]);

  const [donors, setDonors] = useState([]);

  const districts =
    districtsData.find(
      (item) => item.type === "table"
    )?.data || [];

  const upazilas =
    upazilasData.find(
      (item) => item.type === "table"
    )?.data || [];

  useEffect(() => {
    if (district) {
      const filtered = upazilas.filter(
        (u) => u.district_id === district
      );

      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [district]);

  const handleSearch = async () => {
    const districtName =
      districts.find((d) => d.id === district)
        ?.name || "";

    const upazilaName =
      upazilas.find((u) => u.id === upazila)
        ?.name || "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URI}/api/search-donors?bloodGroup=${bloodGroup}&district=${districtName}&upazila=${upazilaName}`
    );

    const data = await res.json();

    setDonors(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">
        Search Blood Donors
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <div className="grid md:grid-cols-4 gap-4">

          {/* Blood Group */}
          <select
            value={bloodGroup}
            onChange={(e) =>
              setBloodGroup(e.target.value)
            }
            className="border rounded-lg p-3"
          >
            <option value="">
              Select Blood Group
            </option>

            {bloodGroups.map((group) => (
              <option
                key={group}
                value={group}
              >
                {group}
              </option>
            ))}
          </select>

          {/* District */}
          <select
            value={district}
            onChange={(e) =>
              setDistrict(e.target.value)
            }
            className="border rounded-lg p-3"
          >
            <option value="">
              Select District
            </option>

            {districts.map((d) => (
              <option
                key={d.id}
                value={d.id}
              >
                {d.name}
              </option>
            ))}
          </select>

          {/* Upazila */}
          <select
            value={upazila}
            onChange={(e) =>
              setUpazila(e.target.value)
            }
            disabled={!district}
            className="border rounded-lg p-3"
          >
            <option value="">
              Select Upazila
            </option>

            {filteredUpazilas.map((u) => (
              <option
                key={u.id}
                value={u.id}
              >
                {u.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Donors */}
      <div className="grid md:grid-cols-3 gap-6">
        {donors.map((donor) => (
          <div
            key={donor._id}
            className="bg-white rounded-xl shadow p-6"
          >
            <img
              src={donor.image}
              alt={donor.name}
              className="w-20 h-20 rounded-full mx-auto object-cover"
            />

            <h2 className="text-center text-xl font-bold mt-4">
              {donor.name}
            </h2>

            <p className="text-center text-red-500 font-semibold">
              {donor.bloodGroup}
            </p>

            <p className="text-center">
              {donor.district}
            </p>

            <p className="text-center">
              {donor.upazila}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}