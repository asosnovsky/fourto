export function randVerb() {
    return verbList[Math.floor( Math.random() * verbList.length )]
}
export const verbList = [
'chop',
'visit',
'blot',
'fire',
'stare',
'drop',
'notice',
'heal',
'bleach',
'hook',
'instruct',
'hang',
'sin',
'punish',
'discover',
'pack',
'smoke',
'employ',
'skip',
'drown',
'mend',
'soak',
'beam',
'drag',
'enter',
'suck',
'chase',
'release',
'last',
'scold',
'count',
'knot',
'kiss',
'deceive',
'time',
'saw',
'clap',
'care',
'add',
'copy',
'sip',
'greet',
'introduce',
'repair',
'chew',
'smell',
'argue',
'irritate',
'attempt',
'receive',
'bang',
'educate',
'happen',
'guide',
'bomb',
'taste',
'satisfy',
'listen',
'work',
'unpack',
'extend',
'disapprove',
'long',
'remind',
'invite',
'mug',
'nod',
'sign',
'include',
'avoid',
'fancy',
'welcome',
'polish',
'fear',
'wreck',
'explain',
'support',
'deliver',
'interrupt',
'scream',
'crash',
'print',
'sigh',
'laugh',
'phone',
'confess',
'talk',
'announce',
'stay',
'reproduce',
'harass',
'excite',
'test',
'untidy',
'joke',
'whisper',
'please',
'poke',
'kick',
'box',
'suggest',
'wave',
'yell',
'cover',
'return',
'deserve',
'delight',
'peep',
'wash',
'inject',
'wait',
'help',
'suffer',
'measure',
'land',
'form',
'curl',
'back',
'wobble',
'improve',
'jam',
'squeeze',
'comb',
'trust',
'judge',
'walk',
'offend',
'bare',
'scrape',
'crack',
'consist',
'guess',
'branch',
'stop',
'stroke',
'shop',
'spot',
'decorate',
'impress',
'wipe',
'rub',
'kill',
'start',
'grin',
'blind',
'telephone',
'license',
'smile',
'type',
'guarantee',
'suspend',
'decay',
'imagine',
'tip',
'overflow',
'bake',
'murder',
'hammer',
'permit',
'fade',
'trot',
'object',
'breathe',
'arrive',
'warn',
'intend',
'attend',
'raise',
'label',
'step',
'plant',
'wander',
'heat',
'boast',
'suppose',
'point',
'excuse',
'race',
'zip',
'continue',
'shiver',
'thaw',
'park',
'mate',
'hug',
'carve',
'heap',
'warm',
'pedal',
'reply',
'press',
'pull',
'prick',
'drum',
'tickle',
'flood',
'flower',
'force',
'rush',
'bolt',
'whistle',
'pray',
'use',
'dislike',
'signal',
'invent',
'travel',
'beg',
'sprout',
'bless',
'knit',
'whine',
'handle',
'alert',
'identify',
'march',
'refuse',
'divide',
'manage',
'float',
'charge',
'bubble',
'melt',
'grip',
'camp',
'tie',
'cure',
'load',
'waste',
'glow',
'tame',
'tumble',
'dream',
'curve',
'exist',
'love',
'knock',
'consider',
'end',
'serve',
'wriggle',
'supply',
'concentrate',
'flow',
'lie',
'connect',
'flash',
'bump',
'interest',
'drip',
'describe',
'plug',
'note',
'order',
'suspect',
'attack',
'face',
'twist',
'embarrass',
'clip',
'exercise',
'pause',
'carry',
'pop',
'crush',
'hate',
'vanish',
'store',
'snow',
'head',
'stitch',
'sound',
'squash',
'colour',
'lighten',
'search',
'grease',
'rinse',
'marry',
'screw',
'match',
'wrap',
'terrify',
'depend',
'stain',
'amuse',
'record',
'shave',
'present',
'post',
'bat',
'matter',
'dust',
'fill',
'meddle',
'punch',
'train',
'radiate',
'ask',
'spray',
'pour',
'strengthen',
'fetch',
'contain',
'battle',
'snore',
'blink',
'agree',
'harm',
'level',
'jog',
'scrub',
'brake',
'follow',
'belong',
'paint',
'injure',
'tap',
'dare',
'coil',
'nail',
'increase',
'groan',
'doubt',
'preserve',
'rain',
'film',
'remember',
'bow',
'afford',
'subtract',
'perform',
'precede',
'pat',
'pine',
'reject',
'disagree',
'remove',
'weigh',
'bury',
'coach',
'report',
'burn',
'cheer',
'hover',
'undress',
'suit',
'shock',
'switch',
'glue',
'miss',
'yawn',
'attract',
'slow',
'jump',
'slap',
'dry',
'queue',
'confuse',
'strip',
'frighten',
'stamp',
'retire',
'arrest',
'empty',
'want',
'fax',
'bore',
'strap',
'applaud',
'pump',
'live',
'save',
'allow',
'mix',
'reach',
'mark',
'program',
'milk',
'ski',
'look',
'paste',
'place',
'soothe',
'trap',
'memorise',
'cry',
'puncture',
'detect',
'risk',
'trick',
'regret',
'wrestle',
'collect',
'tick',
'rely',
'scatter',
'moor',
'number',
'communicate',
'spare',
'escape',
'relax',
'watch',
'squeal',
'attach',
'multiply',
'wink',
'rot',
'peel',
'move',
'try',
'realise',
'sparkle',
'paddle',
'cheat',
'scorch',
'call',
'share',
'ruin',
'explode',
'bathe',
'recognise',
'dance',
'encourage',
'command',
'spell',
'roll',
'scare',
'water',
'haunt',
'touch',
'stretch',
'interfere',
'rock',
'close',
'tease',
'complain',
'trouble',
'delay',
'hurry',
'unlock',
'open',
'shade',
'juggle',
'examine',
'steer',
'influence',
'double',
'obey',
'compete',
'offer',
'drain',
'clean',
'behave',
'occur',
'lock',
'zoom',
'book',
'remain',
'sneeze',
'calculate',
'cause',
'arrange',
'trace',
'launch',
'cough',
'hand',
'stuff',
'mourn',
'surprise',
'surround',
'check',
'seal',
'fold',
'sniff',
'list',
'claim',
'fool',
'develop',
'trip',
'fry',
'obtain',
'wonder',
'question',
'provide',
'admire',
'shrug',
'part',
'grate',
'rule',
'reflect',
'expect',
'challenge',
'prefer',
'thank',
'destroy',
'pick',
'join',
'man',
'unite',
'dress',
'jail',
'whirl',
'tempt',
'lick',
'analyse',
'snatch',
'unfasten',
'push',
'tow',
'buzz',
'bruise',
'complete',
'correct',
'whip',
'expand',
'damage',
'like',
'balance',
'itch',
'squeak',
'protect',
'cross',
'ban',
'tug',
'kneel',
'found',
'moan',
'admit',
'request',
'tire',
'earn',
'trade',
'bounce',
'guard',
'promise',
'prevent',
'tremble',
'prepare',
'borrow',
'crawl',
'pretend',
'mess up',
'appear',
'ignore',
'hope',
'scratch',
'replace',
'fail',
'apologise',
'mine',
'fasten',
'plan',
'hunt',
'own',
'treat',
'need',
'rhyme',
'approve',
'hop',
'annoy',
'gaze',
'blush',
'sail',
'possess',
'reduce',
'clear',
'pinch',
'settle',
'concern',
'inform',
'practise',
'compare',
'shelter',
'stir',
'file',
'scribble',
'peck',
'grab',
'turn',
'enjoy',
'dam',
'frame',
'pass',
'observe',
'answer',
'sack',
'slip',
'x-ray',
'boil',
'preach',
'repeat',
'separate',
'owe',
'nest',
'worry',
'transport',
'fix',
'accept',
'appreciate',
'produce',
'wish',
'reign',
'learn',
'wail',
'gather',
'muddle',
'spark',
'disarm',
'fit',
'disappear',
'hum',
'rescue',
'entertain',
'flap',
'spill',
'change',
'tour',
'play',
'fence',
'name',
'spoil',
'succeed',
'rob',
'desert',
'advise',
'rejoice',
'brush',
'smash',
'choke',
'cycle',
'decide'
]