import type { Question, ReadingPassage, Topic, VocabularyWord } from '../types'

const q = (id: string, prompt: string, options: string[], answer: number, explanation: string, skill: string, level: string) =>
  ({ id, prompt, options, answer, explanation, skill, level })

export const grammarTopics: Topic[] = [
  { id: 'present-simple', title: 'Present simple', description: 'Describe routines, facts, and repeated actions accurately.', level: 'A1', progress: 0, lessons: 5, duration: 6, accent: '#e1eadc', questions: [
    q('ga1', 'My brother ___ coffee every morning.', ['drink', 'drinks', 'is drink', 'drinking'], 1, 'With he, she, or it in the present simple, add -s to the base verb.', 'Present simple', 'A1'),
    q('ga2', 'We ___ near the city centre.', ['lives', 'living', 'live', 'are live'], 2, 'With “we”, use the base form of the verb: live.', 'Present simple', 'A1'),
  ]},
  { id: 'be-questions', title: 'Be and basic questions', description: 'Build clear statements and questions with the verb be.', level: 'A1', progress: 0, lessons: 4, duration: 6, accent: '#e6e1d8', questions: [
    q('ga3', '___ they ready for the lesson?', ['Is', 'Are', 'Do', 'Does'], 1, 'Use “are” with the plural subject “they”.', 'Verb be', 'A1'),
    q('ga4', 'Where ___ your teacher from?', ['are', 'do', 'is', 'does'], 2, '“Teacher” is singular, so the correct form of be is “is”.', 'Verb be', 'A1'),
  ]},
  { id: 'past-simple', title: 'Past simple', description: 'Talk about completed events at a finished time.', level: 'A2', progress: 0, lessons: 6, duration: 7, accent: '#dce6e7', questions: [
    q('ga5', 'We ___ the museum last Saturday.', ['visit', 'have visited', 'visited', 'were visit'], 2, '“Last Saturday” is a finished past time, so use the past simple.', 'Past simple', 'A2'),
    q('ga6', 'She ___ see the message yesterday.', ["doesn't", "hasn't", "didn't", "wasn't"], 2, 'Past simple negatives use did not + base verb.', 'Past simple', 'A2'),
  ]},
  { id: 'comparatives', title: 'Comparatives', description: 'Compare people, places, ideas, and quantities.', level: 'A2', progress: 0, lessons: 5, duration: 7, accent: '#e8e0da', questions: [
    q('ga7', 'This exercise is ___ than the previous one.', ['difficult', 'more difficult', 'most difficult', 'the difficult'], 1, 'Long adjectives normally form the comparative with “more”.', 'Comparatives', 'A2'),
    q('ga8', 'Today is ___ than yesterday.', ['hotter', 'more hot', 'hottest', 'as hot'], 0, 'Short adjectives normally take -er; “hot” doubles the final consonant.', 'Comparatives', 'A2'),
  ]},
  { id: 'present-perfect', title: 'Present perfect', description: 'Connect past actions to the present with confidence.', level: 'B1', progress: 0, lessons: 6, duration: 8, accent: '#dce6da', questions: [
    q('g1', 'She ___ three reports so far this week.', ['writes', 'wrote', 'has written', 'had written'], 2, '“So far” describes an unfinished time period, so we use the present perfect: has + past participle.', 'Present perfect', 'B1'),
    q('g2', 'I ___ him since we graduated.', ["haven't seen", "didn't see", "don't see", "wasn't seeing"], 0, 'Use the present perfect with “since” for a state continuing from a past point until now.', 'Present perfect', 'B1'),
    q('g3', '___ you ever ___ to Edinburgh?', ['Did / go', 'Have / been', 'Are / going', 'Had / went'], 1, 'Use “have been” to ask about life experience when no finished time is mentioned.', 'Present perfect', 'B1'),
  ]},
  { id: 'articles', title: 'Articles in context', description: 'Choose a, an, the, or no article in real sentences.', level: 'B1', progress: 0, lessons: 5, duration: 7, accent: '#e8dfd3', questions: [
    q('g4', 'She wants to become ___ architect.', ['a', 'an', 'the', '—'], 1, 'Use “an” before a vowel sound. “Architect” begins with a vowel sound.', 'Articles', 'B1'),
    q('g5', '___ research published yesterday challenges the theory.', ['A', 'An', 'The', '—'], 2, '“The” identifies specific research—the research published yesterday.', 'Articles', 'B1'),
  ]},
  { id: 'modals', title: 'Modal verbs', description: 'Express possibility, obligation, and deduction.', level: 'B1', progress: 0, lessons: 7, duration: 9, accent: '#dbe2e9', questions: [
    q('g6', 'The lights are off. They ___ have left already.', ['must', 'should', 'can', 'ought'], 0, '“Must have” expresses a strong logical deduction about the past.', 'Modal verbs', 'B1'),
    q('g6b', 'You ___ submit the form today; tomorrow is also fine.', ["mustn't", "don't have to", "can't", "shouldn't have"], 1, '“Don’t have to” means there is no obligation; “mustn’t” means something is prohibited.', 'Modal verbs', 'B1'),
    q('g6c', 'She ___ be in the library, but I am not certain.', ['might', 'must not', 'has to', 'ought'], 0, '“Might” expresses a present possibility when the speaker is uncertain.', 'Modal verbs', 'B1'),
  ]},
  { id: 'reported-speech', title: 'Reported speech', description: 'Report statements and questions naturally.', level: 'B2', progress: 0, lessons: 6, duration: 10, accent: '#e5dce7', questions: [
    q('g7', '“I am working.” She said she ___ working.', ['is', 'has been', 'was', 'were'], 2, 'In reported speech after a past reporting verb, present continuous usually shifts to past continuous.', 'Reported speech', 'B2'),
    q('g7b', '“Where do you live?” He asked me where I ___.', ['do live', 'lived', 'did I live', 'am living'], 1, 'Reported questions use statement word order and normally backshift the tense.', 'Reported speech', 'B2'),
    q('g7c', '“Don’t touch it.” She warned us ___ it.', ['not touching', "don't touch", 'not to touch', 'to not touching'], 2, 'Negative reported commands use not + to-infinitive.', 'Reported speech', 'B2'),
  ]},
  { id: 'passive-voice', title: 'Passive voice', description: 'Shift focus from the doer to an action or result.', level: 'B2', progress: 0, lessons: 6, duration: 9, accent: '#dbe6e2', questions: [
    q('gb1', 'The final decision ___ tomorrow.', ['will announce', 'will be announced', 'is announcing', 'has announce'], 1, 'The decision receives the action, so use the future passive: will be + past participle.', 'Passive voice', 'B2'),
    q('gb2', 'The bridge ___ in 1890.', ['built', 'was built', 'has built', 'was building'], 1, 'Use was + past participle for a completed passive action in the past.', 'Passive voice', 'B2'),
  ]},
  { id: 'relative-clauses', title: 'Relative clauses', description: 'Add precise information without creating repetitive sentences.', level: 'B2', progress: 0, lessons: 5, duration: 8, accent: '#e5e2d8', questions: [
    q('gb3', 'The report, ___ was published yesterday, received wide attention.', ['that', 'what', 'which', 'where'], 2, 'A non-defining relative clause about a thing uses “which”, not “that”.', 'Relative clauses', 'B2'),
    q('gb4', 'The researcher ___ work we discussed will speak today.', ['who', 'whose', 'which', 'whom'], 1, '“Whose” shows that the work belongs to the researcher.', 'Relative clauses', 'B2'),
  ]},
  { id: 'advanced-linking', title: 'Advanced linking', description: 'Signal contrast, consequence, and concession precisely.', level: 'C1', progress: 0, lessons: 6, duration: 10, accent: '#e2ddea', questions: [
    q('gc1', 'The evidence was limited. ___, the team published a cautious conclusion.', ['Nevertheless', 'Therefore', 'Similarly', 'For instance'], 0, '“Nevertheless” signals concession: the second action happened despite the limitation.', 'Linking structures', 'C1'),
    q('gc2', 'The policy reduced costs, ___ at the expense of service quality.', ['albeit', 'therefore', 'whereas', 'moreover'], 0, '“Albeit” introduces a concise concession and means “although it was”.', 'Linking structures', 'C1'),
  ]},
]

export const complexTopics: Topic[] = [
  { id: 'mixed-conditionals', title: 'Mixed conditionals', description: 'Connect hypothetical past causes with present results.', level: 'B2 → C1', progress: 0, lessons: 5, duration: 10, accent: '#dfe4d8', questions: [
    q('c1', 'If I ___ medicine at university, I would be a doctor now.', ['studied', 'had studied', 'would study', 'have studied'], 1, 'This mixed conditional links an unreal past condition to a present result: if + past perfect, would + base verb.', 'Mixed conditionals', 'C1'),
    q('c2', 'If she were more organized, she ___ the deadline yesterday.', ["wouldn't miss", "wouldn't have missed", "hadn't missed", "didn't miss"], 1, 'A present characteristic causes a past result, so use were + would have + past participle.', 'Mixed conditionals', 'C1'),
  ]},
  { id: 'inversion', title: 'Inversion for emphasis', description: 'Create formal emphasis with negative adverbials.', level: 'C1', progress: 0, lessons: 6, duration: 12, accent: '#e7ddd4', questions: [
    q('c3', 'Rarely ___ such a compelling argument.', ['I have heard', 'have I heard', 'I heard', 'did I have heard'], 1, 'After a negative adverbial at the beginning, invert the auxiliary and subject: “Rarely have I heard...”', 'Inversion', 'C1'),
    q('c3b', 'Not until the final chapter ___ the connection.', ['I understood', 'did I understand', 'I did understand', 'understood I'], 1, 'When “not until” begins the sentence, invert the auxiliary in the main clause.', 'Inversion', 'C1'),
    q('c3c', 'Under no circumstances ___ confidential data.', ['you should share', 'should you share', 'you share', 'share you should'], 1, 'A fronted negative phrase triggers auxiliary-subject inversion.', 'Inversion', 'C1'),
  ]},
  { id: 'participle-clauses', title: 'Participle clauses', description: 'Write concise, sophisticated complex sentences.', level: 'C1', progress: 0, lessons: 5, duration: 11, accent: '#d9e3e4', questions: [
    q('c4', '___ the data, the team revised its conclusion.', ['Analyzing', 'Having analyzed', 'Was analyzed', 'To analyzing'], 1, '“Having analyzed” makes it clear that the analysis was completed before the revision.', 'Participle clauses', 'C1'),
    q('c4b', '___ by the unexpected result, the researchers repeated the test.', ['Surprising', 'Surprised', 'Having surprise', 'Were surprised'], 1, 'A past participle clause describes the passive feeling of the researchers.', 'Participle clauses', 'C1'),
    q('c4c', '___ along the coast, the path offers excellent views.', ['Running', 'Run', 'Having run', 'Was running'], 0, 'The present participle describes the path’s position as it extends along the coast.', 'Participle clauses', 'C1'),
  ]},
  { id: 'cleft', title: 'Cleft sentences', description: 'Shift emphasis with it-clefts and wh-clefts.', level: 'C1', progress: 0, lessons: 4, duration: 9, accent: '#e5dfeb', questions: [
    q('c5', '___ I need is a clear explanation.', ['That', 'What', 'It', 'Which'], 1, 'A wh-cleft begins with “What” and highlights the complement after “is”.', 'Cleft sentences', 'C1'),
    q('c5b', 'It was the final example ___ convinced the audience.', ['what', 'where', 'that', 'whoever'], 2, 'An it-cleft uses “It was ... that” to emphasise a thing.', 'Cleft sentences', 'C1'),
    q('c5c', 'The reason ___ she resigned was the lack of support.', ['what', 'why', 'which', 'whose'], 1, 'A reason cleft uses “The reason why ... was ...”.', 'Cleft sentences', 'C1'),
  ]},
  { id: 'advanced-passive', title: 'Advanced passive structures', description: 'Use reporting passives and complex passive patterns.', level: 'B2 → C1', progress: 0, lessons: 6, duration: 11, accent: '#e2e8df', questions: [
    q('c6', 'The treatment is believed ___ highly effective.', ['being', 'to be', 'that it is', 'be'], 1, 'A reporting passive uses subject + passive reporting verb + to-infinitive.', 'Advanced passive', 'C1'),
    q('c7', 'The documents appear ___ before the investigation began.', ['to destroy', 'to have been destroyed', 'being destroyed', 'having destroyed'], 1, 'Use the perfect passive infinitive for an earlier passive event.', 'Advanced passive', 'C1'),
  ]},
  { id: 'reduced-relatives', title: 'Reduced relative clauses', description: 'Condense relative clauses while keeping meaning clear.', level: 'B2 → C1', progress: 0, lessons: 5, duration: 10, accent: '#e8e1d9', questions: [
    q('c8', 'Students ___ for the programme must submit two references.', ['apply', 'applied', 'applying', 'are applying'], 2, '“Applying” reduces “who are applying” in an active relative clause.', 'Reduced relatives', 'C1'),
    q('c9', 'The data ___ in the survey was anonymised.', ['collecting', 'collected', 'was collected', 'collect'], 1, '“Collected” reduces the passive clause “that was collected”.', 'Reduced relatives', 'C1'),
  ]},
  { id: 'nominalisation', title: 'Nominalisation', description: 'Create concise academic prose by shifting verbs into nouns.', level: 'C1', progress: 0, lessons: 5, duration: 12, accent: '#dce5e7', questions: [
    q('c10', 'The committee decided to expand the study. Choose the best nominalisation.', ['The committee made an expansion decision of the study.', 'The committee’s decision led to the expansion of the study.', 'The study was decide to expand.', 'Deciding, the study expanded.'], 1, '“Decision” and “expansion” create a concise and grammatically controlled academic sentence.', 'Nominalisation', 'C1'),
    q('c11', 'Choose the noun form of “assess”.', ['assessive', 'assessment', 'assessing', 'assession'], 1, '“Assessment” is the standard noun form of “assess”.', 'Nominalisation', 'C1'),
    q('c12', 'Which sentence uses nominalisation most effectively?', ['They investigated and then they discovered.', 'The investigation resulted in a significant discovery.', 'Investigating was discovering significantly.', 'They did an investigate of discovery.'], 1, '“Investigation” and “discovery” condense the actions into controlled academic noun phrases.', 'Nominalisation', 'C1'),
  ]},
]

export const vocabulary: VocabularyWord[] = [
  { id: 'v1', word: 'significant', pronunciation: '/sɪɡˈnɪfɪkənt/', level: 'B2', definition: 'Important or large enough to have a noticeable effect.', example: 'The study found a significant increase in productivity.', synonyms: ['notable', 'substantial', 'meaningful'], antonyms: ['insignificant', 'minor'], collocations: ['significant impact', 'significant increase', 'significant difference'], family: ['significance', 'significantly', 'signify'], mastery: 82 },
  { id: 'v2', word: 'derive', pronunciation: '/dɪˈraɪv/', level: 'B2', definition: 'To obtain something from a particular source.', example: 'Many English words derive from Latin.', synonyms: ['obtain', 'gain', 'originate'], collocations: ['derive benefit', 'derive meaning', 'derive from'], family: ['derivation', 'derivative'], mastery: 34 },
  { id: 'v3', word: 'subsequent', pronunciation: '/ˈsʌbsɪkwənt/', level: 'C1', definition: 'Happening after something else.', example: 'Subsequent studies confirmed the original finding.', synonyms: ['following', 'later', 'succeeding'], antonyms: ['previous', 'preceding'], collocations: ['subsequent events', 'subsequent research', 'subsequent years'], family: ['subsequently'], mastery: 41 },
  { id: 'v4', word: 'contribute', pronunciation: '/kənˈtrɪbjuːt/', level: 'B1', definition: 'To help cause or bring about a result.', example: 'Regular reading contributes to a broader vocabulary.', synonyms: ['add', 'provide', 'help'], collocations: ['contribute to', 'contribute significantly', 'make a contribution'], family: ['contribution', 'contributor'], mastery: 75 },
  { id: 'v5', word: 'plausible', pronunciation: '/ˈplɔːzəbəl/', level: 'C1', definition: 'Seeming reasonable or likely to be true.', example: 'The researchers offered a plausible explanation.', synonyms: ['credible', 'believable', 'reasonable'], antonyms: ['implausible', 'unlikely'], collocations: ['plausible explanation', 'entirely plausible', 'seem plausible'], family: ['plausibility', 'plausibly'], mastery: 18 },
  { id: 'v6', word: 'allocate', pronunciation: '/ˈæləkeɪt/', level: 'B2', definition: 'To distribute resources for a particular purpose.', example: 'The university allocated additional funds to student support.', synonyms: ['assign', 'distribute', 'designate'], collocations: ['allocate resources', 'allocate funds', 'allocate time'], family: ['allocation', 'allocated'], mastery: 26 },
  { id: 'v7', word: 'coherent', pronunciation: '/kəʊˈhɪərənt/', level: 'C1', definition: 'Logical, consistent, and easy to understand.', example: 'A coherent argument connects every example to its central claim.', synonyms: ['logical', 'consistent', 'clear'], antonyms: ['incoherent', 'confused'], collocations: ['coherent argument', 'coherent account', 'internally coherent'], family: ['coherence', 'coherently'], mastery: 46 },
  { id: 'v8', word: 'diminish', pronunciation: '/dɪˈmɪnɪʃ/', level: 'B2', definition: 'To become or make something smaller or less important.', example: 'The effect gradually diminished over several weeks.', synonyms: ['decrease', 'reduce', 'weaken'], antonyms: ['increase', 'strengthen'], collocations: ['diminish rapidly', 'diminish the impact', 'returns diminish'], family: ['diminished', 'diminishing'], mastery: 38 },
  { id: 'v9', word: 'constraint', pronunciation: '/kənˈstreɪnt/', level: 'C1', definition: 'A limitation or restriction that affects what can be done.', example: 'Time was the main constraint on the research project.', synonyms: ['restriction', 'limitation', 'obstacle'], collocations: ['time constraint', 'financial constraint', 'under constraints'], family: ['constrain', 'constrained'], mastery: 22 },
  { id: 'v10', word: 'enhance', pronunciation: '/ɪnˈhɑːns/', level: 'B2', definition: 'To improve the quality, value, or effectiveness of something.', example: 'Regular feedback can enhance the learning process.', synonyms: ['improve', 'strengthen', 'boost'], antonyms: ['diminish', 'weaken'], collocations: ['enhance performance', 'enhance understanding', 'greatly enhance'], family: ['enhancement', 'enhanced'], mastery: 54 },
]

export const vocabularyQuestions: Question[] = [
  q('vq1','Which definition best matches “significant”?',['Easy to ignore','Important enough to have an effect','Happening by accident','Related to money'],1,'“Significant” describes something important or large enough to produce a noticeable effect.','Definition','B2'),
  q('vq2','Choose the natural collocation. The council will ___ resources to the project.',['allocate','derive','diminish','contribute'],0,'“Allocate resources” is a common academic collocation meaning to assign resources for a purpose.','Collocation','B2'),
  q('vq3','Which word is closest in meaning to “plausible”?',['temporary','credible','subsequent','significant'],1,'A plausible explanation is credible or believable.','Synonym','C1'),
  q('vq4','Many modern terms ___ older scientific vocabulary.',['derive from','contribute for','allocate with','enhance at'],0,'The verb pattern is “derive from”, meaning to originate from a source.','Sentence completion','B2'),
  q('vq5','Choose the correct word form: The essay lacks logical ___.',['coherent','coherently','coherence','cohere'],2,'After “logical” we need the noun “coherence”.','Word form','C1'),
  q('vq6','Regular retrieval practice can ___ long-term memory.',['constraint','enhance','subsequent','allocation'],1,'“Enhance” is a verb meaning improve or strengthen.','Fill in the blank','B2'),
]

export const readings: ReadingPassage[] = [
  { id: 'r1', title: 'The quiet return of urban wetlands', category: 'Environment', level: 'B2', minutes: 7, text: [
    'For much of the twentieth century, urban planners treated wetlands as wasted space. Marshy areas were drained or paved over to make room for roads and buildings. Today, a growing number of cities are reversing that approach—not primarily for beauty, but because wetlands perform practical work that conventional infrastructure often does poorly.',
    'A restored wetland can absorb heavy rainfall, reducing pressure on drainage systems during storms. Plants and soil filter pollutants before water reaches rivers, while the habitat supports birds and insects. Unlike concrete flood barriers, wetlands may become more effective as vegetation matures.',
    'Restoration is not simple. Projects need space, long-term maintenance, and support from nearby communities. Yet planners increasingly view these constraints as manageable when compared with the rising cost of floods and water treatment. The return of wetlands reflects a wider change: cities are beginning to treat natural systems as essential infrastructure rather than decoration.'
  ], questions: [
    q('r1q1', 'What is the main idea of the passage?', ['Wetlands are mainly valuable because they attract rare birds.', 'Cities are restoring wetlands as practical infrastructure with multiple benefits.', 'Concrete flood barriers should immediately be removed.', 'Urban planning was more effective in the twentieth century.'], 1, 'The passage centers on the shift toward using restored wetlands as functional urban infrastructure.', 'Main Idea', 'B2'),
    q('r1q2', 'What can be inferred about mature wetlands?', ['They may offer stronger protection over time.', 'They no longer require community support.', 'They are cheaper to build than roads.', 'They eliminate every type of pollution.'], 0, 'The text says wetlands may become more effective as vegetation matures, supporting this inference.', 'Inference', 'B2'),
    q('r1q3', 'In paragraph 3, “these constraints” refers to…', ['floods and water treatment', 'birds and insects', 'space, maintenance, and public support', 'rivers and drainage systems'], 2, 'The phrase points back to the three challenges listed directly before it.', 'Reference Words', 'B2'),
  ]},
  { id: 'r2', title: 'Why productive struggle matters', category: 'Learning science', level: 'B1+', minutes: 6, text: [
    'Students often assume that easy learning is effective learning. When information feels fluent, they believe it will be easy to remember. Research suggests the opposite can be true. A moderate level of difficulty—sometimes called productive struggle—can make learning more durable.',
    'Trying to retrieve an answer before seeing it strengthens memory, even when the first attempt fails. The important condition is that learners receive useful feedback soon afterward. Difficulty without guidance creates frustration; difficulty followed by explanation creates learning.',
    'This does not mean every task should be hard. Effective practice moves between challenge and support. The goal is not discomfort itself, but the mental effort required to connect and retrieve ideas.'
  ], questions: [
    q('r2q1', 'Which statement best summarizes the passage?', ['Learning works best when it always feels easy.', 'Useful difficulty plus timely feedback can strengthen learning.', 'Incorrect answers should be avoided during practice.', 'Memory depends entirely on repeated reading.'], 1, 'All three paragraphs develop the idea that moderate challenge, supported by feedback, helps learning last.', 'Main Idea', 'B1+'),
    q('r2q2', 'Why does the author distinguish two kinds of difficulty?', ['To show that challenge is helpful only with support.', 'To argue that frustration is necessary.', 'To compare two research methods.', 'To recommend harder exams.'], 0, 'The contrast clarifies that difficulty becomes productive when followed by guidance.', "Author's Purpose", 'B1+'),
    q('r2q3', 'In paragraph 1, “fluent” most nearly means…', ['spoken in several languages', 'smooth and easy to process', 'scientifically accurate', 'repeated many times'], 1, 'Here, fluent describes information that feels easy to process, not language ability.', 'Vocabulary in Context', 'B1+'),
  ]},
  { id:'r3', title:'The hidden value of repair cafés', category:'Society', level:'B1+', minutes:6, text:[
    'In many cities, broken household objects are more likely to be replaced than repaired. Repair cafés challenge that habit. At these volunteer-run events, visitors bring damaged lamps, clothing, bicycles, and small appliances. Experienced volunteers help diagnose the problem and show owners how to fix it.',
    'The immediate benefit is less waste, but organisers describe a second effect. People who once felt unable to repair anything begin to understand how everyday objects work. The events also connect neighbours who might not otherwise meet.',
    'Repair cafés cannot solve the global waste problem alone. Some products remain deliberately difficult to open or require unavailable parts. Even so, the movement demonstrates that repair can be a shared skill rather than a specialist service.'
  ],questions:[
    q('r3q1','Which benefit is NOT directly mentioned?',['Reducing waste','Building practical confidence','Connecting neighbours','Creating paid employment'],3,'The text mentions waste, confidence, and community connection, but not paid employment.','Supporting Details','B1+'),
    q('r3q2','What does “that habit” refer to?',['Meeting neighbours','Replacing rather than repairing objects','Running volunteer events','Manufacturing spare parts'],1,'The phrase refers to the preceding habit of replacing broken items instead of repairing them.','Reference Words','B1+'),
    q('r3q3','Why does the author mention products that are difficult to open?',['To acknowledge a limitation of repair cafés','To advertise better products','To blame volunteers','To explain how appliances are built'],0,'The example qualifies the argument by acknowledging that community repair has practical limits.','Author\'s Purpose','B1+'),
    q('r3q4','What is the main idea of the passage?',['Repair cafés reduce waste while sharing practical knowledge and building community, despite limits.','All broken appliances can be repaired by volunteers.','Manufacturers should employ repair-café visitors.','Repair is valuable only when it saves money.'],0,'The answer combines the environmental, learning, and social value of repair cafés while recognizing their limitations.','Main Idea','B1+'),
  ]},
  { id:'r4', title:'Rethinking the four-day workweek', category:'Work', level:'B2', minutes:8, text:[
    'Trials of four-day workweeks often attract attention because employees receive an extra day away from work. The more important change, however, may happen inside the remaining four days. Participating organisations usually redesign meetings, reduce unnecessary reporting, and protect periods of uninterrupted work.',
    'Results vary. Some teams maintain output while reporting lower stress, whereas organisations with continuous customer demand may need complex rotating schedules. A shorter week is therefore not a single policy that can simply be copied from one workplace to another.',
    'The trials are valuable because they force organisations to measure work by outcomes rather than visible hours. Whether or not a company adopts the schedule permanently, examining which tasks create value can reveal inefficiencies that were previously accepted as normal.'
  ],questions:[
    q('r4q1','What is the central argument?',['Every organisation should close on Fridays.','The main value of shorter-week trials is that they encourage better work design and measurement.','Employees work less in every four-day trial.','Customer service is incompatible with shorter weeks.'],1,'The passage focuses on redesigned work and outcome-based measurement, not merely the extra day off.','Main Idea','B2'),
    q('r4q2','What can be inferred about meetings in some organisations?',['They may consume time without adding enough value.','They must all be removed.','Employees prefer longer meetings.','They are required only in customer service.'],0,'Reducing unnecessary meetings to protect focused work implies that some meetings were not valuable enough.','Inference','B2'),
    q('r4q3','In this passage, “output” most nearly means…',['a company announcement','work produced','employee attendance','financial cost'],1,'In context, maintaining output means producing the same amount or result of work.','Vocabulary in Context','B2'),
  ]},
  { id:'r5', title:'When maps shape decisions', category:'Technology', level:'C1', minutes:9, text:[
    'Maps appear to present neutral descriptions of the world, yet every map is a collection of choices. A designer decides what to include, what to omit, which boundaries to emphasise, and how colour should guide attention. These decisions are unavoidable because a map that displayed everything would communicate almost nothing.',
    'Digital maps add another layer of selection. Routes may be ranked by speed, popularity, commercial partnerships, or assumptions about how a person travels. Users rarely see those priorities, but they can influence which neighbourhoods receive visitors and which businesses remain visible.',
    'Recognising this influence does not make maps untrustworthy. Instead, it encourages a more useful question: not whether a map is biased, but whether its choices are appropriate for the decision at hand.'
  ],questions:[
    q('r5q1','Which statement is supported by the passage?',['A completely neutral map can display all available information.','Digital routes are always ranked by speed alone.','Map design necessarily involves selecting and prioritising information.','Commercial partnerships make maps unusable.'],2,'The author repeatedly explains that selection is unavoidable in both physical and digital maps.','True / False / Not Given','C1'),
    q('r5q2','What is the author’s main purpose?',['To reject digital navigation','To show how mapping choices influence understanding and decisions','To teach readers how to draw boundaries','To compare map colours'],1,'The passage explains that apparently neutral maps contain choices that shape attention and action.','Author\'s Purpose','C1'),
    q('r5q3','Which option best paraphrases the final paragraph?',['All biased maps should be distrusted.','The useful issue is whether a map’s selections fit its intended use.','Maps should avoid making choices.','Users should design their own maps.'],1,'This option restates the distinction between unavoidable selection and appropriate selection.','Paraphrase Recognition','C1'),
    q('r5q4','What is the main idea of the passage?',['Maps inevitably prioritize information, so users should judge whether those choices suit the decision being made.','Digital maps should display every possible route equally.','Physical maps are neutral, while digital maps are biased.','A useful map should contain as much information as possible.'],0,'The answer captures both the unavoidable selectivity of maps and the author’s recommendation to evaluate those choices in context.','Main Idea','C1'),
  ]},
  { id:'r6', title:'Farming above the street', category:'Food systems', level:'B1+', minutes:7, text:[
    'Unused roofs are increasingly being considered as places to grow food. Rooftop farms can shorten the distance between producers and urban customers, make use of overlooked space, and provide insulation that reduces heat entering a building. Some projects also invite local schools and residents to learn how food is produced.',
    'However, a successful rooftop farm requires more than carrying soil upstairs. Engineers must confirm that a building can support the additional weight, while growers need safe access to water and sunlight. Wind exposure can damage plants, and transporting equipment through occupied buildings may be difficult.',
    'For these reasons, rooftop agriculture is unlikely to replace rural farming. Its value lies instead in supplying selected fresh crops, testing efficient growing methods, and reconnecting city residents with food production. It works best as one part of a wider urban food strategy.'
  ],questions:[
    q('r6q1','What is the main idea of the passage?',['Rooftop farms can complement urban food systems when their practical limits are carefully managed.','Cities should replace rural farms with rooftop gardens.','Every building is strong enough to support a farm.','The main purpose of rooftop farming is to insulate buildings.'],0,'The passage presents several benefits, acknowledges structural and operational constraints, and concludes that rooftop farms are a complementary strategy.','Main Idea','B1+'),
    q('r6q2','Which requirement is directly mentioned?',['Permission to sell food internationally','A structural assessment of the building','Artificial light on every roof','Removing residents from the building'],1,'The second paragraph states that engineers must confirm the building can carry the added weight.','Supporting Details','B1+'),
    q('r6q3','What can be inferred about the crops grown on rooftops?',['They should be chosen to suit the limited setting.','They will always cost less than rural crops.','They require no water during summer.','They must be sold to schools.'],0,'The conclusion says rooftop farms supply selected fresh crops, suggesting that crop choice must fit the conditions.','Inference','B1+'),
  ]},
  { id:'r7', title:'Bringing back the night sky', category:'Urban design', level:'B2', minutes:8, text:[
    'Artificial light has made streets safer and extended economic activity after sunset, but poorly directed lighting creates costs that are easy to overlook. Light spilling upward hides stars, disrupts the movement and feeding of nocturnal animals, and can enter homes where it interferes with sleep.',
    'Reducing light pollution does not require cities to become dark. Shielded lamps send light toward paths rather than into the sky, warmer colours affect many species less severely, and motion controls can reduce brightness when streets are empty. Careful design may therefore improve visibility while using less electricity.',
    'The difficult question is not whether light is useful, but how much is needed, where, and at what time. Effective policies combine technical standards with local observation because a busy transport station and a quiet residential park do not require identical solutions.'
  ],questions:[
    q('r7q1','Which statement best summarizes the passage?',['Cities can reduce the harms of artificial light through targeted design rather than eliminating nighttime lighting.','Streetlights should be removed from all residential areas.','Light pollution affects astronomy but has no other consequences.','Brighter lighting always produces safer streets.'],0,'The passage argues for place-specific, carefully directed lighting that preserves benefits while reducing harm.','Main Idea','B2'),
    q('r7q2','Why does the author compare a transport station with a park?',['To show that lighting requirements depend on context','To recommend closing parks at night','To prove stations use warmer lamps','To compare electricity prices'],0,'The comparison illustrates why one lighting rule cannot meet the needs of every place.','Author\'s Purpose','B2'),
    q('r7q3','In paragraph 1, “spilling upward” describes light that…',['is directed where it is not needed','becomes warmer in colour','is reflected only by stars','switches on when people move'],0,'The phrase refers to wasted light travelling into the sky instead of illuminating the intended area.','Vocabulary in Context','B2'),
  ]},
  { id:'r8', title:'Who should hold the past?', category:'Culture', level:'C1', minutes:9, text:[
    'Museums in former imperial centres hold objects acquired through trade, excavation, military campaigns, and colonial administration. Requests for their return are sometimes discussed as if every object had the same history. In reality, records of acquisition range from clear evidence of coercion to documented purchases whose fairness is still disputed.',
    'Repatriation can restore cultural authority and allow communities to interpret objects within living traditions. Yet return is not the only possible relationship. Joint custody, long-term loans, shared research, and digital access may be appropriate when ownership is uncertain or when several communities have legitimate connections to an object.',
    'A credible process therefore depends less on one universal rule than on transparent investigation and meaningful participation by source communities. Museums must disclose evidence, acknowledge gaps in their records, and accept that legal ownership alone may not settle questions of ethical responsibility.'
  ],questions:[
    q('r8q1','What is the central argument?', ['All museum objects should immediately return to their country of origin.','Repatriation decisions require transparent, case-specific investigation and participation rather than a single rule.','Digital access makes physical ownership irrelevant.','Legal ownership always resolves ethical disputes.'],1,'The passage emphasizes varied histories and argues for transparent, participatory decisions tailored to each case.','Main Idea','C1'),
    q('r8q2','What can be inferred about museum records?', ['They may be incomplete even when an institution claims legal ownership.','They always prove that objects were stolen.','They are controlled by source communities.','They are unnecessary when digital copies exist.'],0,'The final paragraph asks museums to acknowledge gaps, implying that legal claims can rest on incomplete documentation.','Inference','C1'),
    q('r8q3','The phrase “living traditions” emphasizes that cultural objects…',['remain connected to present-day community practices','must be stored in climate-controlled buildings','were all produced recently','have value only during ceremonies'],0,'The wording presents culture as continuing in the present rather than existing only as historical evidence.','Vocabulary in Context','C1'),
  ]},
  { id:'r9', title:'Heat pumps in cold places', category:'Energy', level:'B2', minutes:8, text:[
    'Heat pumps move heat rather than creating it by burning fuel. Even cold outdoor air contains thermal energy, which a pump can concentrate and transfer indoors. Modern systems can therefore operate in climates once considered unsuitable, often delivering several units of heat for each unit of electricity used.',
    'Performance still falls as temperatures drop, and poorly insulated buildings may require large or expensive systems. Electricity networks must also handle winter demand, especially when many homes switch technologies at the same time. Installation quality and accurate sizing are as important as the equipment itself.',
    'Debate about heat pumps is sometimes reduced to whether they work in cold weather. A more useful question is what supporting changes allow them to work well. Building insulation, trained installers, suitable tariffs, and stronger electricity networks can turn a technically possible device into a reliable low-carbon heating system.'
  ],questions:[
    q('r9q1','What is the main idea?', ['Heat pumps can support low-carbon heating in cold climates when buildings, installation, and energy systems are prepared for them.','Heat pumps create heat by burning electricity.','Cold regions should avoid all electric heating.','Insulation makes heating equipment unnecessary.'],0,'The text says the technology works in cold climates but stresses the supporting conditions needed for reliable performance.','Main Idea','B2'),
    q('r9q2','Which factor is NOT identified as supporting successful adoption?', ['Trained installers','Improved insulation','Stronger electricity networks','Warmer winter weather'],3,'The passage discusses preparation and infrastructure, not relying on warmer weather.','Supporting Details','B2'),
    q('r9q3','Why does the author mention “several units of heat”?',['To explain the efficiency advantage of moving heat','To compare the size of different homes','To calculate installation costs','To show that outdoor air is warm'],0,'This detail explains that heat output can exceed the electrical energy used because the system transfers existing heat.','Author\'s Purpose','B2'),
  ]},
  { id:'r10', title:'The case for slower science', category:'Research', level:'C1', minutes:9, text:[
    'Scientific institutions often reward visible output: frequent papers, rapid results, and early claims of novelty. These incentives can accelerate discovery, but they can also discourage researchers from checking fragile findings, documenting failed methods, or maintaining datasets that produce no immediate publication.',
    'Advocates of “slow science” do not necessarily oppose speed. They argue that different stages of research require different rhythms. An urgent clinical trial may need rapid coordination, whereas a long ecological study loses much of its value if funding ends before meaningful patterns become visible.',
    'The broader proposal is to judge research by the reliability and usefulness of its contribution rather than by a uniform measure of output. That change would require funders and universities to value replication, careful documentation, shared tools, and long-term observation alongside headline results.'
  ],questions:[
    q('r10q1','Which option best states the author’s main point?', ['All scientific research should proceed slowly.','Research quality improves when institutions support the pace appropriate to each task and reward reliable contributions.','Publishing frequently always produces unreliable science.','Long ecological studies are more useful than clinical trials.'],1,'The author rejects a simple speed-versus-slowness choice and argues for suitable timelines and broader measures of value.','Main Idea','C1'),
    q('r10q2','What is implied about current research incentives?', ['They may undervalue work that strengthens reliability without producing quick headlines.','They prevent researchers from publishing new findings.','They focus mainly on ecological research.','They already reward failed experiments more than successful ones.'],0,'The first and final paragraphs contrast visible outputs with replication, documentation, and maintenance work.','Inference','C1'),
    q('r10q3','Why are clinical trials and ecological studies contrasted?', ['To illustrate that appropriate research speed depends on purpose','To argue that medicine receives too much funding','To identify two unreliable methods','To show that all studies should have longer deadlines'],0,'The two examples demonstrate why one fixed pace is unsuitable for every kind of research.','Author\'s Purpose','C1'),
  ]},
  { id:'r11', title:'Warnings that communities can use', category:'Communication', level:'B2', minutes:8, text:[
    'During floods, fires, and storms, emergency agencies often translate official warnings into several languages. Translation increases access, but a grammatically accurate message may still fail if it arrives through an unfamiliar channel, uses technical terms, or assumes knowledge that residents do not possess.',
    'Some authorities now work with community organisations before disasters occur. Local partners identify trusted radio stations and messaging groups, test whether instructions are clear, and explain cultural factors that may affect evacuation. They can also send questions back to officials when a warning creates confusion.',
    'This approach treats communication as a relationship rather than a one-way transfer of words. Professional translation remains essential, but its effectiveness depends on preparation, trusted messengers, and opportunities for communities to respond.'
  ],questions:[
    q('r11q1','What is the passage mainly arguing?', ['Effective multilingual emergency communication requires trusted community partnerships as well as accurate translation.','Technical vocabulary makes emergency warnings more reliable.','Community organisations should replace emergency agencies.','Warnings work best when sent through a single official channel.'],0,'The passage consistently argues that translation must be supported by preparation, trusted channels, and two-way communication.','Main Idea','B2'),
    q('r11q2','What can local partners do before a disaster?', ['Test whether instructions are understandable','Predict the exact date of an emergency','Write laws for national agencies','Prevent every warning from causing confusion'],0,'The second paragraph directly states that community partners can test instructions and identify trusted channels.','Supporting Details','B2'),
    q('r11q3','What does “one-way transfer” suggest?', ['Information is delivered without meaningful feedback from recipients.','Messages are translated into only one language.','Residents communicate without government involvement.','Warnings travel through a single road.'],0,'The phrase contrasts simple delivery with a relationship in which communities can ask questions and respond.','Vocabulary in Context','B2'),
  ]},
  { id:'r12', title:'The climate value beneath seagrass', category:'Marine science', level:'B2', minutes:8, text:[
    'Seagrass meadows occupy a small share of the ocean floor, yet they can store substantial amounts of carbon. Their leaves slow water movement and trap organic material, while roots hold carbon-rich sediment in place. The same habitat shelters young fish and protects some coastlines from erosion.',
    'These benefits have encouraged restoration projects, but planting seagrass is not enough if the conditions that destroyed it remain. Polluted runoff can block sunlight, anchors can tear the seabed, and construction can alter currents. In unsuitable water, newly planted shoots may disappear within months.',
    'Restoration should therefore follow protection and careful diagnosis. Improving water quality and reducing physical disturbance may allow a meadow to recover naturally; planting is most useful where the original pressures have already been controlled. Carbon targets should support this ecological work rather than turn every project into a race to count planted shoots.'
  ],questions:[
    q('r12q1','Which statement best summarizes the passage?', ['Seagrass restoration succeeds when underlying environmental pressures are addressed before planting.','Planting the largest possible number of shoots guarantees carbon storage.','Seagrass is valuable only because it shelters fish.','Natural recovery never occurs without planting.'],0,'The text explains seagrass benefits but centers on the need to remove causes of decline before restoration.','Main Idea','B2'),
    q('r12q2','Why might newly planted seagrass disappear?', ['The original water-quality or physical pressures may continue.','Its roots store too much carbon.','Young fish eat every new shoot.','Coastal erosion always increases after planting.'],0,'The second paragraph connects failed planting with continuing pollution, anchoring, or altered currents.','Inference','B2'),
    q('r12q3','In the final sentence, the “race” is criticized because it may…', ['prioritize an easy number over lasting ecological recovery','make seagrass grow too slowly','prevent scientists from measuring carbon','reduce public interest in climate policy'],0,'Counting planted shoots can reward visible activity without showing whether the ecosystem will survive.','Author\'s Purpose','B2'),
  ]},
  { id:'r13', title:'When software screens job applicants', category:'Technology and work', level:'C1', minutes:9, text:[
    'Employers use automated systems to rank applications, analyse online tests, and sometimes assess recorded interviews. Supporters argue that software can process large applicant pools consistently. Yet consistency is not the same as fairness: a system can apply the same flawed rule to everyone.',
    'Bias may enter through historical hiring data, indirect indicators of social background, or performance measures that favour people with particular technology and time. Applicants usually cannot see which factors affected their score, making errors difficult to challenge. Even a statistically accurate model may reject unusual candidates who could succeed.',
    'Responsible use requires more than removing sensitive variables such as gender or ethnicity. Employers need evidence that assessments relate to actual job performance, regular checks for unequal outcomes, accessible alternatives, and a clear route for human review. Automation can assist judgment, but it should not make accountability disappear.'
  ],questions:[
    q('r13q1','What is the central argument of the passage?', ['Automated hiring may improve processing, but it requires validation, oversight, and accountable human review.','Software is always less fair than a human recruiter.','Removing names from applications eliminates every form of bias.','Unusual candidates cannot perform jobs successfully.'],0,'The author acknowledges efficiency while arguing that fairness requires evidence, monitoring, alternatives, and accountability.','Main Idea','C1'),
    q('r13q2','Why does the author distinguish consistency from fairness?', ['To show that uniform application can preserve a biased rule','To prove that humans are perfectly consistent','To explain how applicants record interviews','To recommend using the same test for every job'],0,'Applying a rule consistently does not make the rule valid or equitable.','Inference','C1'),
    q('r13q3','Which safeguard is directly recommended?', ['A process for human review','Keeping scoring factors secret','Using historical hiring decisions without testing','Removing all online assessments'],0,'The final paragraph explicitly calls for a clear route to human review.','Supporting Details','C1'),
  ]},
  { id:'r14', title:'Libraries of things', category:'Community', level:'B1+', minutes:7, text:[
    'A drill may be used for only a few minutes each year, yet many households buy and store one. Libraries of things offer another model. Members borrow tools, camping equipment, kitchen appliances, and other objects that are useful occasionally but unnecessary to own permanently.',
    'Sharing can reduce waste and save money, although the service requires careful organisation. Staff must inspect returned objects, explain safe use, replace missing parts, and maintain enough popular items for busy periods. Membership fees and late charges need to remain affordable without leaving the library underfunded.',
    'The strongest programmes do more than lend equipment. Workshops teach repair and practical skills, while borrowing records help organisers understand local needs. Their success depends not simply on owning a collection, but on building a reliable system that people trust and can use conveniently.'
  ],questions:[
    q('r14q1','What is the main idea?', ['Libraries of things can make occasional-use goods more accessible and sustainable when supported by reliable services.','Every household should stop owning tools.','Late charges are the main source of library funding.','Borrowing records should remain secret from organisers.'],0,'The passage balances the benefits of shared goods with the organisation, instruction, and trust needed for success.','Main Idea','B1+'),
    q('r14q2','Which task is mentioned as part of running the service?', ['Checking objects after they are returned','Manufacturing camping equipment','Building storage rooms in every home','Selling the most popular tools'],0,'The second paragraph states that returned items must be inspected and maintained.','Supporting Details','B1+'),
    q('r14q3','What can be inferred about workshops?', ['They increase the value of the service beyond borrowing alone.','They are required before every loan.','They replace the need to maintain equipment.','They are designed only for professional repair workers.'],0,'The final paragraph presents skills workshops as one way strong programmes provide more than access to objects.','Inference','B1+'),
  ]},
  { id:'r15', title:'Listening to the changing city', category:'Urban research', level:'C1', minutes:9, text:[
    'Cities are commonly measured through what can be seen: buildings, traffic counts, land use, and satellite images. Acoustic researchers add another source of evidence by recording soundscapes. The balance of engines, voices, birds, machinery, and silence can reveal how a place functions across different hours.',
    'Sound data is not self-explanatory. A lively market may register as loud without being experienced as unpleasant, while a quieter mechanical hum can cause persistent stress. Researchers therefore combine recordings with residents’ descriptions and information about who produces, controls, and is exposed to particular sounds.',
    'This work can improve planning if it moves beyond a simple goal of reducing average noise. Protecting quiet refuges, changing delivery schedules, redesigning surfaces, or supporting valued cultural sounds may matter more than lowering one citywide number. Listening becomes useful when it identifies whose environment is improved and whose is ignored.'
  ],questions:[
    q('r15q1','Which option best captures the passage’s main idea?', ['Urban sound research is most useful when measurements are interpreted with human experience and local context.','All loud places are harmful and should be made silent.','Visual data is no longer useful for city planning.','Citywide average noise is the only reliable planning measure.'],0,'The passage argues that recordings need contextual interpretation and should guide targeted, equitable decisions.','Main Idea','C1'),
    q('r15q2','Why are a market and a mechanical hum compared?', ['To show that measured volume does not fully explain how sound is experienced','To prove markets are always quiet','To identify the loudest urban machines','To argue that residents dislike cultural activity'],0,'The comparison demonstrates that loudness alone cannot determine whether a sound is valued or harmful.','Author\'s Purpose','C1'),
    q('r15q3','What does the final sentence emphasize?', ['The distribution of benefits from sound policy','The cost of recording equipment','The need to remove cultural sounds','The superiority of satellite images'],0,'By asking whose environment changes, the author highlights equity rather than a single average measure.','Inference','C1'),
  ]},
]

export type DiagnosticQuestion = Question & { context?: string }

export const diagnosticQuestions: DiagnosticQuestion[] = [
  grammarTopics[0].questions[0],
  grammarTopics[1].questions[0],
  complexTopics[0].questions[0],
  {
    id:'d-vocabulary', prompt:'The results were ___ enough to change the researchers’ conclusion.',
    options:['significant','ordinary','temporary','silent'], answer:0,
    explanation:'“Significant” means important or large enough to have a noticeable effect.',
    skill:'Vocabulary', level:'B1–B2',
  },
  {
    ...readings[1].questions[0],
    context: 'Students often assume that easy learning is effective learning. Yet research suggests that a moderate level of difficulty—sometimes called productive struggle—can make learning more durable. Trying to retrieve an answer before seeing it strengthens memory, even when the first attempt fails. The important condition is that learners receive useful feedback soon afterward. The goal is not discomfort itself, but the mental effort required to connect and retrieve ideas.',
  },
  {
    ...readings[0].questions[1],
    context: 'A restored wetland can absorb heavy rainfall, reducing pressure on drainage systems during storms. Plants and soil filter pollutants before water reaches rivers, while the habitat supports birds and insects. Unlike concrete flood barriers, wetlands may become more effective as vegetation matures.',
  },
  {
    id:'d-writing-agreement', prompt:'Which sentence is written correctly?',
    options:['The results shows a clear pattern.','The results show a clear pattern.','The results is showing a clear pattern.','The results has shown a clear pattern yesterday.'], answer:1,
    explanation:'The plural subject “results” takes the base verb “show”.',
    skill:'Writing accuracy', level:'B1–B2',
  },
  {
    id:'d-writing-coherence', prompt:'Which sentence connects the contrast most clearly?',
    options:['The plan was expensive, because it saved money later.','The plan was expensive; however, it saved money later.','The plan was expensive, and however saved money later.','The plan expensive. It saved, money later.'], answer:1,
    explanation:'“However” clearly signals the contrast and is punctuated correctly between two complete ideas.',
    skill:'Writing coherence', level:'B1–B2',
  },
  {
    ...complexTopics[1].questions[0],
  },
  {
    ...vocabularyQuestions[1],
  },
  {
    ...readings[0].questions[0],
    context: readings[0].text.join('\n\n'),
  },
  {
    ...readings[2].questions[1],
    context: readings[2].text.join('\n\n'),
  },
]
