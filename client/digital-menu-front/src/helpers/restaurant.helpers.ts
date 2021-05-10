import { ActionStatusMenuAndPlate, StatusMenuAndPlate } from '../controllers/my-menu.controller';
import { MenuInterface, PlateInterface, UpdateStatusPayload } from '../interfaces/Restaurant/restaurant.interface';
import { Campaing } from '../services/campaing.service';
import { OrderInterface, SurveyFormResponse, SurveyFormResponseStatus } from '../services/order.service';
import { SurveyForm } from '../services/survey-form.service';
import { TableInterface } from '../services/table.service';

export class RestaurantHelper {
    updateStatusPlate(input: UpdateStatusPayload, menusCopy: MenuInterface[]): MenuInterface[] {
        const { platesIds, toDo, menuId } = input;
        const index = menusCopy.findIndex((value) => value.id === menuId);
        const platesUpdated = menusCopy[index].plates?.map((plate) => {
            const plateUpdated: PlateInterface = { ...plate };
            for (let i = 0; i < platesIds.length; i++) {
                const plateId = platesIds[i];
                if (plateId === plate.id) {
                    plateUpdated.status =
                        toDo === ActionStatusMenuAndPlate.PUBLISH
                            ? StatusMenuAndPlate.PUBLIC
                            : StatusMenuAndPlate.HIDDEN;
                }
            }
            return plateUpdated;
        });
        menusCopy[index].plates = platesUpdated;
        return menusCopy;
    }

    updateStatusMenu(menusIds: number[], status: StatusMenuAndPlate, menus: MenuInterface[]): MenuInterface[] {
        return menus.map((value) => {
            for (let i = 0; i < menusIds.length; i++) {
                const menuId = menusIds[i];
                if (menuId === value.id) value.status = status;
            }

            return value;
        });
    }

    updateInformationPlate(
        plateId: number,
        menuId: number,
        input: Partial<PlateInterface>,
        menus: MenuInterface[],
    ): MenuInterface[] {
        const index = menus.findIndex((value) => value.id === menuId);
        const platesUpdated = menus[index].plates?.map((plate) => {
            if (plate.id === plateId) return { ...plate, ...input } as PlateInterface;
            return plate;
        });
        menus[index].plates = platesUpdated;
        return menus;
    }

    removeMenu(menusIds: number[], menus: MenuInterface[]): MenuInterface[] {
        return menus.filter((menu) => menusIds.findIndex((id) => menu.id === id) === -1);
    }

    removePlate(menus: MenuInterface[], platesIds: number[], menuId: number): MenuInterface[] {
        return menus.map((menu) => {
            const plates = menu.plates?.filter((plate) => platesIds.findIndex((id) => id === plate.id) === -1);
            return { ...menu, plates };
        });
    }

    updateInformationMenu(menuId: number, input: Partial<MenuInterface>, menus: MenuInterface[]): MenuInterface[] {
        return menus.map((menu) => {
            if (menuId === menu.id) return { ...menu, ...input };
            return menu;
        });
    }

    updateOrder(orderId: number, orders: OrderInterface[], newData: Partial<OrderInterface>): OrderInterface[] {
        return orders.map((order) => {
            if (orderId === order.id) {
                return { ...order, ...newData };
            } else {
                return order;
            }
        });
    }

    addSurveyForm(newSurveyForm: SurveyForm, surveyForms: SurveyForm[]): SurveyForm[] {
        surveyForms.push(newSurveyForm);
        return surveyForms;
    }

    updateSurveyForm(surveyForms: SurveyForm[], newSurveyFormData: Partial<SurveyForm>): SurveyForm[] {
        return surveyForms.map((form) => {
            if (form.id === newSurveyFormData.id) return { ...form, ...newSurveyFormData };
            return form;
        });
    }

    removeQuestionFromSurveyForm(surveyForms: SurveyForm[], indexToRemove: number, surveyFormId: number): SurveyForm[] {
        const indexSurveyForm = surveyForms.findIndex((value) => value.id === surveyFormId);
        surveyForms[indexSurveyForm].questions.splice(indexToRemove, 1);
        return surveyForms;
    }

    updateSurveyFormResponseStatus(
        newStatus: SurveyFormResponseStatus,
        surveyFormResponseIndex: number,
        surveyFormResponses: SurveyFormResponse[],
    ): SurveyFormResponse[] {
        surveyFormResponses[surveyFormResponseIndex].status = newStatus;
        return surveyFormResponses;
    }

    addCampaing(campaings: Campaing[], newCampaing: Campaing): Campaing[] {
        campaings.push(newCampaing);
        return campaings;
    }

    updateCampaing(newDataCampaing: Partial<Campaing>, campaings: Campaing[], campaingId: number): Campaing[] {
        return campaings.map((campaing) => {
            if (campaing.id === campaingId) return { ...campaing, ...newDataCampaing };
            return campaing;
        });
    }

    removeCampaing(campaings: Campaing[], campaingId: number): Campaing[] {
        return campaings.filter((campaing) => campaing.id !== campaingId);
    }

    addTable(tables: TableInterface[], newTable: TableInterface): TableInterface[] {
        tables.push(newTable);
        return tables;
    }

    updateTable(
        newDataTable: Partial<TableInterface>,
        tables: TableInterface[],
        tableIdToUpdate: number,
    ): TableInterface[] {
        return tables.map((table) => {
            if (table.id === tableIdToUpdate) {
                return { ...table, ...newDataTable };
            } else {
                return table;
            }
        });
    }

    removeTable(tableIdToRemove: number, tables: TableInterface[]): TableInterface[] {
        const indexToRemove = tables.findIndex((table) => table.id === tableIdToRemove);
        tables.splice(indexToRemove, 1);
        return tables;
    }

    setPlatesBySearch(platesToSet: PlateInterface[], menuId: number, menus: MenuInterface[]): MenuInterface[] {
        return menus.map((menu) => {
            if (menu.id === menuId) return { ...menu, plates: platesToSet };
            return menu;
        });
    }
}
