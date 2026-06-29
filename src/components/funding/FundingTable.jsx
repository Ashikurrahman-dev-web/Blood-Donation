"use client";

import { useEffect, useState } from "react";

export default function FundingTable() {
  const [fundings, setFundings] = useState([]);

  useEffect(() => {
    fetch("/api/fundings")
      .then((res) => res.json())
      .then((data) => setFundings(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full border">
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Amount</th>
            <th>Funding Date</th>
          </tr>
        </thead>

        <tbody>
          {fundings.map((fund) => (
            <tr key={fund._id}>
              <td>{fund.donorName}</td>

              <td>৳ {fund.amount}</td>

              <td>
                {new Date(
                  fund.createdAt
                ).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}