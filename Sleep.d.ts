import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import { Turn } from '@civ-clone/core-turn-based-game/Turn';
import { UnitRegistry } from '@civ-clone/core-unit/UnitRegistry';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Sleeping from './Rules/Sleeping';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
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
export declare const sleeping: (
  unit: Unit,
  unitRegistry?: UnitRegistry
) => Sleeping;
export declare class Sleep extends DelayedAction {
  private _unitRegistry;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry?: RuleRegistry,
    turn?: Turn,
    unitRegistry?: UnitRegistry
  );
  perform(): void;
}
export default Sleep;
