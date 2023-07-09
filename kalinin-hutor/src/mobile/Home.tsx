import { Stack, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../hooks";
import { useEffect } from "react";
import { MobileRentalObjectInfoComponent, RentalObjectShortInfoSkeleton } from "../components/rentalObjects/RentalObjectInfo";
import { AppState, RentalObjectActions, RoomCharacteristicActions } from "../store";
import { useNavigate } from "react-router-dom";
import { RentalObject } from "../models";

export const HomeComponent = function (): JSX.Element {
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
        <Stack marginTop={2} spacing={2}>
            {rentalObjects.map((ro, index) =>
            (
                rentalObjectState.modelsLoading
                    ? <RentalObjectShortInfoSkeleton />
                    : <MobileRentalObjectInfoComponent key={ro.id} model={ro} onShowVariants={handleShowVariants} />
            ))}
        </Stack>
    )
}