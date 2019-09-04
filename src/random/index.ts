import { randNoun } from './nouns';
import { randAdjectives } from './adjectives';
import { randVerb } from './verbs';

export function randSentence() {
    return [randNoun() , randAdjectives() , randVerb() , randNoun()].join('-')
}