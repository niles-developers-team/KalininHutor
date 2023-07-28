import { handleJsonResponse, ResponseHandler, handleResponse } from "../helpers";
import { FileObject } from "../models";

class FilesService {
    public async get(query?: FileObject.GetQuery): Promise<FileObject[]> {
        let url = 'api/files';
        let conditionIndex: number = 0;
        if (query) {
                url += `${conditionIndex++ === 0 ? '?' : '&'}parentId=${query.parentId}`;
        }

        return fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .then(handleJsonResponse as ResponseHandler<FileObject[]>);
    }
}

export const filesService = new FilesService();