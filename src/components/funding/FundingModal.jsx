"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export default function FundingModal() {
  return (
    <Link href="/funding/donate">
      <Button color="danger">
        Give Fund
      </Button>
    </Link>
  );
}