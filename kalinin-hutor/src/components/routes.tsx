import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../hooks";
import { sessionService } from "../services";
import { AppState } from "../store";
import { UserActions } from "../store/userStore";
import { CartComponent } from "./cart/Cart";
import { CatalogComponent } from "./catalog/Catalog";
import { NotFound, PrivateRoute } from "./common";
import { NotAuthorizedComponent } from "./common/NotAuthorized";
import { FavoriteComponent } from "./favorite/Favorite";
import { HomeComponent } from "./home";
import { LayoutComponent } from "./Layout";
import { MeComponent } from "./me/Me";
import { MyBookingsComponent } from "./mybookings/MyBookings";
import { MyOrdersComponent } from "./myOrders/MyOrders";
import { MyRentalObjectComponent } from "./me/MyRentalObject";
import { RentalObjectsComponent } from "./rentalObjects/RentalObjects";
import { RoomVariantComponent } from "./me/roomVariant/RoomVariant";
import { SigninDialog } from "./signin/Signin";
import { RentalObjectComponent } from "./rentalObjects/RentalObject";
import { BookingComponent } from "./rentalObjects/Booking";


export function RoutesSwitch() {
    const { userState } = useAppSelector((state: AppState) => ({
        userState: state.userState
    }));
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState<boolean>(false);

    function handleSigninOpen() {
        setOpen(true);
    }

    async function handleSignin(phoneNumber: string, password: string) {
        dispatch(UserActions.signin({
            password: password,
            phoneNumber: `+7${phoneNumber}`,
            withSignup: true
        }));
    }

    useEffect(() => {
        if (sessionService.isUserAuthenticated())
            dispatch(UserActions.getCurrentUser());
    }, [location.pathname]);

    useEffect(() => {
        if (!userState.authenticating && userState.authenticated) {
            setOpen(false);
            navigate('/');
        }
    }, [userState.authenticating]);


    return (
        <LayoutComponent onSigninDialogOpen={handleSigninOpen}>
            <Routes>
                <Route index element={<HomeComponent />} />
                <Route path="/me" element={<PrivateRoute><MeComponent /></PrivateRoute>} />
                <Route path="/favorite" element={<PrivateRoute><FavoriteComponent /></PrivateRoute>} />
                <Route path="/my-orders" element={<MyOrdersComponent />} />
                <Route path="/my-bookings" element={<MyBookingsComponent />} />
                <Route path="/cart" element={<CartComponent />} />
                <Route path="/catalog" element={<CatalogComponent />} />
                <Route path="/rental-objects" element={<RentalObjectsComponent />} />
                <Route path="/rental-objects/:id" element={<RentalObjectComponent />} />
                <Route path="/rental-objects/:rentalObjectId/booking/:id" element={<BookingComponent />} />
                <Route path="/me/rental-objects/:id" element={<MyRentalObjectComponent />} />
                <Route path="/me/rental-objects/:rentalObjectId/room-variants/:id" element={<RoomVariantComponent />} />


                <Route path='401' element={<NotAuthorizedComponent onSigninClick={handleSigninOpen} />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
            <SigninDialog
                isOpen={open}
                authenticating={userState.authenticating}
                onSignin={handleSignin}
                onClose={() => setOpen(false)}
            />
        </LayoutComponent>
    );
}
