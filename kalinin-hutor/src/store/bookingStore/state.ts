import { Booking } from "../../models";
import { ModelLoading, ModelLoaded, ModelsLoading, ModelsLoaded, ModelsDeleting, ModelsDeleted } from "../appState";

export type ModelState = ModelLoading | ModelLoaded<Booking>;
export type ModelsState = ModelsLoading | ModelsLoaded<Booking>;
export type DeleteState = ModelsDeleting<Booking.DeleteRequest> | ModelsDeleted<Booking.DeleteRequest>;
export type BookingState = ModelState & ModelsState & DeleteState;