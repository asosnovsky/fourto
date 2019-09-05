import { observable, action, computed } from "mobx";
import { getAliases, saveAliases } from '~/database';

const basics = getAliases();
class NameState {
    @observable p1name = basics.p1;
    @observable p2name = basics.p2;

    @action syncNames()  {
        saveAliases(this.p1name, this.p2name);
    }
}

export const nameState = new NameState();