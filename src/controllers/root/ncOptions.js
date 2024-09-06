import Validators from "../common/validators.js";
import { Frame } from "not-bulma";
import { MODULE_NAME, DATA_MODEL_NAME as modelName } from "../../const.js";

const notCRUD = Frame.notCRUD;

import UIImport from "../common/import.svelte";
import CRUDActionList from "not-bulma/src/frame/crud/actions/list";

const LABELS = {
    plural: "Настройки",
    single: "Настройка",
};

class ncOptions extends notCRUD {
    static MODEL_NAME = modelName;
    static MODULE_NAME = MODULE_NAME;

    constructor(app, params, schemes) {
        super(app, modelName);
        this.setModuleName(MODULE_NAME);
        this.setModelName(modelName);
        this.setOptions("names", LABELS);
        this.setOptions("Validators", Validators);
        this.setOptions("params", params);
        this.setOptions("role", "root");
        this.setOptions("urlSchemes", schemes);
        this.setOptions("list", {
            actions: [
                {
                    title: "Экспорт",
                    action: this.openExport.bind(this),
                },
                {
                    title: "Импорт",
                    action: this.openImport.bind(this),
                },
            ],
            fields: [
                {
                    path: ":optionsID",
                    title: "ID",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":id",
                    title: "Название",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":value",
                    title: "Значение",
                    searchable: true,
                    sortable: true,
                    hideOnMobile: true,
                },
                {
                    path: ":active",
                    title: "Активна",
                    type: "boolean",
                    searchable: true,
                    sortable: true,
                    preprocessor: (value) => {
                        return [
                            {
                                value,
                            },
                        ];
                    },
                    hideOnMobile: true,
                },
                {
                    path: ":_id",
                    title: "Действия",
                    type: "button",
                    preprocessor: (value) =>
                        CRUDActionList.createActionsButtons(this, value),
                },
            ],
        });
        this.start();
        return this;
    }

    openExport() {
        window.location.assign(`/api/${MODULE_NAME}/${modelName}/export`);
    }

    closeImportPopup() {
        if (this.ui.import) {
            this.ui.import.$destroy();
            this.ui.import = null;
        }
    }

    openImport() {
        this.log("import");
        this.closeImportPopup();
        this.ui.import = new UIImport({
            target: document.body,
        });
        this.ui.import.$on("reject", (ev) => {
            if (ev.detail.error) {
                this.error(ev.detail.error);
            }
            this.closeImportPopup();
        });
        this.ui.import.$on("resolve", () => this.closeImportPopup());
        this.ui.import.$on("import", async (ev) => {
            if (ev.detail.options) {
                try {
                    let res = await this.requestImport(ev.detail.options);
                    this.log(res);
                    if (res.status === "ok") {
                        if (res.result && res.result.info) {
                            this.ui.import.setInfo(res.result.info);
                            this.afterImportSuccess(res.result);
                        }
                    } else {
                        this.error(res.error);
                        this.ui.import.setError(res.error);
                    }
                } catch (e) {
                    this.ui.import.setError(e.message);
                    this.error(e);
                }
            }
        });
    }

    afterImportSuccess(result) {
        let delay = parseInt(result.shutdown) + 2000;
        this.refresh(delay);
        setTimeout(() => this.closeImportPopup(), delay);
    }

    requestImport(data) {
        return this.make[this.getModelName()]({
            options: data,
        }).$import();
    }

    getItemTitle(item) {
        return `${item.optionsID}#${item.id}`;
    }
}

export default ncOptions;
