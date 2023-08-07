import { Favorite, Menu } from "@mui/icons-material";
import { AppBar, Container, Toolbar, Stack, IconButton, Typography } from "@mui/material";
import { HideOnScroll } from "../../commonComponents";

interface AppBarProps {
    leftActionButton: JSX.Element;
}

export const MobileAppBarComponent = function(props: AppBarProps) {
    return (        
        <HideOnScroll>
        <AppBar position="sticky" color="default">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Stack width="100%" spacing={2} direction="row" alignItems="center">
                        {props.leftActionButton}
                        <Typography sx={{ flexGrow: 1 }}>Калинин Хутор</Typography>
                        <IconButton disabled><Favorite /></IconButton>
                        <IconButton disabled><Menu /></IconButton>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    </HideOnScroll>
    );
}