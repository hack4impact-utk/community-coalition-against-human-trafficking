import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput, TextField } from '@mui/material'
import React from 'react'
import { debounce } from 'ts-debounce'
import {
  addURLQueryParam,
  removeURLQueryParam,
  useRouterQuery,
} from 'utils/queryParams'

export default function SearchField() {
  const { router } = useRouterQuery()

  const onChange = (search: string) => {
    if (!search) removeURLQueryParam(router, 'search')
    else addURLQueryParam(router, 'search', search)
  }
  const debouncedOnChange = debounce(onChange, 500)

  return (
    <OutlinedInput
      placeholder="Search"
      fullWidth
      endAdornment={
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      }
      onChange={(e) => debouncedOnChange(e.target.value)}
      value={router.query.search || ''}
    ></OutlinedInput>
  )
}
