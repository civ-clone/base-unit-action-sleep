"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = void 0;
const Busy_1 = require("@civ-clone/core-unit/Rules/Busy");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
class Sleep extends DelayedAction_1.default {
    perform() {
        this.unit().setBusy(new Busy_1.default(new Criterion_1.default(() => false)));
    }
}
exports.Sleep = Sleep;
exports.default = Sleep;
//# sourceMappingURL=Sleep.js.map