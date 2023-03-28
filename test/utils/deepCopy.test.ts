import deepCopy from 'utils/deepCopy'

describe('deepCopy', () => {
  test('creates valid copy of an object', () => {
    const original = {
      name: 'test',
      id: 3,
      optional: 'optional',
    }

    const copy = deepCopy(original)

    expect(copy).toEqual(original)
    expect(copy).not.toBe(original)
  })

  test('creates valid copy of an array of objects', () => {
    const original = [
      {
        name: 'test',
        id: 3,
        optional: 'optional',
      },
      {
        name: 'test2',
        id: 4,
        optional: 'optional2',
      },
    ]

    const copy = deepCopy(original)

    expect(copy).toEqual(original)
    expect(copy).not.toBe(original)
  })
})
