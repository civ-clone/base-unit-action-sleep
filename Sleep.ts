import Busy from '@civ-clone/core-unit/Rules/Busy';
import Criterion from '@civ-clone/core-rule/Criterion';
import DelayedAction from '@civ-clone/core-unit/DelayedAction';

export class Sleep extends DelayedAction {
  perform() {
    this.unit().setBusy(new Busy(new Criterion(() => false)));
  }
}

export default Sleep;
