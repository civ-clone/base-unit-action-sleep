"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Sleeping_1 = require("./Rules/Sleeping");
class Sleep extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitRegistry = UnitRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._unitRegistry = unitRegistry;
    }
    perform() {
        this.unit().setActive(false);
        this.unit().moves().set(0);
        this.unit().setBusy(new Sleeping_1.default(new Criterion_1.default(() => this.from()
            .getSurroundingArea(this.unit().visibility().value())
            .some((tile) => this._unitRegistry
            .getByTile(tile)
            .some((unit) => unit.player() !== this.unit().player()))), new Effect_1.default(() => {
            this.unit().setActive();
            this.unit().setBusy();
        })));
    }
}
exports.Sleep = Sleep;
exports.default = Sleep;
//# sourceMappingURL=Sleep.js.map