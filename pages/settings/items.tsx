import { Typography } from "@mui/material";
import ItemDefinitionList from "components/ItemDefinitionList"
import itemDefinitionsHandler from "@api/itemDefinitions"
import { ItemDefinitionResponse } from "utils/types"
import { apiWrapper } from "utils/apiWrappers"
import { GetServerSidePropsContext } from 'next'

interface Props {
  itemDefinitions: ItemDefinitionResponse[]
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      itemDefinitions: await apiWrapper(itemDefinitionsHandler, context)
    },
  }
}

export default function ItemsPage({ itemDefinitions }: Props) {
  return (
    <>
      <Typography variant='h4'>Items</Typography>
      <ItemDefinitionList itemDefinitions={itemDefinitions} search="" />
    </>
  )
}
