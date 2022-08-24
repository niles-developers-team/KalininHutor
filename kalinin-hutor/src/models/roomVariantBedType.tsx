import { Bed, Crib, KingBed, SingleBed, Weekend } from "@mui/icons-material";
import { EntityStatus, IEntity } from "./common";

export enum BedTypes {
    // Односпальная кровать 
    Single,
    // Большая односпальная кровать 
    BigSingle,
    // Двуспальная кровать 
    Double,
    // Большая двуспальная кровать 
    BigDouble,
    // Детская кровать 
    BabyBed
}

export namespace BedTypes {
    export function getDescription(value: BedTypes | undefined) {
        switch (value) {
            case BedTypes.BabyBed: return 'Детская кровать';
            case BedTypes.BigDouble: return 'Большая двуспальная кровать';
            case BedTypes.BigSingle: return 'Большие односпальные кровати';
            case BedTypes.Double: return 'Двуспальная кровать';
            case BedTypes.Single: return 'Односпальные кровати';
            default: return 'Неизвестный тип кровати'
        }
    }

    export function getIcon(value: BedTypes | undefined): JSX.Element | null {
        switch (value) {
            case BedTypes.BabyBed: return <Crib />;
            case BedTypes.BigDouble: return <Bed />;
            case BedTypes.BigSingle: return <Weekend />;
            case BedTypes.Double: return <KingBed />;
            case BedTypes.Single: return <SingleBed />;
            default: return null;
        }
    }

    export const values: BedTypes[] = [
        BedTypes.Single,
        BedTypes.Double,
        BedTypes.BigSingle,
        BedTypes.BigDouble,
        BedTypes.BabyBed
    ];
}

export interface RoomVariantBedType extends IEntity {
    // Идентификатор варианта кровати
    id?: string;
    // Идентификатор номера
    roomVariantId?: string;
    // Тип кровати
    bedType: BedTypes;
    // Ширина кровати
    width?: number;
    // Длина кровати
    length?: number;
}

export namespace RoomVariantBedType {
    // Очередь получения вариантов кроватей в номере
    export interface GetQuery {
        // Идентификатор варианта кровати
        id: string;
        // Идентификатор номера
        roomVariantId: string;
    }

    // Запрос создания варианта кровати номера
    export interface CreateRequest {
        // Идентификатор номера
        roomVariantId: string;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
    }

    // Запрос удаления варианта кровати в номере
    export interface DeleteRequest {
        // Идентификатор варианта кровати
        ids: string[];
    }

    // Запрос обновления варианта кровати
    export interface UpdateRequest {
        // Идентификатор варианта кровати
        id: string;
        // Тип кровати
        bedType: BedTypes;
        // Ширина кровати
        width?: number;
        // Длина кровати
        length?: number;
    }

    export const initial: RoomVariantBedType = {
        bedType: BedTypes.Single,
        entityStatus: EntityStatus.NotChanged
    }
}