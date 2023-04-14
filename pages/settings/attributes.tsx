import AttributeList from 'components/AttributeList'
import { AttributeResponse } from 'utils/types'

const attributes: AttributeResponse[] = [
  { _id: '1', name: 'attribute', possibleValues: 'number', color: '#666666' },
  { _id: '2', name: 'attribute2', possibleValues: 'text', color: '#123456' },
  {
    _id: '3',
    name: 'attribute3',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '4',
    name: 'b',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '5',
    name: 'c',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '6',
    name: 'd',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '7',
    name: 'e',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
  {
    _id: '8',
    name: 'f',
    possibleValues: ['small', 'medium', 'large'],
    color: '#000000',
  },
]

export default function AttributesPage() {
  return <AttributeList attributes={attributes} search={''} />
}
