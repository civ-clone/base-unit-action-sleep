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
import Busy from '@civ-clone/core-unit/Rules/Busy';
import Criterion from '@civ-clone/core-rule/Criterion';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import Effect from '@civ-clone/core-rule/Effect';

export class Sleep extends DelayedAction {
  #unitRegistry: UnitRegistry;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    turn: Turn = turnInstance,
    unitRegistry: UnitRegistry = unitRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry, turn);

    this.#unitRegistry = unitRegistry;
  }

  perform() {
    this.unit().setBusy(
      new Busy(
        new Criterion((): boolean =>
          this.from()
            .getSurroundingArea(this.unit().visibility().value())
            .some((tile: Tile): boolean =>
              this.#unitRegistry
                .getByTile(tile)
                .some(
                  (unit: Unit): boolean =>
                    unit.player() !== this.unit().player()
                )
            )
        ),
        new Effect((): void => {
          this.unit().setActive();
          this.unit().setBusy();
          this.unit().moves().set(this.unit().movement());
        })
      )
    );
  }
}

export default Sleep;
