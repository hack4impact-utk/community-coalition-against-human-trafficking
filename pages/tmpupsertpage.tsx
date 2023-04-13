import attributesHandler from '@api/attributes'
import UpsertItemForm from 'components/UpsertItemForm'
import { GetServerSidePropsContext } from 'next'
import { apiWrapper } from 'utils/apiWrappers'

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
      props: {
        attributes: await apiWrapper(attributesHandler, context)
      },
    }
  }

export default function tmpupsertpage({attributes}) {
    return (
        <>
           <UpsertItemForm categories={[]} attributes={attributes} /> 
        </>
    )
}