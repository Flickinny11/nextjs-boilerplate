"use client";

import { Suspense } from "react";

function AccountContent() {
  return (
    <div className="container mx-auto px-4 py-8 mt-8">
      <h1 className="text-3xl font-bold text-white">Account Management</h1>
      <p className="text-gray-400">Account management features will be implemented here.</p>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}