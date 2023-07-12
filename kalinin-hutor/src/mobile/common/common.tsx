import { Box, styled } from "@mui/material";
import { grey } from "@mui/material/colors";

export const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
    borderRadius: 3,
    marginLeft: 'auto',
    marginRight: 'auto'
}));