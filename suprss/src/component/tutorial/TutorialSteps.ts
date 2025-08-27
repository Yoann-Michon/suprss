import type { TFunction } from "i18next";

export const getSidebarSteps = (t: TFunction) => [
    {
        element: "#sidebar_home",
        intro: t("tutorial.steps.home"),
    },
    {
        element: "#sidebar_myFeed",
        intro: t("tutorial.steps.myFeed"),
    },
    {
        element: "#sidebar_sharedCollections",
        intro: t("tutorial.steps.sharedCollections"),
    },
    {
        element: "#sidebar_collections",
        intro: t("tutorial.steps.collections"),
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
        intro: t("tutorial.steps.avatatr_btn"),
    },
];

export const getHomeSteps = (t: TFunction) => [
    {
        element: "#search_bar",
        intro: t("tutorial.steps.searchBar"),
    },
    {
        element: "#filters",
        intro: t("tutorial.steps.filters"),
    },
    {
        element: "#home_display",
        intro: t("tutorial.steps.displayHome"),
    },
    {
        element: "#pagination",
        intro: t("tutorial.steps.pagination"),
    }
];

export const getMyFeedSteps = (t: TFunction) => [
    {
        element: "#my_feed_filter",
        intro: t("tutorial.steps.myFeedFilter"),
    },
    {
        element: "#my_feed_sort",
        intro: t("tutorial.steps.myFeedSort"),
    },
    {
        element: "#my_feed_add",
        intro: t("tutorial.steps.myFeedAdd"),
    },
];

export const getSharedCollectionsSteps = (t: TFunction) => [
    {
        element: "#shared_collections_list",
        intro: t("tutorial.steps.sharedCollectionsList"),
    },
    {
        element: "#shared_collections_create",
        intro: t("tutorial.steps.sharedCollectionsCreate"),
    },
];

export const getCollectionsSteps = (t: TFunction) => [
    {
        element: "#collections_list",
        intro: t("tutorial.steps.collectionsList"),
    },
    {
        element: "#collections_create",
        intro: t("tutorial.steps.collectionsCreate"),
    },
];


