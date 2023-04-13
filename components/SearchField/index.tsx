import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput } from '@mui/material'
import React from 'react'
import {
  addURLQueryParam,
  removeURLQueryParam,
  useRouterQuery,
} from 'utils/queryParams'
import { debounce } from 'ts-debounce'
import { NextRouter } from 'next/router'

const updateSearchQuery = (search: string, router: NextRouter) => {
  if (!search) removeURLQueryParam(router, 'search')
  else addURLQueryParam(router, 'search', search)
}

const debouncedUpdateSearchQuery = debounce(updateSearchQuery, 300)

export default function SearchField() {
  const { router } = useRouterQuery()
  const [search, setSearch] = React.useState<string>(
    (router.query.search as string) || ''
  )

  const onChange = (search: string) => {
    setSearch(search)
    debouncedUpdateSearchQuery(search, router)
  }
  return (
    <OutlinedInput
      placeholder="Search"
      fullWidth
      endAdornment={
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      }
      onChange={(e) => onChange(e.target.value)}
      value={search}
    ></OutlinedInput>
  )
}
