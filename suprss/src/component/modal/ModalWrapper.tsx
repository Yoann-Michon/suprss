import type { ReactNode } from 'react';
import { Dialog, DialogContent, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  component: ReactNode;
}

const ModalWrapper = ({ open, onClose, component }:ModalWrapperProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
      <DialogContent>{component}</DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
