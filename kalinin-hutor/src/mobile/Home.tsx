import { AppBar, Container, IconButton, Stack, Toolbar, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { MobileRentalObjectInfoComponent, RentalObjectShortInfoSkeleton } from "../components/rentalObjects/RentalObjectInfo";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../store";
import { RouteProps, useNavigate } from "react-router-dom";
import { RentalObject } from "../models";
import { HideOnScroll } from "../components/common";
import { Favorite, Menu, Tune } from "@mui/icons-material";

interface Props {

}

export const HomeComponent = function (props: Props & RouteProps): JSX.Element {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { rentalObjectState } = useAppSelector((state: AppState) => state);

    useEffect(() => {

        dispatch(RentalObjectActions.getRentalObjects({ getRoomVariants: true }));
        dispatch(RoomCharacteristicActions.getRoomCharacteristics());
    }, []);

    let rentalObjects: RentalObject[] = [];

    if (rentalObjectState.modelsLoading === false)
        rentalObjects = rentalObjectState.models;
    else {
        rentalObjects = Array.from(new Array(3));
    }

    function handleShowVariants(id: string) {
        navigate(`/rental-objects/${id}`);
    }

    return (
        <Stack>
            <HideOnScroll>
                <AppBar position="sticky" color="default" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Container maxWidth="xl">
                        <Toolbar disableGutters>
                            <Stack width="100%" spacing={2} direction="row" alignItems="center">
                                <IconButton><Tune /></IconButton>
                                <Typography sx={{flexGrow: 1}}>Калинин Хутор</Typography>
                                <IconButton><Favorite /></IconButton>
                                <IconButton><Menu /></IconButton>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>
            </HideOnScroll>
            <Stack marginTop={2} spacing={2}>
                {rentalObjects.map((ro, index) =>
                (
                    rentalObjectState.modelsLoading
                        ? <RentalObjectShortInfoSkeleton />
                        : <MobileRentalObjectInfoComponent key={ro.id} model={ro} onShowVariants={handleShowVariants} />
                ))}
            </Stack>
        </Stack>
    )
}