import { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import { LayoutComponent } from "./desktop/Layout";
import { CartComponent } from "./desktop/cart/Cart";
import { CatalogComponent } from "./desktop/catalog/Catalog";
import { PrivateRoute, NotAuthorizedComponent, NotFound } from "./desktop/common";
import { FavoriteComponent } from "./desktop/favorite/Favorite";
import { MyOrdersComponent } from "./desktop/myOrders/MyOrders";
import { MyBookingsComponent } from "./desktop/mybookings/MyBookings";
import { BookingComponent } from "./desktop/rentalObjects/Booking";
import { RentalObjectsComponent } from "./desktop/rentalObjects/RentalObjects";
import { SigninDialog } from "./desktop/signin/Signin";
import { HomeComponent as MobileHomeComponent, MobileLayoutComponent } from "./mobile";
import { RentalObjectComponent as MobileRentalObjectComponent } from "./mobile/rentalObjects";
import { BookingDetailsComponent, MeComponent, MyRentalObjectComponent, RoomVariantComponent } from "./desktop/me";
import { RentalObjectComponent } from "./desktop/rentalObjects/RentalObject";
import { HomeComponent } from "./desktop/home";
import { useAppSelector, useAppDispatch } from "./hooks";
import { sessionService } from "./services";
import { AppState, UserActions } from "./store";

export function RoutesSwitch() {
    const { userState } = useAppSelector((state: AppState) => state);
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


    return <>
        <BrowserView>
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
                    <Route path="/me/bookings/:id" element={<BookingDetailsComponent />} />
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
        </BrowserView>
        <MobileView>
            <MobileLayoutComponent onSigninDialogOpen={handleSigninOpen}>
                <Routes>
                    <Route index element={<MobileHomeComponent />} />
                    <Route path="/rental-objects/:id" element={<MobileRentalObjectComponent />} />
                </Routes>
            </MobileLayoutComponent>
        </MobileView>
    </>
}
