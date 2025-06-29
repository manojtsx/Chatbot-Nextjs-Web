'use client'
import LoginPage from "@/components/LoginPage";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(()=> {
    router.push('/login')
  },[])
  return <LoginPage />;
}