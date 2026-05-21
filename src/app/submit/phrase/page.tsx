import type { Metadata } from "next";
import { SubmitPhraseClient } from "./SubmitPhraseClient";

export const metadata: Metadata = {
  title: "Submit a Phrase",
  description: "Contribute a Liberian expression or phrase to the Koloqwa Dictionary.",
};

export default function SubmitPhrasePage() {
  return <SubmitPhraseClient />;
}
