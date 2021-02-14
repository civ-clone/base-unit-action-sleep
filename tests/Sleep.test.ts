import Busy from '@civ-clone/core-unit/Rules/Busy';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Sleep from '../Sleep';
import Turn from '@civ-clone/core-turn-based-game/Turn';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import { expect } from 'chai';
import simpleRLELoader from '@civ-clone/simple-world-generator/tests/lib/simpleRLELoader';

describe('Sleep', (): void => {
  it('should automatically clear `Busy` when an enemy `Unit` is in a neighbouring `Tile`', (): void => {
    const ruleRegistry = new RuleRegistry(),
      unitRegistry = new UnitRegistry(),
      turn = new Turn(),
      world = simpleRLELoader(ruleRegistry)('16G', 4, 4),
      player = new Player(),
      enemy = new Player(),
      unit = new Warrior(null, player, world.get(1, 1), ruleRegistry),
      enemyUnit = new Warrior(null, enemy, world.get(3, 3), ruleRegistry);

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

    expect(unit.busy()).to.instanceof(Busy);
    expect((unit.busy() as Busy).validate()).to.false;

    enemyUnit.setTile(world.get(2, 2));

    expect(unit.busy()).to.instanceof(Busy);
    expect((unit.busy() as Busy).validate()).to.true;
  });
});
