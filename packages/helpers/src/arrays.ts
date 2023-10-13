export function remove<T>(items: T[], item: T): T[] {
  const index = items.indexOf(item);

  return index == -1
    ? items
    : items.slice(0, index).concat(items.slice(index + 1));
}
