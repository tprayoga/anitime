import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { Upload, UploadBox, UploadAvatar, UploadCustom } from '../upload';
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Box, alpha } from '@mui/system';
import Iconify from '../iconify';
// import AttachFileIcon from '@mui/icons-material/AttachFile';

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar error={!!error} file={field.value} {...other} />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUpload({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

RHFUpload.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
};

export function RHFUploadCustom({ name, multiple, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <UploadCustom
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <UploadCustom
            accept={{ 'image/*': [] }}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        )
      }
    />
  );
}

RHFUploadCustom.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
};

export function RHFUploadField({
  name,
  label,
  helperText,
  multiple,
  defaultValue,
  width = '120px',
  ...other
}) {
  const { control } = useFormContext();

  const [urls, setUrls] = useState([]);
  const [fileState, setFileState] = useState(null);
  const fileInputRef = useRef(null);

  const convertImageUrlToBlob = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting image URL to blob:', error);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const allowedTypes = ['image/png', 'image/jpeg'];

        const handleFileChange = (e) => {
          const files = e.target.files;
          const validFiles = Array.from(files).filter((file) => allowedTypes.includes(file.type));

          if (validFiles.length !== files.length) {
            alert('Invalid file type. Please select PNG or JPEG files only.');
            return;
          }

          const newUrls = validFiles.map((file) => URL.createObjectURL(file));
          setUrls([...newUrls]);
          setFileState(validFiles);
          field.onChange(validFiles);
        };

        const handleDelete = (index) => {
          const updatedUrls = [...urls];
          updatedUrls.splice(index, 1);
          setUrls(updatedUrls);

          const updatedFiles = [...fileState];
          updatedFiles.splice(index, 1);
          setFileState(updatedFiles);

          field.onChange(updatedFiles.length > 0 ? updatedFiles : undefined);
        };

        const handleInitialValue = async () => {
          if (Array.isArray(defaultValue) && defaultValue.length > 0) {
            try {
              const blobPromises = defaultValue.map(convertImageUrlToBlob);
              const blobs = await Promise.all(blobPromises);

              const files = blobs.map((blob, index) => {
                const file = new File([blob], `image${index}.jpg`, { type: blob.type });
                return file;
              });

              const dataTransfer = new DataTransfer();
              files.forEach((file) => {
                dataTransfer.items.add(file);
              });
              const fileList = dataTransfer.files;

              const urls = blobs.map((blob) => URL.createObjectURL(blob));

              setUrls(urls);
              setFileState(files);
              field.onChange(fileList);
            } catch (error) {
              console.error('Error handling initial value:', error);
            }
          } else {
            try {
              const blob = await convertImageUrlToBlob(defaultValue);
              const file = new File([blob], 'image.jpg', { type: blob.type });

              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              const fileList = dataTransfer.files;

              setUrls([URL.createObjectURL(blob)]);
              setFileState([file]);
              field.onChange(fileList);
            } catch (error) {
              console.error('Error handling initial value:', error);
            }
          }
        };

        useEffect(() => {
          if (defaultValue) {
            handleInitialValue();
          }
        }, [defaultValue]);

        return (
          <>
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                mt: 1,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple={multiple ? true : false}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <OutlinedInput
                onClick={() => fileInputRef.current.click()}
                placeholder={label}
                startAdornment={
                  <InputAdornment position="start">
                    <Iconify
                      icon="material-symbols:attach-file"
                      width={18}
                      sx={{
                        color: error ? '#ef5350' : 'gray',
                      }}
                    />
                  </InputAdornment>
                }
                error={!!error}
                sx={{
                  input: {
                    cursor: 'pointer',
                    '&::placeholder': {
                      color: error ? '#ef5350' : 'gray',
                    },
                  },
                }}
              />
              <FormHelperText error>{error ? error.message : helperText}</FormHelperText>
            </FormControl>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {urls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  <img
                    src={url}
                    style={{
                      aspectRatio: 1,
                      width: width,
                      height: width,
                      marginTop: '20px',
                      objectFit: 'cover',
                    }}
                    alt={`Image ${index}`}
                  />

                  <IconButton
                    size="small"
                    onClick={() => handleDelete(index)}
                    sx={{
                      top: 25,
                      right: 6,
                      zIndex: 9,
                      position: 'absolute',
                      color: (theme) => alpha(theme.palette.common.white, 0.8),
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                      },
                    }}
                  >
                    <Iconify icon="mingcute:close-line" width={18} />
                  </IconButton>
                  <Typography variant="subtitle2">{fileState[index].name}</Typography>
                </Box>
              ))}
            </div>
          </>
        );
      }}
    />
  );
}

RHFUploadField.propTypes = {
  helperText: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
};
