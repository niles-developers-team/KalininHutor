import { Route, Routes } from "react-router";
import { NotFound } from "./common";
import { HomeComponent } from "./home";
import { LayoutComponent } from "./Layout";

export function RoutesSwitch() {
    return (
        <Routes >
            <Route index element={<LayoutComponent><HomeComponent /></LayoutComponent>} />
            {/* <Route path="search" element={<SearchComponent />} />
                <Route path="me" element={<Me />} /> */}
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}
