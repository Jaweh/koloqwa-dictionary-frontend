"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { submitWord } from "@/lib/auth-api";
import { getLanguages } from "@/lib/api";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { FormField, Input, Textarea, Button } from "@/components/ui/FormField";
import { TribeMask } from "@/components/ui/TribeMask";
import { TRIBES } from "@/lib/tribes";

const PARTS_OF_SPEECH = [
  "Noun", "Verb", "Adjective", "Adverb", "Pronoun",
  "Preposition", "Conjunction", "Interjection", "Other"
];

interface Language { id: string; code: string; name: string; }
interface FormErrors {
  headword?: string;
  definition?: string;
  partOfSpeech?: string;
  tribe?: string;
  general?: string;
}

export function SubmitWordClient() {
  const { accessToken } = useAuth();

  const [languages, setLanguages] = useState<Language[]>([]);
  const [category, setCategory] = useState<"Vernacular" | "Tribal">("Vernacular");
  const [selectedTribeCode, setSelectedTribeCode] = useState("");
  const [headword, setHeadword] = useState("");
  const [selectedPos, setSelectedPos] = useState<string[]>(["Noun"]);
  const [pronunciation, setPronunciation] = useState("");
  const [definition, setDefinition] = useState("");
  const [usageNote, setUsageNote] = useState("");
  const [exampleSentence, setExampleSentence] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getLanguages().then(setLanguages).catch(() => {});
  }, []);

  // Only show tribes that have a matching language in the DB
  const availableTribes = TRIBES.filter(t =>
    languages.some(l => l.code === t.code)
  );

  function togglePos(pos: string) {
    setSelectedPos(prev =>
      prev.includes(pos)
        ? prev.length === 1 ? prev : prev.filter(p => p !== pos)
        : [...prev, pos]
    );
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!headword.trim()) errs.headword = "Word is required.";
    if (selectedPos.length === 0) errs.partOfSpeech = "Select at least one part of speech.";
    if (!definition.trim()) errs.definition = "Meaning is required.";
    else if (definition.trim().length < 5) errs.definition = "Meaning must be at least 5 characters.";
    if (category === "Tribal" && !selectedTribeCode) errs.tribe = "Please select a tribe.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const primaryPos = PARTS_OF_SPEECH.indexOf(selectedPos[0]);
    const extraPosTags = selectedPos.slice(1).map(p => p.toLowerCase());
    const userTags = tags.split(",").map(t => t.trim()).filter(Boolean);

    // Resolve tribe code → GUID
    const matchedLanguage = languages.find(l => l.code === selectedTribeCode);

    const payload = {
      category,
      languageId: category === "Tribal" && matchedLanguage ? matchedLanguage.id : null,
      headword: headword.trim(),
      partOfSpeech: primaryPos,
      pronunciation: pronunciation.trim() || null,
      tags: [...userTags, ...extraPosTags],
      definitions: [{
        definition: definition.trim(),
        usageNote: usageNote.trim() || null,
        register: null,
        examples: exampleSentence.trim() ? [{
          sentence: exampleSentence.trim(),
          translation: exampleTranslation.trim() || null,
        }] : [],
      }],
    };

    try {
      await submitWord(payload, accessToken!);
      setSuccess(true);
    } catch (err) {
      setErrors({ general: (err as Error).message });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setSuccess(false);
    setHeadword(""); setDefinition(""); setExampleSentence("");
    setPronunciation(""); setUsageNote(""); setTags("");
    setSelectedPos(["Noun"]); setCategory("Vernacular"); setSelectedTribeCode("");
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="font-display text-3xl font-semibold mb-3" style={{ color: "var(--text-primary)" }}>
          Word submitted!
        </h2>
        <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
          <strong>&ldquo;{headword}&rdquo;</strong> has been submitted for review.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={reset}
            className="px-6 py-3 rounded-xl text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}>
            Submit another word
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
            <span style={{ color: "var(--text-primary)" }}>Submit a word</span>
          </nav>
          <h1 className="font-display text-4xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Submit a word
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Contribute a word to the dictionary. All submissions are reviewed before publishing.
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
                      {cat === "Vernacular" ? "Liberian street / colloquial language" : "Indigenous ethnic language"}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tribe selector with masks */}
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

            {/* Word */}
            <FormField label="Word or expression" error={errors.headword} required>
              <Input
                type="text"
                placeholder={category === "Vernacular" ? 'e.g. "soft life", "how the body"' : "Enter the word in the tribal language"}
                value={headword}
                onChange={e => setHeadword(e.target.value)}
                error={!!errors.headword}
                autoFocus
              />
            </FormField>

            {/* Parts of speech multi-select */}
            <div>
              <p className="text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                Part of speech <span style={{ color: "#BF0A30" }}>*</span>
                <span className="ml-2 font-normal text-xs" style={{ color: "var(--text-muted)" }}>
                  Select all that apply
                </span>
              </p>
              {errors.partOfSpeech && (
                <p className="text-xs mb-2" style={{ color: "#BF0A30" }}>{errors.partOfSpeech}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {PARTS_OF_SPEECH.map(pos => {
                  const active = selectedPos.includes(pos);
                  return (
                    <button key={pos} type="button" onClick={() => togglePos(pos)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                      style={{
                        background: active ? "var(--accent)" : "var(--bg-primary)",
                        color: active ? "white" : "var(--text-secondary)",
                        borderColor: active ? "var(--accent)" : "var(--border)",
                      }}>
                      {pos}
                    </button>
                  );
                })}
              </div>
              {selectedPos.length > 1 && (
                <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                  Primary: <strong>{selectedPos[0]}</strong> — others added as tags
                </p>
              )}
            </div>

            {/* Pronunciation */}
            <FormField label="Pronunciation" hint="Optional — how it sounds, e.g. /soːft laɪf/">
              <Input
                type="text"
                placeholder="Phonetic pronunciation (optional)"
                value={pronunciation}
                onChange={e => setPronunciation(e.target.value)}
              />
            </FormField>

            {/* Definition */}
            <FormField label="Meaning / Definition" error={errors.definition} required>
              <Textarea
                rows={3}
                placeholder="What does this word mean? Be clear and specific."
                value={definition}
                onChange={e => setDefinition(e.target.value)}
                error={!!errors.definition}
              />
            </FormField>

            {/* Usage note */}
            <FormField label="Usage notes" hint="Optional — context, register, or cultural notes">
              <Textarea
                rows={2}
                placeholder='e.g. "Used informally among young people in Monrovia"'
                value={usageNote}
                onChange={e => setUsageNote(e.target.value)}
              />
            </FormField>

            {/* Example */}
            <div className="space-y-4 p-5 rounded-xl"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                Example usage{" "}
                <span className="font-normal" style={{ color: "var(--text-muted)" }}>(optional but recommended)</span>
              </p>
              <FormField label="Example sentence">
                <Input
                  type="text"
                  placeholder='e.g. "He living soft life small-small"'
                  value={exampleSentence}
                  onChange={e => setExampleSentence(e.target.value)}
                />
              </FormField>
              <FormField label="English translation">
                <Input
                  type="text"
                  placeholder="What does the example sentence mean in standard English?"
                  value={exampleTranslation}
                  onChange={e => setExampleTranslation(e.target.value)}
                />
              </FormField>
            </div>

            {/* Tags */}
            <FormField label="Tags" hint="Optional — comma-separated, e.g. slang, youth, Monrovia">
              <Input
                type="text"
                placeholder="slang, youth, street"
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