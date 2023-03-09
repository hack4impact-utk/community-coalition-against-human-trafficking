import CategorySchema from 'server/models/Category'
import * as MongoDriver from 'server/actions/MongoDriver'
import { ApiError } from 'utils/types'
import mongoose from 'mongoose'
import { clientPromise } from '@api/auth/[...nextauth]'

// restore mocked implementations and close db connections
afterAll(() => {
  jest.restoreAllMocks()
  mongoose.connection.close()
  clientPromise.then((client) => client.close())
})

describe('MongoDriver', () => {
  describe('getEntity', () => {
    test('uses aggregate if defined', async () => {
      const findByIdSpy = jest.spyOn(CategorySchema, 'findById')
      const mockAggregate = (CategorySchema.aggregate = jest
        .fn()
        .mockImplementation(async () => [categoryFixture]))

      const category = await MongoDriver.getEntity(
        CategorySchema,
        mockObjectId,
        [{ $match: { _id: mockObjectId } }, { $limit: 1 }]
      )

      expect(findByIdSpy).toHaveBeenCalledTimes(0)
      expect(mockAggregate).toHaveBeenCalledTimes(1)
      expect(category).toEqual(categoryFixture)
    })

    test('aggregate only returns one object', async () => {
      const findByIdSpy = jest.spyOn(CategorySchema, 'findById')
      const mockAggregate = (CategorySchema.aggregate = jest
        .fn()
        .mockImplementation(async () => [
          categoryFixture,
          { ...categoryFixture, _id: '123' },
        ]))

      const category = await MongoDriver.getEntity(
        CategorySchema,
        mockObjectId,
        [{ $match: { _id: mockObjectId } }, { $limit: 1 }]
      )

      expect(findByIdSpy).toHaveBeenCalledTimes(0)
      expect(mockAggregate).toHaveBeenCalledTimes(1)
      expect(category).toEqual(categoryFixture)
    })
    test('valid call returns correct data', async () => {
      const mockFindById = (CategorySchema.findById = jest
        .fn()
        .mockImplementation(async () => categoryFixture))

      const category = await MongoDriver.getEntity(CategorySchema, mockObjectId)

      expect(mockFindById).toHaveBeenCalledTimes(1)
      expect(mockFindById).lastCalledWith(mockObjectId)
      expect(category).toEqual(categoryFixture)
    })

    test('entity not found returns 404', async () => {
      const mockFindById = (CategorySchema.findById = jest
        .fn()
        .mockImplementation(async () => undefined))

      try {
        await MongoDriver.getEntity(CategorySchema, mockObjectId)
      } catch (error) {
        expect(mockFindById).toHaveBeenCalledTimes(1)
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe('Entity does not exist')
        expect(error.statusCode).toBe(404)
      }
    })
  })

  describe('getEntities', () => {
    test('uses aggregate if defined', async () => {
      const findByIdSpy = jest.spyOn(CategorySchema, 'find')
      const mockAggregate = (CategorySchema.aggregate = jest
        .fn()
        .mockImplementation(async () => [categoryFixture]))

      const category = await MongoDriver.getEntities(CategorySchema, [
        { $match: { _id: mockObjectId } },
        { $limit: 1 },
      ])

      expect(findByIdSpy).toHaveBeenCalledTimes(0)
      expect(mockAggregate).toHaveBeenCalledTimes(1)
      expect(category).toEqual([categoryFixture])
    })
    test('valid call returns correct data', async () => {
      const mockFind = (CategorySchema.find = jest
        .fn()
        .mockImplementation(async () => [categoryFixture]))

      const categories = await MongoDriver.getEntities(CategorySchema)

      expect(mockFind).toHaveBeenCalledTimes(1)
      expect(categories).toEqual([categoryFixture])
    })
  })

  describe('createEntity', () => {
    test('returns category', async () => {
      const mockCreate = (CategorySchema.create = jest
        .fn()
        .mockImplementation(async () => categoryFixture))

      const category = await MongoDriver.createEntity(CategorySchema, {
        ...categoryFixture,
        _id: undefined,
      })

      expect(mockCreate).toHaveBeenCalledTimes(1)
      expect(category).toEqual(categoryFixture)
    })
  })

  describe('updateEntity', () => {
    test('valid id calls findByIdAndUpdate', async () => {
      const mockUpdate = (CategorySchema.findByIdAndUpdate = jest
        .fn()
        .mockImplementation(async () => categoryFixture))
      await MongoDriver.updateEntity(
        CategorySchema,
        mockObjectId,
        categoryFixture
      )

      expect(mockUpdate).toHaveBeenCalledTimes(1)
    })

    test('invalid id returns 404', async () => {
      const mockUpdate = (CategorySchema.findByIdAndUpdate = jest
        .fn()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {}))

      try {
        await MongoDriver.updateEntity(
          CategorySchema,
          mockObjectId,
          categoryFixture
        )
      } catch (error) {
        expect(mockUpdate).toHaveBeenCalledTimes(1)
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe('Entity does not exist')
        expect(error.statusCode).toBe(404)
      }
    })
  })

  describe('deleteEntity', () => {
    test('valid id calls findByIdAndDelete', async () => {
      const mockDelete = (CategorySchema.findByIdAndDelete = jest
        .fn()
        .mockImplementation(async () => categoryFixture))
      await MongoDriver.deleteEntity(CategorySchema, mockObjectId)

      expect(mockDelete).toHaveBeenCalledTimes(1)
    })

    test('invalid id returns 404', async () => {
      const mockDelete = (CategorySchema.findByIdAndDelete = jest
        .fn()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        .mockImplementation(async () => {}))

      try {
        await MongoDriver.deleteEntity(CategorySchema, mockObjectId)
      } catch (error) {
        expect(mockDelete).toHaveBeenCalledTimes(1)
        expect(error).toBeInstanceOf(ApiError)
        expect(error.message).toBe('Entity does not exist')
        expect(error.statusCode).toBe(404)
      }
    })
  })

  describe('findEntities', () => {
    test('valid call returns correct data', async () => {
      const mockFind = (CategorySchema.find = jest
        .fn()
        .mockImplementation(async () => [categoryFixture]))

      const categories = await MongoDriver.findEntities(CategorySchema, {
        name: 'test',
      })

      expect(mockFind).toHaveBeenCalledTimes(1)
      expect(categories).toEqual([categoryFixture])
    })
  })
})

const mockObjectId = '6408a7156668c5655c25b105'

const categoryFixture = {
  _id: mockObjectId,
  name: 'test',
}
