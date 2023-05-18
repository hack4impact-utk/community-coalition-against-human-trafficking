import { Box, Typography } from '@mui/material'

export default function NoResultsText() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: '350' }}>
        No results found
      </Typography>
      <Typography variant="body2" mt={2} color="text.secondary">
        Try adjusting your search or filter to find what you&apos;re looking
        for.
      </Typography>
    </Box>
  )
}
