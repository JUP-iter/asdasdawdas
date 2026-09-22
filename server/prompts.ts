export const prompts = {
  essay: (essay:string, task:string) => `You are an English assessment specialist. Analyze the essay against grammar, vocabulary, coherence, and task response. Do not rewrite the essay. Return JSON only with: overall (0-9), scores {grammar,vocabulary,coherence,taskResponse}, summary, errors [{original,correction,explanation,type}], patterns, strengths. Task: ${task || 'General academic essay'}\nEssay:\n${essay}`,
  mainIdea: (answer:string, expected:string) => `Evaluate a learner's one-sentence main-idea response. Check central idea, irrelevant detail, copying, and personal opinion. Return JSON only: {"score":0-100,"feedback":"..."}. Expected idea: ${expected}\nLearner answer: ${answer}`,
  recommendation: (profile:unknown) => `Create one concise next learning recommendation from this skill profile. Prioritize repeated mistakes and recent low performance. Return JSON only: {"skill":"...","title":"...","reason":"..."}. Profile: ${JSON.stringify(profile)}`,
  grammar: (level:string,topic:string) => `Generate an English grammar question for ${level}, topic ${topic}. Return structured JSON with prompt, four options, answer index, explanation, and skill.`,
  vocabulary: (level:string,word:string) => `Generate contextual vocabulary practice for ${level}, word ${word}. Return structured JSON with prompt, four options, answer index, and explanation.`,
  reading: (level:string,skill:string) => `Generate a short reading passage and one ${skill} question for ${level}. Return structured JSON only.`,
  errorClassification: (sentence:string) => `Classify the English error in this sentence and explain it briefly. Return JSON only with type, span, correction, explanation: ${sentence}`,
  integratedSummary: (passage:{title:string;subtitle:string;paragraphs:string[];keyPoints:{label:string}[]},answer:string,baseline:{wordCount:number;paragraphCount:number;copiedPercent:number;flags:string[]}) => `Evaluate an Integrated Skills Summary using this exact 40-mark rubric: Task Achievement 20 (accurate coverage of essential source ideas, relevance, 150–250 words, one paragraph, no personal opinion, effective source use); Organization 10 (clear topic sentence, logical progression, cohesion, concluding sentence); Language 10 (accurate and varied academic language, effective paraphrasing and summarising). Respect these mandatory ceilings: an answer outside 150–250 words, not in one paragraph, or containing personal opinion cannot score above 14/20 for Task Achievement; at least 50% close source overlap limits Task Achievement to 8/20 and Language to 4/10; a multi-paragraph response limits Organization to 7/10. Evaluate the student's actual writing rather than the preliminary automatic score. Give specific, supportive feedback. For annotations, quote only exact short spans from the student's answer and classify them as organization, language, source-use, or opinion. Write an improved one-paragraph summary of 150–250 words in original academic language. Return JSON only in this shape: {"taskAchievement":{"score":0,"feedback":"..."},"organization":{"score":0,"feedback":"..."},"language":{"score":0,"feedback":"..."},"strengths":["..."],"nextSteps":["..."],"feedback":"...","annotations":[{"quote":"exact words from answer","type":"language","message":"..."}],"improvedSummary":"..."}.

SOURCE TITLE: ${passage.title}
SOURCE SUBTITLE: ${passage.subtitle}
ASSESSED MAIN IDEAS: ${passage.keyPoints.map(point=>point.label).join(' | ')}
SOURCE TEXT:
${passage.paragraphs.join('\n\n')}

AUTOMATIC FORMAT CHECKS: ${JSON.stringify({wordCount:baseline.wordCount,paragraphCount:baseline.paragraphCount,copiedPercent:baseline.copiedPercent,flags:baseline.flags})}

STUDENT SUMMARY:
${answer}`,
}
