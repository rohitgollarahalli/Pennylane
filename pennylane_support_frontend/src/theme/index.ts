import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    body: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
  },
  radii: {
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
  components: {
    Button: {
      baseStyle: { borderRadius: '9999px' },
      defaultProps: { size: 'md' },
    },
    Input: {
      baseStyle: { field: { borderRadius: '12px' } },
    },
    Textarea: {
      baseStyle: { borderRadius: '12px' },
    },
    Card: {
      baseStyle: { container: { borderRadius: '16px' } },
    },
  },
});

export default theme;
