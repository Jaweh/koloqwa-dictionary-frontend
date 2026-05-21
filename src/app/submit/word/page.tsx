import type { Metadata } from "next";
import { SubmitWordClient } from "./SubmitWordClient";

export const metadata: Metadata = {
  title: "Submit a Word",
  description: "Contribute a Liberian word or expression to the Koloqwa Dictionary.",
};

export default function SubmitWordPage() {
  return <SubmitWordClient />;
}
