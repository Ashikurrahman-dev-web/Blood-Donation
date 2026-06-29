import { NextResponse } from "next/server";

import Funding from "@/models/Funding";

export async function GET() {
  await dbConnect();

  const stats =
    await Funding.aggregate([
      {
        $group: {
          _id: null,
          totalFunding: {
            $sum: "$amount",
          },

          totalDonations: {
            $sum: 1,
          },
        },
      },
    ]);

  return NextResponse.json(
    stats[0] || {
      totalFunding: 0,
      totalDonations: 0,
    }
  );
}