type Box = { x: number; y: number; width: number; height: number };

type Painter = {
  context: CanvasRenderingContext2D;
  toBox: (rect: DOMRect) => Box;
  ascents: Map<string, number>;
  row: { top: number; count: number };
};

const EMPTY_CONTENT = ["none", "normal"];
const TRANSPARENT = "rgba(0, 0, 0, 0)";
const WHITESPACE = /\s/;
const NEWLINE = "\n";

const hasContent = (style: CSSStyleDeclaration) => !EMPTY_CONTENT.includes(style.content);
const hasText = (element: Element) => Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE);

function isPaintable(element: Element) {
  const style = getComputedStyle(element);
  const isPlain =
    style.textShadow === "none" &&
    style.textDecorationLine === "none" &&
    style.filter === "none" &&
    style.mixBlendMode === "normal" &&
    style.backgroundImage === "none" &&
    style.borderRadius === "0px";
  const hasOpaqueText = style.opacity === "1" || !hasText(element);
  const hasPlainBefore = !hasContent(getComputedStyle(element, "::before")) || element.classList.contains("line");
  return isPlain && hasOpaqueText && hasPlainBefore && !hasContent(getComputedStyle(element, "::after"));
}

export function canPaintCode(block: HTMLElement) {
  return [block, ...Array.from(block.querySelectorAll("*"))].every(isPaintable);
}

function fontOf(style: CSSStyleDeclaration) {
  return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
}

function ascentOf(painter: Painter, font: string) {
  const cached = painter.ascents.get(font);
  if (cached !== undefined) return cached;
  painter.context.font = font;
  const ascent = Math.round(painter.context.measureText("M").fontBoundingBoxAscent);
  painter.ascents.set(font, ascent);
  return ascent;
}

function paintBox(painter: Painter, element: Element) {
  const style = getComputedStyle(element);
  if (style.backgroundColor === TRANSPARENT) return;
  const { x, y, width, height } = painter.toBox(element.getBoundingClientRect());
  painter.context.globalAlpha = Number(style.opacity);
  painter.context.fillStyle = style.backgroundColor;
  painter.context.fillRect(x, y, width, height);
  painter.context.globalAlpha = 1;
}

function snappedX(painter: Painter, box: Box, letterSpacing: number) {
  if (box.y !== painter.row.top) painter.row = { top: box.y, count: 0 };
  const x = box.x - letterSpacing * painter.row.count;
  painter.row.count += 1;
  return x;
}

function paintText(painter: Painter, node: Text, range: Range) {
  const style = node.parentElement && getComputedStyle(node.parentElement);
  if (!style) return;
  const font = fontOf(style);
  const ascent = ascentOf(painter, font);
  const letterSpacing = parseFloat(style.letterSpacing) || 0;
  painter.context.font = font;
  painter.context.fillStyle = style.color;
  let offset = 0;
  for (const character of node.data) {
    const end = offset + character.length;
    if (character !== NEWLINE) {
      range.setStart(node, offset);
      range.setEnd(node, end);
      const box = painter.toBox(range.getBoundingClientRect());
      const x = snappedX(painter, box, letterSpacing);
      if (!WHITESPACE.test(character)) painter.context.fillText(character, x, box.y + ascent);
    }
    offset = end;
  }
}

function lineBaseline(painter: Painter, line: HTMLElement, style: CSSStyleDeclaration, ascent: number) {
  const range = document.createRange();
  const firstText = Array.from(line.querySelectorAll("span")).find((span) => span.textContent);
  if (firstText?.firstChild) {
    range.setStart(firstText.firstChild, 0);
    range.setEnd(firstText.firstChild, 1);
    return painter.toBox(range.getBoundingClientRect()).y + ascent;
  }
  const descent = Math.round(painter.context.measureText("M").fontBoundingBoxDescent);
  const lineTop = painter.toBox(line.getBoundingClientRect()).y;
  return lineTop + (parseFloat(style.lineHeight) - ascent - descent) / 2 + ascent;
}

function paintLineNumber(painter: Painter, line: HTMLElement) {
  const before = getComputedStyle(line, "::before");
  const label = line.dataset.line;
  if (!label || before.opacity === "0") return;
  const font = fontOf(before);
  const ascent = ascentOf(painter, font);
  const letterSpacing = parseFloat(before.letterSpacing) || 0;
  painter.context.font = font;
  const advances = Array.from(label, (digit) => painter.context.measureText(digit).width + letterSpacing);
  const textWidth = advances.reduce((sum, advance) => sum + advance, 0);
  const lineBox = painter.toBox(line.getBoundingClientRect());
  const boxLeft = lineBox.x + parseFloat(getComputedStyle(line).paddingLeft) + parseFloat(before.marginLeft);
  const boxWidth = parseFloat(before.width);
  let x = boxLeft + (parseFloat(before.left) || 0) + Math.max(0, boxWidth - textWidth);
  const baseline = lineBaseline(painter, line, before, ascent);
  painter.context.font = font;
  painter.context.fillStyle = before.color;
  painter.context.globalAlpha = Number(before.opacity);
  Array.from(label).forEach((digit, index) => {
    painter.context.fillText(digit, x, baseline);
    x += advances[index];
  });
  painter.context.globalAlpha = 1;
}

function createPainter(block: HTMLElement, canvas: HTMLCanvasElement, pixelRatio: number): Painter {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is unavailable");
  const blockRect = block.getBoundingClientRect();
  const scale = block.offsetWidth / blockRect.width;
  canvas.width = block.offsetWidth * pixelRatio;
  canvas.height = block.offsetHeight * pixelRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.textBaseline = "alphabetic";
  context.textAlign = "left";
  const toBox = (rect: DOMRect) => ({
    x: (rect.left - blockRect.left) * scale,
    y: (rect.top - blockRect.top) * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  });
  return { context, toBox, ascents: new Map(), row: { top: NaN, count: 0 } };
}

export function paintCode(block: HTMLElement, canvas: HTMLCanvasElement, pixelRatio: number) {
  const painter = createPainter(block, canvas, pixelRatio);
  const elements = Array.from(block.querySelectorAll<HTMLElement>("*"));
  elements.forEach((element) => paintBox(painter, element));
  elements.filter((element) => element.classList.contains("line")).forEach((line) => paintLineNumber(painter, line));
  const range = document.createRange();
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof Text) paintText(painter, node, range);
  }
}
