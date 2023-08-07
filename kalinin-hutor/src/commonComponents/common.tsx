import { CSSProperties } from "react";
import { EntityStatus, FileObject } from "../models";
import { sessionService } from "../services";

export const imageStyle: CSSProperties = {
    objectFit: "cover",
    borderRadius: 8
};

export function formatImgUrl(photo: FileObject) {
    if (photo.entityStatus === EntityStatus.Draft)
        return `data:${photo.extension};base64,${photo.body}`;

    return `${sessionService.apiUrl}/api/Files/Download?id=${photo.id}`;
}