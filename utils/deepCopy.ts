export default function deepCopy<T>(objArr: T[]): T[] {
  return JSON.parse(JSON.stringify(objArr))
}
