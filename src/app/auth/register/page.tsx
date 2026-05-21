import type { Metadata } from "next";
import { RegisterClient } from "./RegisterClient";

export const metadata: Metadata = {
  title: "Join Koloqwa",
  description: "Create an account to contribute Liberian words and phrases to the dictionary.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
