import { Button } from '@mui/material';
import PropTypes from 'prop-types';

export function ButtonDomba({ children, sx, ...props }) {
  return (
    <Button
      color="primary"
      variant="contained"
      size="large"
      sx={{
        width: { xs: '100%', md: '180px' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

ButtonDomba.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
