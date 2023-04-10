import { Autocomplete, TextField } from '@mui/material'
import { debounce } from 'ts-debounce'
import {
  addURLQueryParam,
  removeURLQueryParam,
  useRouterQuery,
} from 'utils/queryParams'

interface SearchAutocompleteProps {
  searchKey: string
  options: string[]
  placeholder?: string
}

export default function SearchAutocomplete({
  searchKey,
  options,
  placeholder,
}: SearchAutocompleteProps) {
  const { router } = useRouterQuery()
  const onChange = (search: string | null) => {
    if (!search) removeURLQueryParam(router, searchKey)
    else addURLQueryParam(router, searchKey, search as string)
  }

  return (
    <Autocomplete
      options={options}
      onChange={(_e, val) => {
        onChange(val)
      }}
      renderInput={(params) => (
        <TextField {...params} placeholder={placeholder} variant="outlined" />
      )}
    />
  )
}
