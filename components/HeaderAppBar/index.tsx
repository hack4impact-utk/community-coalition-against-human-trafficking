import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { Avatar, useMediaQuery } from '@mui/material'
import theme from 'utils/theme'

const settings = ['Sign out']

interface HeaderAppBarProps {
  setDrawerOpen: (status: boolean) => void
}

export default function HeaderAppBar(props: HeaderAppBarProps) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const { data: session } = useSession()

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const onSignOut = () => {
    signOut()
    handleCloseUserMenu()
  }

  return (
    <>
      <AppBar
        position={isMobileView ? 'fixed' : 'relative'}
        sx={{ background: 'white', px: 2, backfaceVisibility: 'hidden' }}
      >
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => props.setDrawerOpen(true)}
              sx={{ color: theme.palette.grey['800'] }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {/* keeps the sign in user circle in the right most corner */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                src={session?.user?.image || ''}
                imgProps={{ referrerPolicy: 'no-referrer' }}
              />
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={onSignOut}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* gross hack but this is pretty much the recommended way to do this */}
      {isMobileView && <Toolbar />}
    </>
  )
}
