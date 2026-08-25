let stack: symbol[] = [];

export function pushModal(): symbol {
  const id = Symbol("modal");
  stack.push(id);
  return id;
}

export function popModal(id: symbol) {
  stack = stack.filter((entry) => entry !== id);
}

export function isTopModal(id: symbol): boolean {
  return stack.length > 0 && stack[stack.length - 1] === id;
}
