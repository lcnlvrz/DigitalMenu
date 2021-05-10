import { ActionStatusMenuAndPlate } from '../../controllers/my-menu.controller';
import { RestaurantInitialValue } from '../../initial-values/Restaurant/restaurant.initial-value';
import { Campaing } from '../../services/campaing.service';
import { CreatePlateResponse, PlateExtended } from '../../services/menu.service';
import { OrderInterface, SurveyFormResponse, SurveyFormResponseStatus } from '../../services/order.service';
import { ReviewResponse } from '../../services/restaurant.service';
import { SurveyForm } from '../../services/survey-form.service';
import { TableInterface } from '../../services/table.service';
import { UserInterface, UserLoading } from '../User';

export enum StatusMenuAndPlate {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
}

export interface CreateMenu {
    name: string;
    description: string;
}

export interface MenuExtended {
    id: number;
    plates?: PlateInterface[];
    createdAt: string;
    updatedAt: string;
    status: StatusMenuAndPlate;
}

export type MenuInterface = CreateMenu & MenuExtended;

export interface PlateInterface {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    preparationTime: number;
    ingredients: string[];
    weight: number;
    campaing?: Campaing;
    status: StatusMenuAndPlate;
}

export enum DaysOfTheWeek {
    Monday = 'Monday',
    Tuesday = 'Tuesday',
    Wednesday = 'Wednesday',
    Thursday = 'Thursday',
    Friday = 'Friday',
    Saturday = 'Saturday',
    Sunday = 'Sunday',
}

export interface Schedule {
    day: DaysOfTheWeek;
    hour: [string, string];
}

export interface RestaurantInterface {
    id: number;
    name: string;
    description: string;
    location: string;
    menus: MenuInterface[];
    cellphone: string;
    schedule: Schedule[];
    hasOtherPaymentMethod: boolean;
    hasTableOrderingSystem: boolean;
    profilePhoto: string;
    orders: OrderInterface[];
    bannerPhoto: string;
    reviews: ReviewResponse[];
    isDelivery: boolean;
    surveyForms: SurveyForm[];
    campaings: Campaing[];
    surveyFormsResponses: SurveyFormResponse[];
    tables: TableInterface[];
}

export interface OwnerRestaurant {
    owner: UserInterface;
}

export type CreateRestaurantResponse = RestaurantInterface & OwnerRestaurant;

export type RestaurantReducerInterface = Partial<RestaurantInterface> & UserLoading;

export const RestaurantInitialState: RestaurantReducerInterface = {
    bannerPhoto: undefined,
    cellphone: undefined,
    description: undefined,
    name: undefined,
    schedule: undefined,
    location: undefined,
    hasTableOrderingSystem: undefined,
    hasOtherPaymentMethod: undefined,
    menus: [],
    reviews: [],
    orders: [],
    campaings: [],
    tables: [],
    isDelivery: undefined,
    id: undefined,
    isLoading: true,
};

export enum RestaurantActionsTypes {
    SET_RESTAURANT = 'SET_RESTAURANT',
    SET_MENUS = 'SET_MENUS',
    SET_ORDERS_RESTAURANT = 'SET_ORDERS_RESTAURANT',
    CLEAR_RESTAURANT = 'CLEAR_RESTAURANT',
    UPDATE_RESTAURANT = 'UPDATE_RESTAURANT',
    ADD_NEW_MENU = 'ADD_NEW_MENU',
    ADD_NEW_PLATE = 'ADD_NEW_PLATE',
    UPDATE_STATUS_PLATE = 'UPDATE_STATUS_PLATE',
    UPDATE_STATUS_MENU = 'UPDATE_STATUS_MENU',
    UPDATE_INFORMATION_PLATE = 'UPDATE_INFORMATION_PLATE',
    UPDATE_INFORMATION_MENU = 'UPDATE_INFORMATION_MENU',
    REMOVE_MENU = 'REMOVE_MENU',
    REMOVE_PLATE = 'REMOVE_PLATE',
    UPDATE_ORDER = 'UPDATE_ORDER',
    SET_ORDERS = 'SET_ORDERS',
    SET_REVIEWS = 'SET_REVIEWS',
    SET_SURVEY_FORMS = 'SET_SURVEY_FORMS',
    UPDATE_SURVEY_FORM = 'UPDATE_SURVEY_FORM',
    ADD_SURVEY_FORM = 'ADD_SURVEY_FORM',
    REMOVE_QUESTION_FROM_SURVEY_FORM = 'REMOVE_QUESTION_FROM_SURVEY_FORM',
    SET_SURVEY_FORMS_RESPONSES = 'SET_SURVEY_FORMS_RESPONSES',
    UPDATE_SURVEY_FORM_RESPONSE_STATUS = 'UPDATE_SURVEY_FORM_RESPONSE_STATUS',
    SET_CAMPAINGS = 'SET_CAMPAINGS',
    ADD_CAMPAING = 'ADD_CAMPAING',
    UPDATE_CAMPAING = 'UPDATE_CAMPAING',
    REMOVE_CAMPAING = 'REMOVE_CAMPAING',
    ADD_TABLE = 'ADD_TABLE',
    SET_TABLES = 'SET_TABLES',
    UPDATE_TABLE = 'UPDATE_TABLE',
    REMOVE_TABLE = 'REMOVE_TABLE',
    SET_PLATES_BY_SEACH = 'SET_PLATES_BY_SEACH',
}

export interface PlateWithMenuId {
    menuId: number;
    image: string;
}

export type AddNewPlate = CreatePlateResponse & PlateWithMenuId;

export interface UpdateStatusPayload {
    platesIds: number[];
    toDo: ActionStatusMenuAndPlate;
    menuId: number;
}

export interface UpdateInformationPlateExtended {
    menuId: number;
    plateId: number;
}

export type UpdateInformationPlate = UpdateInformationPlateExtended & Partial<PlateInterface>;

export type RestaurantActions =
    | { type: RestaurantActionsTypes.SET_RESTAURANT; payload: Partial<RestaurantInterface> }
    | { type: RestaurantActionsTypes.CLEAR_RESTAURANT }
    | { type: RestaurantActionsTypes.UPDATE_RESTAURANT; payload: Partial<RestaurantInterface> }
    | { type: RestaurantActionsTypes.ADD_NEW_MENU; payload: MenuInterface }
    | { type: RestaurantActionsTypes.ADD_NEW_PLATE; payload: AddNewPlate }
    | {
          type: RestaurantActionsTypes.UPDATE_STATUS_PLATE;
          payload: UpdateStatusPayload;
      }
    | {
          type: RestaurantActionsTypes.UPDATE_INFORMATION_PLATE;
          payload: { input: Partial<PlateInterface>; menuId: number; plateId: number };
      }
    | { type: RestaurantActionsTypes.UPDATE_STATUS_MENU; payload: { menusIds: number[]; status: StatusMenuAndPlate } }
    | { type: RestaurantActionsTypes.REMOVE_MENU; payload: number[] }
    | { type: RestaurantActionsTypes.REMOVE_PLATE; payload: { platesIds: number[]; menuId: number } }
    | {
          type: RestaurantActionsTypes.UPDATE_INFORMATION_MENU;
          payload: { menuId: number; data: Partial<MenuInterface> };
      }
    | { type: RestaurantActionsTypes.UPDATE_ORDER; payload: { newData: Partial<OrderInterface>; orderId: number } }
    | { type: RestaurantActionsTypes.SET_ORDERS; payload: OrderInterface[] }
    | { type: RestaurantActionsTypes.SET_REVIEWS; payload: ReviewResponse[] }
    | { type: RestaurantActionsTypes.SET_SURVEY_FORMS; payload: SurveyForm[] }
    | { type: RestaurantActionsTypes.ADD_SURVEY_FORM; payload: SurveyForm }
    | { type: RestaurantActionsTypes.SET_MENUS; payload: MenuInterface[] }
    | { type: RestaurantActionsTypes.SET_ORDERS_RESTAURANT; payload: OrderInterface[] }
    | { type: RestaurantActionsTypes.UPDATE_SURVEY_FORM; payload: Partial<SurveyForm> }
    | {
          type: RestaurantActionsTypes.REMOVE_QUESTION_FROM_SURVEY_FORM;
          payload: { questionId: number; indexToRemove: number; surveyFormId: number };
      }
    | { type: RestaurantActionsTypes.SET_SURVEY_FORMS_RESPONSES; payload: SurveyFormResponse[] }
    | {
          type: RestaurantActionsTypes.UPDATE_SURVEY_FORM_RESPONSE_STATUS;
          payload: { surveyFormResponseIndex: number; newStatus: SurveyFormResponseStatus };
      }
    | { type: RestaurantActionsTypes.ADD_CAMPAING; payload: Campaing }
    | { type: RestaurantActionsTypes.SET_CAMPAINGS; payload: Campaing[] }
    | { type: RestaurantActionsTypes.UPDATE_CAMPAING; payload: { newData: Partial<Campaing>; campaingId: number } }
    | { type: RestaurantActionsTypes.REMOVE_CAMPAING; payload: { campaingId: number } }
    | { type: RestaurantActionsTypes.ADD_TABLE; payload: TableInterface }
    | { type: RestaurantActionsTypes.SET_TABLES; payload: TableInterface[] }
    | {
          type: RestaurantActionsTypes.UPDATE_TABLE;
          payload: { newDataTable: Partial<TableInterface>; tableIdToUpdate: number };
      }
    | { type: RestaurantActionsTypes.REMOVE_TABLE; payload: { tableIdToRemove: number } }
    | { type: RestaurantActionsTypes.SET_PLATES_BY_SEACH; payload: { platesToSet: PlateInterface[]; menuId: number } };

export interface UseCreateRestaurant {
    isOpen: boolean;
    createRestaurant: (input: typeof RestaurantInitialValue) => void;
    isLoading: boolean;
    checkErrorsExtended: (input: typeof RestaurantInitialValue) => boolean;
    errorsExtended: {
        scheduleHour: string;
        scheduleDays: string;
    };
}
