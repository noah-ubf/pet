// import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// import { router } from './Router';
import { theme } from './Theme';
import Layout from './components/Layout';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
