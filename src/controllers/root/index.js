import ncOptions from "./ncOptions.js";

let manifest = {
    router: {
        manifest: [ncOptions.getRoutes()],
    },
    menu: {
        side: {
            items: [
                {
                    id: "system.options",
                    section: "system",
                    title: "Настройки",
                    url: "/not-options/options",
                },
            ],
        },
    },
};

export { manifest };
