export type LrcLine = { time: number; text: string };

const timeTag = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;

export function parseLrc(lrc: string): LrcLine[] {
  const lines = lrc.split(/\r?\n/);
  const out: LrcLine[] = [];
  for (const line of lines) {
    let match;
    const texts: { t: number; text: string }[] = [];
    while ((match = timeTag.exec(line)) !== null) {
      const m = Number(match[1]);
      const s = Number(match[2]);
      const ms = match[3] ? Number(match[3].padEnd(3, "0")) : 0;
      const t = m * 60 + s + ms / 1000;
      texts.push({ t, text: "" });
    }
    const text = line.replace(timeTag, "").trim();
    if (texts.length && text) {
      texts.forEach((item) => out.push({ time: item.t, text }));
    }
  }
  return out.sort((a, b) => a.time - b.time);
}


