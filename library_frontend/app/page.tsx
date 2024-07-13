"use client"; 

import Image from "next/image";
import Dashboard from "./Dashboard";
import { AppProvider } from "./Context"

export default function Home() {
  return (
    <AppProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24  bg-gray-100">
        <Dashboard/>
      </main>
    </AppProvider>
  );
}
