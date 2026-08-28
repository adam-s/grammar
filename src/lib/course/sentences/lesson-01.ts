/**
 * Lesson 1 — Introduction. The frame, found with guidance.
 *
 * Every one is a subject and a one-word predicate, so the only decision on
 * screen is where the sentence splits.
 */
import { det, sv, v } from './shape.ts';

export const LESSON_01 = [
  sv('c01-a', 1, det('The', 'kettle'), v('boiled', 'boil', 'Vint'), 'The kettle came to the boil.'),
  sv('c01-b', 1, det('The', 'door'), v('creaked', 'creak', 'Vint'), 'The door made a noise.'),
  sv('c01-c', 1, det('The', 'audience'), v('clapped', 'clap', 'Vint'), 'The audience applauded.'),
  sv('c01-d', 1, det('The', 'candle'), v('flickered', 'flicker', 'Vint'), 'The candle wavered.'),
  sv('c01-e', 1, det('The', 'train'), v('departed', 'depart', 'Vint'), 'The train left.'),
  sv('c01-f', 1, det('The', 'bridge'), v('collapsed', 'collapse', 'Vint'), 'The bridge fell down.'),
  sv('c01-g', 1, det('The', 'machine'), v('stopped', 'stop', 'Vint'), 'The machine halted.'),
  sv('c01-h', 1, det('The', 'rain'), v('eased', 'ease', 'Vint'), 'The rain grew lighter.'),
  sv('c01-i', 1, det('The', 'lamp'), v('glowed', 'glow', 'Vint'), 'The lamp gave off light.'),
  sv('c01-j', 1, det('The', 'phone'), v('rang', 'ring', 'Vint'), 'The phone sounded.'),
];
