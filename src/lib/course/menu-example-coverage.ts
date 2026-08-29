import { CLAUSE_KINDS } from '../grammar/node-variants.ts';
import { FUNCTION_ROWS } from '../grammar/options.ts';
import {
  AUX_KINDS,
  FINITENESS,
  PART_KINDS,
  PHRASE_FORMS,
  VERB_TYPES,
  WORD_FORMS,
} from '../grammar/types.ts';

/**
 * The stable grammatical choices the learner can see in the label menus.
 * Dynamic gap and anchor labels collapse to the decision they demonstrate.
 */
export const MENU_DECISIONS: readonly string[] = [
  ...[...PHRASE_FORMS, ...WORD_FORMS].map((form) => `form:${form}`),
  ...FUNCTION_ROWS.map((row) => row.key),
  ...VERB_TYPES.map((type) => `vt:${type}`),
  ...CLAUSE_KINDS.map((kind) => `kind:${kind}`),
  ...FINITENESS.map((value) => `fin:${value}`),
  ...PART_KINDS.map((kind) => `part:${kind}`),
  ...AUX_KINDS.map((kind) => `aux:${kind}`),
  'voice:active',
  'voice:passive',
  'gap',
  'anchor',
  'stack',
  'fuse:determiner',
  'fuse:premodifier',
];

export interface MenuExample {
  decision: string;
  lessonId: string;
  sentenceId: string;
}

const examples = (
  lessonId: string,
  sentenceId: string,
  decisions: readonly string[],
): MenuExample[] => decisions.map((decision) => ({ decision, lessonId, sentenceId }));

/**
 * One visible, parsed lesson-blog example for every stable menu choice.
 * The prose and caption on the cited page explain the point; the tests verify
 * that the cited diagram really contains the claimed grammatical decision.
 */
export const MENU_EXAMPLES: readonly MenuExample[] = [
  ...examples('02-sentence-frame', 'fix-sentence-frame', [
    'form:S',
    'func:subject',
    'func:predicate',
  ]),
  ...examples('03-main-verb', 'fix-main-verb-competitor', ['form:VP', 'form:V', 'func:head']),
  ...examples('04-noun-phrases', 'fix-subject-phrase', ['form:NP']),
  ...examples('05-find-the-head', 'fix-nominal', ['form:Nom']),
  ...examples('05-find-the-head', 'fix-subject-agreement', ['form:N']),
  ...examples('06-determiners', 'fix-determinative-phrase', ['form:DP']),
  ...examples('06-determiners', 'fix-determiner-a-light', ['form:Det', 'func:determiner']),
  ...examples('06-determiners', 'fix-fused-determiner', ['fuse:determiner']),
  ...examples('07-pronouns', 'fix-pronoun-she-waved', ['form:Pron']),
  ...examples('08-verbs-alone', 'fix-vint', ['vt:Vint']),
  ...examples('09-verbs-with-objects', 'fix-vtr', ['func:directObject', 'vt:Vtr']),
  ...examples('10-linking-verbs', 'fix-vlink', [
    'form:Adj',
    'form:AdjP',
    'func:subjectComplement',
    'vt:Vlink',
  ]),
  ...examples('11-the-verb-be', 'fix-vbe', ['vt:Vbe']),
  ...examples('12-two-objects', 'fix-vg', ['func:indirectObject', 'vt:Vg']),
  ...examples('13-naming-the-object', 'fix-vc', ['func:objectComplement', 'vt:Vc']),
  ...examples('14-required-adverbials', 'fix-vbe', [
    'form:P',
    'form:PP',
    'func:complement',
    'func:obligatoryAdverbial',
  ]),
  ...examples('14-required-adverbials', 'fix-main-verb-irregular', [
    'form:Adv',
    'form:AdvP',
    'func:adverbial',
  ]),
  ...examples('16-adjectives-before-nouns', 'fix-noun-premodifier', ['func:premodifier']),
  ...examples('16-adjectives-before-nouns', 'fix-fused-premodifier', ['fuse:premodifier']),
  ...examples('16-adjectives-before-nouns', 'fix-stacked', ['stack']),
  ...examples('21-modifiers-after-the-head', 'fix-subject-agreement', ['func:postmodifier']),
  ...examples('22-appositives', 'fix-appositive', ['func:appositive']),
  ...examples('22-appositives', 'fix-determinative-and-name', ['func:flat']),
  ...examples('23-numbers-in-noun-phrases', 'fix-numeral', ['form:Num']),
  ...examples('24-auxiliary-verbs', 'fix-auxiliary-chain', [
    'form:Aux',
    'func:auxiliary',
    'aux:perfect',
    'aux:progressive',
  ]),
  ...examples('24-auxiliary-verbs', 'fix-modal-auxiliary', ['aux:modal']),
  ...examples('24-auxiliary-verbs', 'fix-supporting-do', ['aux:do']),
  ...examples('25-particles', 'fix-particle', ['form:Part', 'func:particle', 'part:verbal']),
  ...examples('26-coordination-in-phrases', 'fix-coordinated-subject', [
    'form:Conj',
    'func:coordinate',
    'func:coordinator',
  ]),
  ...examples('28-main-and-dependent', 'fix-object-clause', [
    'form:Cl',
    'kind:nominal',
    'fin:finite',
  ]),
  ...examples('29-adverbial-clauses', 'fix-adverbial-clause', [
    'form:Subord',
    'func:marker',
    'kind:adverbial',
  ]),
  ...examples('30-nominal-clauses', 'fix-extraposition', [
    'func:placeholderSubject',
    'func:extraposed',
  ]),
  ...examples('30-nominal-clauses', 'fix-existential', ['func:displaced']),
  ...examples('31-relative-clauses', 'fix-subject-relative', ['kind:relative', 'gap']),
  ...examples('31-relative-clauses', 'fix-fronted-phrase', [
    'func:prenucleus',
    'kind:interrogative',
  ]),
  ...examples('32-comparative-clauses', 'fix-comparative', [
    'func:postnucleus',
    'kind:comparative',
    'anchor',
  ]),
  ...examples('34-infinitive-clauses', 'fix-infinitive', ['fin:infinitival', 'part:infinitival']),
  ...examples('35-participial-clauses', 'fix-garden-path', ['fin:participial']),
  ...examples('36-gerund-clauses', 'fix-gerund-after-preposition', ['fin:gerund-participial']),
  ...examples('37-passive-voice', 'fix-vtr', ['voice:active']),
  ...examples('37-passive-voice', 'fix-passive', ['voice:passive', 'aux:passive']),
  ...examples('38-sentence-edge-words', 'fix-interjection', ['form:Interj']),
  ...examples('38-sentence-edge-words', 'fix-supplement', ['func:supplement']),
  ...examples('39-punctuation-is-evidence', 'fix-exclamative-clause', ['kind:exclamative']),
];
