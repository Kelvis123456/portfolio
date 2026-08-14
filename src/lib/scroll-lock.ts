let lockCount = 0;

export function lockScroll() {
  if (lockCount === 0) {
    document.body.style.overflow = "hidden";
  }
  lockCount++;
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = "";
  }
}
