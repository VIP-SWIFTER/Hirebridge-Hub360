// Intro sound. Browsers block sound before the visitor touches the page, so we try to play
// immediately and, if that is refused, play on the very first click / tap / key press instead.
const KEY = "hb_sound";
let audio: HTMLAudioElement | null = null;
let played = false;
let enabled = true;

try {
  enabled = localStorage.getItem(KEY) !== "off";
} catch {
  /* storage unavailable: sound stays on */
}

export const isSoundOn = () => enabled;

export function setSoundOn(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (!on && audio) audio.pause();
}

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio("/sfx/intro.mp3");
    audio.preload = "auto";
    audio.volume = 0.8;
  }
  return audio;
}

/** Returns true if the sound started right away, false if the browser needs a click first. */
export async function playIntro(): Promise<boolean> {
  if (!enabled || played) return true;
  try {
    await getAudio().play();
    played = true;
    return true;
  } catch {
    return false;
  }
}

/**
 * Waits for the first real user gesture (click / tap / any key) and then plays the intro.
 * Note: wheel / scroll / touchmove do NOT count as gestures for browser autoplay rules,
 * so they are intentionally not listened to. `onGesture` runs after the sound is requested.
 */
export function playOnFirstGesture(onGesture: () => void) {
  const events: (keyof WindowEventMap)[] = ["pointerdown", "mousedown", "touchend", "click", "keydown"];
  let done = false;
  const cleanup = () => events.forEach((e) => window.removeEventListener(e, go, true));
  function go(ev: Event) {
    if (done) return;
    if (ev.type === "keydown" && (ev as KeyboardEvent).key === "Escape") return; // Escape is not an activation key
    done = true;
    cleanup();
    void playIntro().finally(onGesture);
  }
  events.forEach((e) => window.addEventListener(e, go, true));
  return cleanup;
}
