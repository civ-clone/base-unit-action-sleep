import '../Sleep';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Unit from '@civ-clone/core-unit/Unit';
import UnitRegistry from '@civ-clone/core-unit/UnitRegistry';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import Yield from '@civ-clone/core-yield/Yield';
import YieldRule from '@civ-clone/core-unit/Rules/Yield';
import { expect } from 'chai';
import { instance as busyRegistryInstance } from '@civ-clone/core-unit/BusyRegistry';
import { instance as unitRegistryInstance } from '@civ-clone/core-unit/UnitRegistry';
import simpleRLELoader from '@civ-clone/simple-world-generator/tests/lib/simpleRLELoader';

// civ-clone/web-renderer#248
describe('Sleeping, loaded into a game with its own registries', (): void => {
  it("wakes for enemies in the context's `units`, not the module instance", async (): Promise<void> => {
    const rules = new RuleRegistry(),
      context = { units: new UnitRegistry() },
      world = await simpleRLELoader(rules)('36G', 6, 6),
      unit = new Warrior(null, new Player(), world.get(1, 1), rules),
      enemy = new Warrior(null, new Player(), world.get(2, 2), rules);

    rules.register(
      new YieldRule(
        new Effect((unit: Unit, unitYield: Yield) => unitYield.add(2))
      )
    );

    const busy = busyRegistryInstance.rebuild('Sleeping', unit, context);

    unitRegistryInstance.register(enemy);

    try {
      expect(busy.validate()).to.false;

      context.units.register(enemy);

      expect(busy.validate()).to.true;
    } finally {
      unitRegistryInstance.unregister(enemy);
    }
  });
});
