import { Close, Search } from '@mui/icons-material'
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material'
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

const debouncedUpdateSearchQuery = debounce(updateSearchQuery, 600)

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
        <>
          {search && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                sx={{ p: 0 }}
                onClick={() => onChange('')}
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          )}
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        </>
      }
      onChange={(e) => onChange(e.target.value)}
      value={search}
    ></OutlinedInput>
  )
}
