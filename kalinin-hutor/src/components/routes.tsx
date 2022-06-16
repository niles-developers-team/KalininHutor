import { Route, Routes } from "react-router";
import { NotFound } from "./common";
import { HomeComponent } from "./home";
import { LayoutComponent } from "./Layout";
import { MeComponent } from "./me/Me";

export function RoutesSwitch() {
    return (
        <Routes >
            <Route index element={<LayoutComponent><HomeComponent /></LayoutComponent>} />
            <Route index element={<LayoutComponent><MeComponent /></LayoutComponent>} />
            
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}
