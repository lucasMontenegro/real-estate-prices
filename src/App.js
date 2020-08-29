import 'fontsource-roboto'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import Theme from './Theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import Page from './Page'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    maxWidth: '60rem',
    padding: '2rem',
    minHeight: '10rem',
    [theme.breakpoints.down('xs')]: {
      padding: '1rem'
    }
  }
}), { name: 'App' })
function App () {
  const classes = useStyles()
  return (
    <Theme>
      <CssBaseline />
      <Page widthStyle="readable">
        <div className={classes.content}>
          <Typography>
            App en construcción. Visitá nuestra {' '}
            <Link
              href="https://www.facebook.com/terrenos.charata"
              target="_blank"
              rel="noopener noreferrer"
            >
              página de Facebook
            </Link>
            .
          </Typography>
        </div>
      </Page>
    </Theme>
  )
}
export default App
