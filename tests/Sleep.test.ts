import Busy from '@civ-clone/core-unit/Rules/Busy';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Sleep from '../Sleep';
import Sleeping from '../Rules/Sleeping';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-unit/Rules/Yield';
import { expect } from 'chai';
import simpleRLELoader from '@civ-clone/simple-world-generator/tests/lib/simpleRLELoader';

describe('Sleep', (): void => {
  it('should automatically clear `Busy` when an enemy `Unit` is within the `Unit`s `visibility` area', async (): Promise<void> => {
    const ruleRegistry = new RuleRegistry(),
      unitRegistry = new UnitRegistry(),
      turn = new Turn(),
      world = await simpleRLELoader(ruleRegistry)('36G', 6, 6),
      unit = new Warrior(null, new Player(), world.get(1, 1), ruleRegistry),
      enemyUnit = new Warrior(
        null,
        new Player(),
        world.get(3, 3),
        ruleRegistry
      );

    unitRegistry.register(unit, enemyUnit);

    expect(unit.busy()).to.null;

    unit.action(
      new Sleep(
        unit.tile(),
        unit.tile(),
        unit,
        ruleRegistry,
        turn,
        unitRegistry
      )
    );

    const visibility1 = new YieldRule(
        new Effect((unit: Unit, unitYield: Yield) => unitYield.add(1))
      ),
      visibility2 = new YieldRule(
        new Effect((unit: Unit, unitYield: Yield) => unitYield.add(2))
      );

    ruleRegistry.register(visibility1);

    expect(unit.busy()).to.instanceof(Sleeping);
    expect((unit.busy() as Busy).validate()).to.false;

    ruleRegistry.unregister(visibility1);
    ruleRegistry.register(visibility2);

    expect(unit.busy()).to.instanceof(Sleeping);
    expect((unit.busy() as Busy).validate()).to.true;
  });
});
