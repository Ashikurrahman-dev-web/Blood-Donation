"use client";

import FundingTable from "@/components/funding/FundingTable";
import FundingModal from "@/components/funding/FundingModal";

export default function FundingPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Funding
        </h1>

        <FundingModal />
      </div>

      <FundingTable />
    </div>
  );
}