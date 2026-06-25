const CURSOR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#9575CD",
  "#7986CB",
  "#64B5F6",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#AED581",
  "#FFD54F",
  "#FFB74D",
  "#FF8A65",
] as const;

function hashUserId(userId: string) {
  let hash = 0;

  for (let index = 0; index < userId.length; index += 1) {
    hash = userId.charCodeAt(index) + ((hash << 5) - hash);
  }

  return Math.abs(hash);
}

export function getCursorColorForUser(userId: string): string {
  return CURSOR_COLORS[hashUserId(userId) % CURSOR_COLORS.length];
}
