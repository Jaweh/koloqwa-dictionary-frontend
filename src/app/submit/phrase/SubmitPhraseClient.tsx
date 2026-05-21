"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { submitPhrase } from "@/lib/auth-api";
import { getLanguages } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormField, Input, Textarea, Button } from "@/components/ui/FormField";
import { TribeMask } from "@/components/ui/TribeMask";
import { TRIBES } from "@/lib/tribes";

interface Language { id: string; code: string; name: string; }
interface FormErrors {
  phraseText?: string;
  meaning?: string;
  tribe?: string;
  general?: string;
}

export function SubmitPhraseClient() {
  const { accessToken } = useAuth();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [category, setCategory] = useState<"Vernacular" | "Tribal">("Vernacular");
  const [selectedTribeCode, setSelectedTribeCode] = useState("");
  const [phraseText, setPhraseText] = useState("");
  const [literalMeaning, setLiteralMeaning] = useState("");
  const [meaning, setMeaning] = useState("");
  const [contextNote, setContextNote] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getLanguages().then(setLanguages).catch(() => {});
  }, []);

  const availableTribes = TRIBES.filter(t =>
    languages.some(l => l.code === t.code)
  );

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!phraseText.trim()) errs.phraseText = "Phrase is required.";
    else if (phraseText.trim().length < 2) errs.phraseText = "Phrase must be at least 2 characters.";
    if (!meaning.trim()) errs.meaning = "Meaning is required.";
    else if (meaning.trim().length < 5) errs.meaning = "Meaning must be at least 5 characters.";
    if (category === "Tribal" && !selectedTribeCode) errs.tribe = "Please select a tribe.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const matchedLanguage = languages.find(l => l.code === selectedTribeCode);

    const payload = {
      category,
      languageId: category === "Tribal" && matchedLanguage ? matchedLanguage.id : null,
      phraseText: phraseText.trim(),
      literalMeaning: literalMeaning.trim() || null,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      meanings: [{
        meaning: meaning.trim(),
        contextNote: contextNote.trim() || null,
      }],
    };

    try {
      await submitPhrase(payload, accessToken!);
      setSuccess(true);
    } catch (err) {
      setErrors({ general: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSuccess(false);
    setPhraseText(""); setLiteralMeaning(""); setMeaning(""); setContextNote(""); setTags("");
    setCategory("Vernacular"); setSelectedTribeCode("");
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Phrase submitted!
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
          <strong>&ldquo;{phraseText}&rdquo;</strong> has been submitted for review.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}>
            Submit another phrase
          </button>
          <Link href="/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-medium"
            style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            View my submissions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <Link href="/dashboard" style={{ color: "var(--text-muted)" }} className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span style={{ color: "var(--text-primary)" }}>Submit a phrase</span>
          </nav>
          <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Submit a phrase
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Contribute a phrase to the dictionary. All submissions are reviewed before publishing.
          </p>
        </div>

        <div className="p-8 rounded-2xl border" style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}>
          {errors.general && (
            <div className="mb-6 p-4 rounded-xl text-sm"
              style={{ background: "color-mix(in srgb, #BF0A30 10%, transparent)", color: "#BF0A30", border: "1px solid color-mix(in srgb, #BF0A30 25%, transparent)" }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Category toggle */}
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                Category <span style={{ color: "#BF0A30" }}>*</span>
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["Vernacular", "Tribal"] as const).map(cat => (
                  <button key={cat} type="button"
                    onClick={() => { setCategory(cat); setSelectedTribeCode(""); }}
                    className="p-4 rounded-xl border text-left transition-all"
                    style={{
                      borderColor: category === cat ? "var(--accent)" : "var(--border)",
                      background: category === cat ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--bg-primary)",
                      borderWidth: category === cat ? "2px" : "1px",
                    }}>
                    <p className="text-sm font-medium" style={{ color: category === cat ? "var(--accent)" : "var(--text-primary)" }}>
                      {cat === "Vernacular" ? "🗣️ Vernacular" : "🌍 Tribal"}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {cat === "Vernacular" ? "Liberian street / colloquial expression" : "Indigenous ethnic language phrase"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tribe selector */}
            {category === "Tribal" && (
              <FormField label="Select tribe / language" error={errors.tribe} required>
                {availableTribes.length === 0 ? (
                  <div className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                    Loading languages...
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                    {availableTribes.map(tribe => (
                      <button key={tribe.code} type="button"
                        onClick={() => setSelectedTribeCode(tribe.code)}
                        className="p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1"
                        style={{
                          borderColor: selectedTribeCode === tribe.code ? "var(--accent)" : "var(--border)",
                          background: selectedTribeCode === tribe.code ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "var(--bg-primary)",
                          borderWidth: selectedTribeCode === tribe.code ? "2px" : "1px",
                        }}>
                        <TribeMask code={tribe.code} size={36} />
                        <div className="text-xs font-medium leading-tight"
                          style={{ color: selectedTribeCode === tribe.code ? "var(--accent)" : "var(--text-primary)" }}>
                          {tribe.name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </FormField>
            )}

            {/* Phrase */}
            <FormField label="Phrase or expression" error={errors.phraseText} required>
              <Input
                type="text"
                placeholder={category === "Vernacular" ? 'e.g. "Ha lay bahlay?", "You belleh moohn"' : "Enter the phrase in the tribal language"}
                value={phraseText}
                onChange={e => setPhraseText(e.target.value)}
                error={!!errors.phraseText}
                autoFocus
              />
            </FormField>

            {/* Literal meaning */}
            <FormField label="Literal meaning"
              hint="Optional — what the words literally mean word-for-word">
              <Input
                type="text"
                placeholder='e.g. "How is the body?" (literal translation)'
                value={literalMeaning}
                onChange={e => setLiteralMeaning(e.target.value)}
              />
            </FormField>

            {/* Actual meaning */}
            <FormField label="Actual meaning" error={errors.meaning} required>
              <Textarea
                rows={3}
                placeholder="What does this phrase actually mean or imply in context?"
                value={meaning}
                onChange={e => setMeaning(e.target.value)}
                error={!!errors.meaning}
              />
            </FormField>

            {/* Context note */}
            <FormField label="Context or usage notes"
              hint="Optional — when and how this phrase is used">
              <Textarea
                rows={2}
                placeholder='e.g. "Used as a greeting, equivalent to How are you?"'
                value={contextNote}
                onChange={e => setContextNote(e.target.value)}
              />
            </FormField>

            {/* Tags */}
            <FormField label="Tags" hint="Optional — comma-separated, e.g. greeting, informal, Monrovia">
              <Input
                type="text"
                placeholder="greeting, informal, everyday"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </FormField>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} fullWidth>
                {loading ? "Submitting..." : "Submit for review"}
              </Button>
              <Link href="/dashboard"
                className="h-11 px-6 rounded-xl text-sm font-medium flex items-center justify-center"
                style={{ background: "var(--bg-primary)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}