import createTheme from '@mui/material/styles/createTheme'
import colors from './colors'

const theme = createTheme({
  palette: {
    primary: {
      main: colors.mainBlue,
    },
  },
})

export default theme
