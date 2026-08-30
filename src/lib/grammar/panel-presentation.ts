import type { LabelOption, OptionGroup, OptionState } from './options.ts';
import type { NavigationResult } from './session.ts';

/**
 * Which group the palette shows after a decision — obeying the transaction,
 * not reconstructing it.
 *
 * The session says where to go (`NavigationResult`); the panel's one local
 * fact is whether the subject changed, because an instruction earned on one
 * selection must not pin the palette for the next. A wrong answer therefore
 * holds the learner beside the question they answered; everything else follows
 * the panel's own step, which is also where a new selection naturally opens.
 */
export function activeGroupAfterAnswer(
  subjectChanged: boolean,
  step: string | null,
  navigation: NavigationResult | null,
): string | null {
  if (subjectChanged || navigation === null) return step;
  if (navigation.kind === 'close') return null;
  return navigation.question;
}

/**
 * Suggestions belong in the panel header, where their evidence is visible.
 * The option list stays neutral so it does not repeat the answer as styling.
 */
export function menuOptionState(state: OptionState): OptionState {
  return state === 'suggested' ? 'available' : state;
}

/**
 * May the header replace a row's explanation with the generic constituency
 * demonstration? A refused row needs its own reason; covering that reason made
 * a rejected choice look unavailable merely because of the surrounding tree.
 */
export function shouldPerformSelectionTest(
  interactive: boolean,
  hasVerdict: boolean,
  panelBlocked: boolean,
  shownState?: OptionState,
): boolean {
  return (
    interactive &&
    !hasVerdict &&
    !panelBlocked &&
    shownState !== 'blocked' &&
    shownState !== 'untaught'
  );
}

/** The stable pane title for a group the learner sees often. */
export const GROUP_NAME: Record<string, string> = {
  'word-class': 'Word class',
  'phrase-form': 'Phrase type',
  'verb-type': 'Verb type',
  function: 'Syntactic function',
};

export interface MenuSection {
  name: string;
  options: LabelOption[];
}

/**
 * A group's options in named sections, presentation order.
 *
 * Every group ends with whatever the named lists did not claim. A row the
 * panel offers and the menu does not draw is a row nobody can pick, and three
 * were being dropped in silence: `Nom` and `DP`, which the corpus uses.
 */
export function menuSections(g: OptionGroup): MenuSection[] {
  const taken: string[] = [];
  const take = (name: string, keys: readonly string[]) => {
    // The key list is ordered by use in the course corpus. Look each key up in
    // that order instead of filtering the taxonomy, whose order answers a
    // different question.
    const options = keys.flatMap((key) =>
      g.options.filter((o) => (o.form ?? o.func ?? '') === key),
    );
    for (const o of options) taken.push(o.key);
    return { name, options };
  };
  const rest = (named: MenuSection[]): MenuSection[] =>
    [...named, { name: '', options: g.options.filter((o) => !taken.includes(o.key)) }].filter(
      (s) => s.options.length > 0,
    );

  if (g.id === 'word-class') {
    return rest([
      take('Content words', ['N', 'V', 'Adj', 'Adv']),
      take('Function words', ['Det', 'P', 'Pron', 'Subord', 'Conj', 'Aux', 'Part']),
      take('Other', ['Num', 'Interj']),
    ]);
  }
  if (g.id === 'phrase-form') {
    return rest([
      take('Phrases', ['NP', 'VP', 'Nom', 'PP', 'AdjP', 'AdvP', 'DP']),
      take('Clausal forms', ['S', 'Cl']),
    ]);
  }
  if (g.id === 'function') {
    return rest([
      take('Clause roles', [
        'subject',
        'predicate',
        'directObject',
        'indirectObject',
        'subjectComplement',
        'objectComplement',
        'adverbial',
      ]),
      take('Inside a phrase', [
        'head',
        'determiner',
        'premodifier',
        'postmodifier',
        'complement',
        'coordinate',
        'appositive',
      ]),
    ]);
  }
  return [{ name: '', options: g.options }];
}
