import { type Translator } from "./load-headlines";

export interface WorkersAiBinding {
  run(model: string, input: Readonly<Record<string, string>>): Promise<unknown>;
}

export function createWorkersAiTranslator(ai: WorkersAiBinding): Translator {
  return {
    async translate(text, sourceLanguage) {
      const response = await ai.run("@cf/meta/m2m100-1.2b", {
        text,
        source_lang: sourceLanguage,
        target_lang: "en",
      });

      if (!hasTranslatedText(response)) throw new Error("Translation model did not return translated text");
      return response.translated_text.trim();
    },
  };
}

function hasTranslatedText(value: unknown): value is { translated_text: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "translated_text" in value &&
    typeof value.translated_text === "string" &&
    value.translated_text.trim().length > 0
  );
}
