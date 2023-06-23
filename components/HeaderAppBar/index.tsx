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
import { Avatar, Divider, useMediaQuery } from '@mui/material'
import theme from 'utils/theme'
import { useAppSelector } from 'store'
import { KioskState } from 'store/types'

const settings = ['Sign out']

import pkg from 'package.json'
const version = pkg.version

interface HeaderAppBarProps {
  setDrawerOpen: (status: boolean) => void
}

export default function HeaderAppBar(props: HeaderAppBarProps) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))

  const kioskMode = useAppSelector(
    (state: { kiosk: KioskState }) => state.kiosk
  )

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
          <Box
            sx={{
              flexGrow: 1,
              display: isMobileView || kioskMode.enabled ? 'flex' : 'none',
            }}
          >
            <IconButton
              size="large"
              aria-label="navigation drawer toggle open"
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
              {version && (
                <>
                  <Divider />
                  <MenuItem
                    disabled
                    sx={{
                      '&.Mui-disabled': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Typography color="text.secondary">v{version}</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      {/* gross hack but this is pretty much the recommended way to do this */}
      {isMobileView && <Toolbar />}
    </>
  )
}
