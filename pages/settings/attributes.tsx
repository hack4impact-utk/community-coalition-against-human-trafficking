import attributesHandler from '@api/attributes'
import AttributeList from 'components/AttributeList'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'
import { AttributeResponse } from 'utils/types'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: { attributes: await apiWrapper(attributesHandler, context) },
  }
}

interface AttributesPageProps {
  attributes: AttributeResponse[]
}

export default function AttributesPage({ attributes }: AttributesPageProps) {
  return <AttributeList attributes={attributes} search={''} />
}
