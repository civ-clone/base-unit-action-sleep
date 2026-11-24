import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import {
  BusyContext,
  instance as busyRegistryInstance,
} from '@civ-clone/core-unit/BusyRegistry';
import Criterion from '@civ-clone/core-rule/Criterion';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Effect from '@civ-clone/core-rule/Effect';
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
export const sleeping = (
  unit: Unit,
  unitRegistry: UnitRegistry = unitRegistryInstance
): Sleeping =>
  new Sleeping(
    new Criterion((): boolean =>
      unit
        .tile()
        .getSurroundingArea(unit.visibility().value())
        .some((tile: Tile): boolean =>
          unitRegistry
            .getByTile(tile)
            .some((other: Unit): boolean => other.player() !== unit.player())
        )
    ),
    new Effect((): void => {
      unit.setActive();
      unit.setBusy();
    })
  );

export class Sleep extends DelayedAction {
  private _unitRegistry: UnitRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this._unitRegistry = unitRegistry;
  }

  perform() {
    this.unit().setActive(false);
    this.unit().moves().set(0);

    this.unit().setBusy(sleeping(this.unit(), this._unitRegistry));
  }
}

// Without this a unit saved asleep fails to load: `BusyRegistry.rebuild`
// throws rather than guess, and guessing would wake the unit silently.
//
// `Sleep` extends `DelayedAction` but never calls `super.perform`, so it owes
// nothing and needs no `PendingEffect` — a plain factory is the whole story.
//
// It looks for enemies among the loading game's units, so a unit loaded into a game with its own registries wakes for
// that game's enemies (civ-clone/web-renderer#248).
busyRegistryInstance.register(
  Sleeping,
  (unit: Unit, context: BusyContext = {}): Sleeping =>
    sleeping(unit, context.units)
);

export default Sleep;
