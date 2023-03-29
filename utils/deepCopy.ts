export default function deepCopy<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}
