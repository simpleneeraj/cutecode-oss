type PresentationContent = {
  slides?: unknown;
  elements?: unknown;
  slideElements?: unknown;
};

type PublishedContent = {
  slides: Record<string, unknown>;
  elements: Record<string, unknown>;
  slideElements: Record<string, string[]>;
};

function asRecord<T>(value: unknown): Record<string, T> {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Record<string, T>) : {};
}

function pick<T>(source: Record<string, T>, keys: string[]) {
  return Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]]));
}

export function publishedContent(content: PresentationContent, elementId: string): PublishedContent {
  const slides = asRecord<unknown>(content.slides);
  const elements = asRecord<unknown>(content.elements);
  const slideElements = asRecord<string[]>(content.slideElements);
  const slideId = Object.keys(slideElements).find((id) => Array.isArray(slideElements[id]) && slideElements[id].includes(elementId));

  if (!slideId) {
    return { slides: {}, elements: pick(elements, [elementId]), slideElements: {} };
  }

  const elementIds = slideElements[slideId].filter((id) => id in elements);
  return {
    slides: pick(slides, [slideId]),
    elements: pick(elements, elementIds),
    slideElements: { [slideId]: elementIds },
  };
}
