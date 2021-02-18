"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _unitRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const Busy_1 = require("@civ-clone/core-unit/Rules/Busy");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Effect_1 = require("@civ-clone/core-rule/Effect");
class Sleep extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitRegistry = UnitRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        _unitRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _unitRegistry, unitRegistry);
    }
    perform() {
        this.unit().setBusy(new Busy_1.default(new Criterion_1.default(() => this.from()
            .getSurroundingArea(this.unit().visibility().value())
            .some((tile) => __classPrivateFieldGet(this, _unitRegistry).getByTile(tile)
            .some((unit) => unit.player() !== this.unit().player()))), new Effect_1.default(() => {
            this.unit().setActive();
            this.unit().setBusy();
            this.unit().moves().set(this.unit().movement());
        })));
    }
}
exports.Sleep = Sleep;
_unitRegistry = new WeakMap();
exports.default = Sleep;
//# sourceMappingURL=Sleep.js.map