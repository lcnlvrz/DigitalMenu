import { useEffect, useState } from 'react';
import { OneMenuViewProps } from '../components/OneMenuView/OneMenuView';
import { Campaing } from '../services/campaing.service';

export const useOneMenuView = (params: OneMenuViewProps) => {
    const [visibleCampaingBanner, setVisibleCampaingBanner] = useState(false);
    const [visibleCampaingContent, setVisibleCampaingContent] = useState(false);
    const [campaing, setCampaing] = useState<Campaing>();

    useEffect(() => {
        const menuCampaing = params.campaings?.filter(
            (campaing) => campaing?.startsWhenSelectedMenu?.id === params.currentMenu.id,
        )[0];
        const counterMenu = params.counterMenu?.filter((counter) => counter.id === params.currentMenu?.id)[0];
        if (menuCampaing && Number.isInteger(Number(counterMenu?.count) / 4)) {
            setVisibleCampaingBanner(true);
            setCampaing(menuCampaing);
        }
    }, [params.campaings]);

    return {
        setVisibleCampaingBanner,
        setVisibleCampaingContent,
        visibleCampaingBanner,
        campaing,
        visibleCampaingContent,
    };
};
