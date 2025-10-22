import { useRef, useState, useEffect, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { useBoolean } from 'src/hooks/use-boolean';
import { Box, FormControl, Stack } from '@mui/material';
import FormProvider from 'src/components/hook-form/form-provider';
import Iconify from 'src/components/iconify';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function ModalDomba({
  open,
  close,
  title,
  buttonText,
  isForm,
  methods,
  onSubmit,
  children,
  maxWidth = 'md',
  onClickBack,
  disabledButtonBack,
  titleBack,
  loadingSubmit,
  onClick,
}) {
  const dialog = useBoolean();

  const [scroll] = useState('paper');

  const descriptionElementRef = useRef(null);

  useEffect(() => {
    if (dialog.value) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement) {
        descriptionElement.focus();
      }
    }
  }, [dialog.value]);

  const renderDialog = (
    <Box>
      <DialogTitle sx={{ px: 2, py: 3, backgroundColor: '#EAFFEA' }}>{title}</DialogTitle>

      <DialogContent
        dividers={scroll === 'paper'}
        sx={{
          paddingY: 3,
        }}
        ref={descriptionElementRef}
        tabIndex={-1}
      >
        {children}
      </DialogContent>

      <DialogActions>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="space-between"
          width={1}
          spacing={2}
        >
          {onClickBack && (
            <Button
              onClick={onClickBack}
              color="inherit"
              variant="contained"
              disabled={disabledButtonBack}
              startIcon={<Iconify icon="mdi:arrow-left" />}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                paddingX: 3,
              }}
            >
              {titleBack || 'Back'}
            </Button>
          )}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems="center"
            spacing={1}
            width={1}
            justifyContent="end"
          >
            <Button
              onClick={close}
              sx={{
                width: 1,
                py: 1,
              }}
              variant="outlined"
            >
              Batal
            </Button>

            <LoadingButton
              loading={loadingSubmit}
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                width: 1,
                py: 1,
              }}
              onClick={onClick}
            >
              {buttonText || 'Save'}
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogActions>
    </Box>
  );

  return (
    <>
      {isForm ? (
        <Dialog open={open} onClose={close} scroll="paper" fullWidth maxWidth={maxWidth}>
          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderDialog}
          </FormProvider>
        </Dialog>
      ) : (
        <Dialog open={open} onClose={close} scroll="paper" fullWidth maxWidth={maxWidth}>
          {renderDialog}
        </Dialog>
      )}
    </>
  );
}
