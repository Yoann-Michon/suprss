import type { TFunction } from "i18next";

export const getSidebarSteps = (t: TFunction) => [
    {
        element: "#sidebar_home",
        intro: t("tutorial.steps.home"),
    },
    {
        element: "#sidebar_flux",
        intro: t("tutorial.steps.flux"),
    },
    {
        element: "#sidebar_collections",
        intro: t("tutorial.steps.collections"),
    },
    {
        element: "#sidebar_favorites",
        intro: t("tutorial.steps.favorites"),
    },
    {
        element: "#sidebar_tutorial",
        intro: t("tutorial.steps.tutorial"),
    },
    {
        element: "#sidebar_documentation",
        intro: t("tutorial.steps.documentation"),
    },
    {
        element: "#header_darkmode_btn",
        intro: t("tutorial.steps.darkmode_btn"),
    },
    {
        element: "#header_avatar_btn",
        intro: t("tutorial.steps.avatar_btn"),
    },
];