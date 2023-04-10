import { Search } from '@mui/icons-material'
import { InputAdornment, OutlinedInput, TextField } from '@mui/material'
import { debounce } from 'ts-debounce'
import { addURLQueryParam, useRouterQuery } from 'utils/queryParams'

export default function SearchField() {
  const { router } = useRouterQuery()

  const onChange = (search: string) => {
    addURLQueryParam(router, 'search', search)
  }
  const debouncedOnChange = debounce(onChange, 500)

  return (
    <OutlinedInput
      placeholder="Search"
      endAdornment={
        <InputAdornment position="end">
          <Search />
        </InputAdornment>
      }
      onChange={(e) => debouncedOnChange(e.target.value)}
    ></OutlinedInput>
  )
}
