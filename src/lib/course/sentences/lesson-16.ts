/**
 * Lesson 16 — Adjectives before nouns. The premodifier, and what is not one.
 *
 * The built set was already the best-composed lesson in Stage 3, putting the new
 * premodifier inside every verb type from Stage 2, and that design is kept.
 *
 * *The kitchen window rattled* is the trap it lacked. *kitchen* sits exactly
 * where *narrow* sits in *The narrow gate jammed* and is a noun: it takes no
 * comparative and cannot follow a linking verb. Those are lesson 6's determiner
 * tests, run against a different intruder. *The bright red kite fell* stacks two
 * adjectives, which asks a real `Nom` question the built set never asked.
 */
import {
  adj,
  adj2n,
  adjn,
  adv,
  det,
  fusedAdj,
  nounmod,
  pp,
  sv,
  sva,
  svc,
  svo,
  svoc,
  svoo,
  svPlus,
  v,
} from './shape.ts';

export const LESSON_16 = [
  svc(
    'c16-a',
    16,
    adjn('The', 'new', 'tenant'),
    v('seemed', 'seem', 'Vlink'),
    adj('nervous'),
    'The recent arrival looked uneasy.',
  ),
  sv(
    'c16-b',
    16,
    adjn('The', 'narrow', 'gate'),
    v('jammed', 'jam', 'Vint'),
    'The tight gate stuck fast.',
  ),
  sv(
    'c16-c',
    16,
    adj2n('The', 'bright', 'red', 'kite'),
    v('fell', 'fall', 'Vint'),
    'The red kite dropped.',
  ),
  svPlus(
    'c16-d',
    16,
    fusedAdj('The', 'poor'),
    v('protested', 'protest', 'Vint'),
    adv('loudly'),
    'People with little money objected at volume.',
  ),
  sv(
    'c16-e',
    16,
    nounmod('The', 'kitchen', 'window'),
    v('rattled', 'rattle', 'Vint'),
    'The window in the kitchen shook.',
  ),
  svo(
    'c16-f',
    16,
    det('The', 'clerk'),
    v('filed', 'file', 'Vtr'),
    adjn('the', 'urgent', 'report'),
    'The clerk put the pressing report away.',
  ),
  svo(
    'c16-g',
    16,
    det('Another', 'storm'),
    v('damaged', 'damage', 'Vtr'),
    adjn('the', 'green', 'shutters'),
    'A second storm harmed the green shutters.',
  ),
  svoc(
    'c16-h',
    16,
    det('That', 'jury'),
    v('found', 'find', 'Vc'),
    adjn('the', 'young', 'driver'),
    adj('careless'),
    'That jury decided the young driver had not taken care.',
  ),
  svoo(
    'c16-i',
    16,
    det('The', 'porter'),
    v('handed', 'hand', 'Vg'),
    adjn('the', 'tired', 'guest'),
    det('a', 'key'),
    'The porter passed a key to the weary guest.',
  ),
  sva(
    'c16-j',
    16,
    adjn('The', 'heavy', 'crate'),
    v('is', 'be', 'Vbe'),
    pp('on', det('the', 'ramp')),
    'The weighty crate sits on the ramp.',
  ),
];
