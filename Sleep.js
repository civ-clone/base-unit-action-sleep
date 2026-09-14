"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sleep = exports.sleeping = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Turn_1 = require("@civ-clone/core-turn-based-game/Turn");
const UnitRegistry_1 = require("@civ-clone/core-unit/UnitRegistry");
const BusyRegistry_1 = require("@civ-clone/core-unit/BusyRegistry");
const Criterion_1 = require("@civ-clone/core-rule/Criterion");
const DelayedAction_1 = require("@civ-clone/core-unit/DelayedAction");
const Effect_1 = require("@civ-clone/core-rule/Effect");
const Sleeping_1 = require("./Rules/Sleeping");
/**
 * The `Sleeping` rule for a unit, built the same way fresh or restored.
 *
 * Nothing here comes from the action — the criterion is "an enemy is visible
 * from where I am" and the effect is "wake up", both read off the unit and the
 * world. That is what makes this one safe to rebuild from a lookup, where the
 * nine delayed actions are not: they close over a completion turn and a piece
 * of work, and a save has to carry those as a `PendingEffect`.
 *
 * It used to be built inline in `perform`, closing over `this.from()` and the
 * action's own registry, which made it look like it held action state. It
 * never did.
 */
const sleeping = (unit, unitRegistry = UnitRegistry_1.instance) => new Sleeping_1.default(new Criterion_1.default(() => unit
    .tile()
    .getSurroundingArea(unit.visibility().value())
    .some((tile) => unitRegistry
    .getByTile(tile)
    .some((other) => other.player() !== unit.player()))), new Effect_1.default(() => {
    unit.setActive();
    unit.setBusy();
}));
exports.sleeping = sleeping;
class Sleep extends DelayedAction_1.default {
    constructor(from, to, unit, ruleRegistry = RuleRegistry_1.instance, turn = Turn_1.instance, unitRegistry = UnitRegistry_1.instance) {
        super(from, to, unit, ruleRegistry, turn);
        this._unitRegistry = unitRegistry;
    }
    perform() {
        this.unit().setActive(false);
        this.unit().moves().set(0);
        this.unit().setBusy((0, exports.sleeping)(this.unit(), this._unitRegistry));
    }
}
exports.Sleep = Sleep;
// Without this a unit saved asleep fails to load: `BusyRegistry.rebuild`
// throws rather than guess, and guessing would wake the unit silently.
//
// `Sleep` extends `DelayedAction` but never calls `super.perform`, so it owes
// nothing and needs no `PendingEffect` — a plain factory is the whole story.
BusyRegistry_1.instance.register(Sleeping_1.default, (unit) => (0, exports.sleeping)(unit));
exports.default = Sleep;
//# sourceMappingURL=Sleep.js.map