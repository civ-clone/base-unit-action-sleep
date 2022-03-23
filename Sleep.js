"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Sleep_unitRegistry;
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
        _Sleep_unitRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _Sleep_unitRegistry, unitRegistry, "f");
    }
    perform() {
        this.unit().setActive(false);
        this.unit().moves().set(0);
        this.unit().setBusy(new Sleeping_1.default(new Criterion_1.default(() => this.from()
            .getSurroundingArea(this.unit().visibility().value())
            .some((tile) => __classPrivateFieldGet(this, _Sleep_unitRegistry, "f")
            .getByTile(tile)
            .some((unit) => unit.player() !== this.unit().player()))), new Effect_1.default(() => {
            this.unit().setActive();
            this.unit().setBusy();
        })));
    }
}
exports.Sleep = Sleep;
_Sleep_unitRegistry = new WeakMap();
exports.default = Sleep;
//# sourceMappingURL=Sleep.js.map