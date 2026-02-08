//const Schema = require("mongoose").Schema;
const Validators = require("not-node/src/core/validators");

module.exports = {
    parent: "not-node//requiredObject",
    model: {
        type: String,
        default: '{}',
        searchable: true,
        required: true,
        validate: Validators.String.type
    },
    ui: {
        component: "UITextarea",
        placeholder: "Настройки",
        label: "Значение",
        readonly: false,
    },
};
