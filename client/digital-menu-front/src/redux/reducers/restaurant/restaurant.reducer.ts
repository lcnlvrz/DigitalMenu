import { Reducer } from 'redux';
import { RestaurantHelper } from '../../../helpers/restaurant.helpers';
import {
    MenuInterface,
    RestaurantActions,
    RestaurantActionsTypes,
    RestaurantInitialState,
    RestaurantReducerInterface,
} from '../../../interfaces/Restaurant/restaurant.interface';

export const restaurantReducer: Reducer<RestaurantReducerInterface, RestaurantActions> = (
    state = RestaurantInitialState,
    action,
): RestaurantReducerInterface => {
    let menusCopy: MenuInterface[] = [];
    if (state.menus) {
        menusCopy = [...state.menus];
    }

    const restaurantHelper = new RestaurantHelper();

    switch (action.type) {
        case RestaurantActionsTypes.SET_RESTAURANT:
            return { ...action.payload, isLoading: false };

        case RestaurantActionsTypes.CLEAR_RESTAURANT:
            return { isLoading: true };

        case RestaurantActionsTypes.SET_MENUS:
            return { ...state, menus: action.payload };

        case RestaurantActionsTypes.SET_ORDERS_RESTAURANT:
            return { ...state, orders: action.payload };

        case RestaurantActionsTypes.UPDATE_RESTAURANT:
            return { ...state, ...action.payload };

        case RestaurantActionsTypes.ADD_NEW_MENU:
            menusCopy.push(action.payload);
            return { ...state, menus: menusCopy };

        case RestaurantActionsTypes.ADD_NEW_PLATE:
            const { menuId, ...rest } = action.payload;
            const index = menusCopy.findIndex((value) => value.id === menuId);
            menusCopy[index].plates?.push({
                ...rest,
                preparationTime: rest.preparationTime,
            });
            return { ...state, menus: menusCopy };

        case RestaurantActionsTypes.UPDATE_STATUS_PLATE:
            const menuWithPlatesStateUpdated = restaurantHelper.updateStatusPlate(action.payload, menusCopy);
            return { ...state, menus: menuWithPlatesStateUpdated };

        case RestaurantActionsTypes.UPDATE_INFORMATION_PLATE:
            const menuWithPlatesInformationUpdated = restaurantHelper.updateInformationPlate(
                action.payload.plateId,
                action.payload.menuId,
                action.payload.input,
                menusCopy,
            );
            return { ...state, menus: menuWithPlatesInformationUpdated };

        case RestaurantActionsTypes.UPDATE_STATUS_MENU:
            const { menusIds, status } = action.payload;
            const menuWithStatusUpdated = restaurantHelper.updateStatusMenu(menusIds, status, menusCopy);
            return { ...state, menus: menuWithStatusUpdated };

        case RestaurantActionsTypes.REMOVE_MENU:
            const menuWithoutMenusDeleted = restaurantHelper.removeMenu(action.payload, menusCopy);
            return { ...state, menus: menuWithoutMenusDeleted };

        case RestaurantActionsTypes.REMOVE_PLATE:
            const menuWithoutPlatesDeleted = restaurantHelper.removePlate(
                menusCopy,
                action.payload.platesIds,
                action.payload.menuId,
            );
            return { ...state, menus: menuWithoutPlatesDeleted };

        case RestaurantActionsTypes.UPDATE_INFORMATION_MENU:
            const menusWithInformationUpdated = restaurantHelper.updateInformationMenu(
                action.payload.menuId,
                action.payload.data,
                menusCopy,
            );
            return { ...state, menus: menusWithInformationUpdated };

        case RestaurantActionsTypes.UPDATE_ORDER:
            if (state.orders) {
                const ordersUpdated = restaurantHelper.updateOrder(
                    action.payload.orderId,
                    state.orders,
                    action.payload.newData,
                );
                return { ...state, orders: ordersUpdated };
            } else {
                return state;
            }
        case RestaurantActionsTypes.SET_ORDERS:
            return { ...state, orders: action.payload };

        case RestaurantActionsTypes.SET_REVIEWS:
            return { ...state, reviews: action.payload };

        case RestaurantActionsTypes.SET_SURVEY_FORMS:
            return { ...state, surveyForms: action.payload };

        case RestaurantActionsTypes.ADD_SURVEY_FORM:
            if (state.surveyForms) {
                const surveyFormsUpdated = restaurantHelper.addSurveyForm(action.payload, state.surveyForms);
                return { ...state, surveyForms: surveyFormsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.UPDATE_SURVEY_FORM:
            if (state.surveyForms) {
                const surveyFormsUpdated = restaurantHelper.updateSurveyForm(state.surveyForms, action.payload);
                return { ...state, surveyForms: surveyFormsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.REMOVE_QUESTION_FROM_SURVEY_FORM:
            if (state.surveyForms) {
                const surveyFormsUpdated = restaurantHelper.removeQuestionFromSurveyForm(
                    state.surveyForms,
                    action.payload.indexToRemove,
                    action.payload.surveyFormId,
                );
                return { ...state, surveyForms: surveyFormsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.SET_SURVEY_FORMS_RESPONSES:
            return { ...state, surveyFormsResponses: action.payload };

        case RestaurantActionsTypes.UPDATE_SURVEY_FORM_RESPONSE_STATUS:
            if (state.surveyFormsResponses) {
                const surveyFormsResponsesUpdated = restaurantHelper.updateSurveyFormResponseStatus(
                    action.payload.newStatus,
                    action.payload.surveyFormResponseIndex,
                    state.surveyFormsResponses,
                );
                return { ...state, surveyFormsResponses: surveyFormsResponsesUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.ADD_CAMPAING:
            if (state.campaings) {
                const campaingsUpdated = restaurantHelper.addCampaing(state.campaings, action.payload);
                return { ...state, campaings: campaingsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.SET_CAMPAINGS:
            return { ...state, campaings: action.payload };

        case RestaurantActionsTypes.UPDATE_CAMPAING:
            if (state.campaings) {
                const campaingsUpdated = restaurantHelper.updateCampaing(
                    action.payload.newData,
                    state.campaings,
                    action.payload.campaingId,
                );
                return { ...state, campaings: campaingsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.REMOVE_CAMPAING:
            if (state.campaings) {
                const campaingsUpdated = restaurantHelper.removeCampaing(state.campaings, action.payload.campaingId);
                return { ...state, campaings: campaingsUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.ADD_TABLE:
            if (state.tables) {
                const tablesUpdated = restaurantHelper.addTable(state.tables, action.payload);
                return { ...state, tables: tablesUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.SET_TABLES:
            return { ...state, tables: action.payload };

        case RestaurantActionsTypes.UPDATE_TABLE:
            if (state.tables) {
                const tablesUpdated = restaurantHelper.updateTable(
                    action.payload.newDataTable,
                    state.tables,
                    action.payload.tableIdToUpdate,
                );
                return { ...state, tables: tablesUpdated };
            } else {
                return state;
            }

        case RestaurantActionsTypes.REMOVE_TABLE:
            if (state.tables) {
                const tablesUpdated = restaurantHelper.removeTable(action.payload.tableIdToRemove, state.tables);
                return { ...state, tables: tablesUpdated };
            } else {
                return state;
            }
        case RestaurantActionsTypes.SET_PLATES_BY_SEACH:
            if (state.menus) {
                const menusUpdated = restaurantHelper.setPlatesBySearch(
                    action.payload.platesToSet,
                    action.payload.menuId,
                    state.menus,
                );
                return { ...state, menus: menusUpdated };
            } else {
                return state;
            }
        default:
            return state;
    }
};
