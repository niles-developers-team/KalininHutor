import {
    Hotel,
    Fireplace,
    Bathtub,
    CleaningServices,
    SoupKitchen,
    Panorama,
    Info,
    LocalParking,
    LiveTv,
    Weekend,
    RoomService,
    Accessible,
    NaturePeople
} from "@mui/icons-material";

export enum CharacteristicTypes {
    // Спальня
    BedRoom,
    // Гостиная зона
    LivingArea,
    // Ванная комната
    WC,
    // Уборка и дезинфекция
    Cleaning,
    // Питание и напитки
    FoodAndDrinks,
    // Вид
    View,
    // Общие
    Common,
    // Парковка
    Parking,
    // Телевизоры и технологии
    TVAndMedia,
    // Удобства в номере
    AmenetiesInTheRoom,
    // Сервисы
    Services,
    // Доступность
    Availability,
    // На свежем воздухе
    Outdoors
}

export namespace CharacteristicTypes {
    export function getDescription(value: CharacteristicTypes | undefined) {
        switch (value) {
            case CharacteristicTypes.BedRoom: return 'Спальня';
            case CharacteristicTypes.LivingArea: return 'Гостиная зона';
            case CharacteristicTypes.WC: return 'Ванная комната';
            case CharacteristicTypes.Cleaning: return 'Уборка и дезинфекция';
            case CharacteristicTypes.FoodAndDrinks: return 'Питание и напитки';
            case CharacteristicTypes.View: return 'Вид';
            case CharacteristicTypes.Common: return 'Общие';
            case CharacteristicTypes.Parking: return 'Парковка';
            case CharacteristicTypes.TVAndMedia: return 'Телевизоры и технологии';
            case CharacteristicTypes.AmenetiesInTheRoom: return 'Удобства в номере';
            case CharacteristicTypes.Services: return 'Сервисы';
            case CharacteristicTypes.Availability: return 'Доступность';
            case CharacteristicTypes.Outdoors: return 'На свежем воздухе';
            default: return 'Неизвестный тип кровати'
        }
    }

    export function getIcon(value: CharacteristicTypes | undefined): JSX.Element | undefined {
        switch (value) {
            case CharacteristicTypes.BedRoom: return <Hotel />;
            case CharacteristicTypes.LivingArea: return <Fireplace />;
            case CharacteristicTypes.WC: return <Bathtub />;
            case CharacteristicTypes.Cleaning: return <CleaningServices />;
            case CharacteristicTypes.FoodAndDrinks: return <SoupKitchen />;
            case CharacteristicTypes.View: return <Panorama />;
            case CharacteristicTypes.Common: return <Info />;
            case CharacteristicTypes.Parking: return <LocalParking />;
            case CharacteristicTypes.TVAndMedia: return <LiveTv />;
            case CharacteristicTypes.AmenetiesInTheRoom: return <Weekend />;
            case CharacteristicTypes.Services: return <RoomService />;
            case CharacteristicTypes.Availability: return <Accessible />;
            case CharacteristicTypes.Outdoors: return <NaturePeople />;
            default: return undefined;
        }
    }

    export const values: CharacteristicTypes[] = [
        CharacteristicTypes.BedRoom,
        CharacteristicTypes.LivingArea,
        CharacteristicTypes.WC,
        CharacteristicTypes.Cleaning,
        CharacteristicTypes.FoodAndDrinks,
        CharacteristicTypes.View,
        CharacteristicTypes.Common,
        CharacteristicTypes.Parking,
        CharacteristicTypes.TVAndMedia,
        CharacteristicTypes.AmenetiesInTheRoom,
        CharacteristicTypes.Services,
        CharacteristicTypes.Availability,
        CharacteristicTypes.Outdoors
    ];
}

export interface RoomCharacteristic {
    // Идентификатор характеристики
    id: string;
    // Название характеристики
    name: string;
    // Описание харакетирстики
    description: string;
    // Тип (Зона) харакетистики
    type: CharacteristicTypes;
    selected?: boolean;
}

export interface RoomCharacteristicFilter extends RoomCharacteristic {
    selected?: boolean;
}

export namespace RoomCharacteristic {
    // Очередь получения удобств и услуг</summary>
    export interface GetQuery {
        // Идентификатор характеристики
        id?: string;
        // Поисковая строка
        searchText?: string;
        take?: number;
    }

    export interface CreateRequest {
        name: string;
        description: string;
        type: CharacteristicTypes;
    }

    export interface DeleteRequest {
        id: string;
    }

    export interface UpdateRequest
        extends DeleteRequest, CreateRequest {
    }

    export const initial: RoomCharacteristic = {
        id: '',
        description: '',
        name: '',
        type: CharacteristicTypes.Common
    }
}