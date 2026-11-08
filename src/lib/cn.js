/** cn('a', cond && 'b', ['c']) → 'a b c' */
export function cn(...classes) {
  return classes.flat(Infinity).filter(Boolean).join(" ");
}
