const lexicon = {
  happy: [
    'happy', 'glad', 'joy', 'joyful', 'awesome', 'amazing', 'wonderful',
    'fantastic', 'great', 'love this', 'blessed', 'beautiful', 'smile',
    'laughing', 'fun', 'excited', 'yay', 'woohoo', 'delighted', 'cheerful',
    'content', 'thrilled', 'elated', 'ecstatic', 'overjoyed', 'peaceful',
    'alegre', 'feliz', 'contento', 'maravilloso', 'genial', 'increíble',
  ],
  sad: [
    'sad', 'cry', 'crying', 'depressed', 'heartbroken', 'grief', 'grieving',
    'miserable', 'lonely', 'alone', 'empty', 'numb', 'hurt', 'pain',
    'sorrow', 'melancholy', 'hopeless', 'despair', 'down', 'blue',
    'triste', 'llorar', 'deprimido', 'solo', 'vacío', 'dolor',
  ],
  angry: [
    'angry', 'mad', 'furious', 'rage', 'frustrated', 'annoyed', 'irritated',
    'pissed', 'hate', 'hating', 'fuck', 'damn', 'bullshit', 'outraged',
    'enojado', 'furioso', 'rabia', 'frustrado', 'odio',
  ],
  anxious: [
    'anxious', 'nervous', 'worried', 'fear', 'scared', 'panic', 'overthinking',
    'stress', 'overwhelmed', 'tense', 'uneasy', 'restless', 'dread',
    'ansioso', 'nervioso', 'preocupado', 'miedo', 'pánico',
  ],
  loved: [
    'love', 'loved', 'cherish', 'adore', 'grateful for you', 'miss you',
    'appreciate', 'affection', 'romance', 'sweet', 'caring',
    'amor', 'querer', 'adorar', 'extrañar', 'apreciar',
  ],
  lonely: [
    'lonely', 'alone', 'isolated', 'forgotten', 'ignored', 'nobody',
    'no one', 'abandoned', 'left out', 'invisible',
    'solo', 'aislado', 'olvidado', 'ignorado', 'nadie',
  ],
  hopeful: [
    'hope', 'hoping', 'hopeful', 'optimistic', 'looking forward',
    'future', 'dream', 'dreaming', 'believe', 'faith', 'possibility',
    'esperanza', 'esperar', 'optimista', 'futuro', 'soñar', 'creer',
  ],
  grateful: [
    'grateful', 'thankful', 'appreciate', 'blessed', 'thank you',
    'gratitude', 'thank', 'gracías', 'agradecido', 'bendecido',
  ],
  stressed: [
    'stressed', 'overwhelmed', 'burnout', 'exhausted', 'tired',
    'drained', 'pressure', 'deadline', 'too much', 'can\'t handle',
    'estresado', 'agotado', 'cansado', 'presión', 'demasiado',
  ],
  excited: [
    'excited', 'thrilled', 'pumped', 'hyped', 'can\'t wait',
    'looking forward', 'so ready', 'let\'s go', 'amazing',
    'emocionado', 'ansioso bueno', 'expectativa', 'listo',
  ],
  tired: [
    'tired', 'exhausted', 'sleepy', 'drained', 'fatigued', 'worn out',
    'burnout', 'can\'t sleep', 'insomnia', 'cansado', 'agotado',
    'dormir', 'insomnio', 'fatiga',
  ],
  confused: [
    'confused', 'lost', 'uncertain', 'unsure', 'don\'t know',
    'what if', 'maybe', 'confusing', 'perplexed', 'baffled',
    'confundido', 'perdido', 'incierto', 'no sé', 'quizás',
  ],
};

const weights = {
  happy: 0.8, sad: 0.7, angry: 0.6, anxious: 0.7, loved: 0.8,
  lonely: 0.7, hopeful: 0.7, grateful: 0.8, stressed: 0.6,
  excited: 0.8, tired: 0.5, confused: 0.5, neutral: 0.2,
};

function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') return 'neutral';

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const scores = {};

  for (const [sentiment, keywords] of Object.entries(lexicon)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += weights[sentiment] || 0.5;
      }
    }
    if (score > 0) {
      scores[sentiment] = score;
    }
  }

  if (Object.keys(scores).length === 0) return 'neutral';

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

const sentimentEmojis = {
  happy: '😊', sad: '😢', angry: '😤', anxious: '😰', loved: '🥰',
  lonely: '💔', hopeful: '🌟', grateful: '🙏', stressed: '😫',
  excited: '🎉', tired: '😴', confused: '😕', neutral: '💭',
};

const sentimentLabels = {
  en: {
    happy: 'Feeling Happy', sad: 'Feeling Sad', angry: 'Feeling Angry',
    anxious: 'Feeling Anxious', loved: 'Feeling Loved', lonely: 'Feeling Lonely',
    hopeful: 'Feeling Hopeful', grateful: 'Feeling Grateful', stressed: 'Feeling Stressed',
    excited: 'Feeling Excited', tired: 'Feeling Tired', confused: 'Feeling Confused',
    neutral: 'Sharing Thoughts',
  },
  es: {
    happy: 'Sintiéndote Feliz', sad: 'Sintiéndote Triste', angry: 'Sintiéndote Enojado',
    anxious: 'Sintiéndote Ansioso', loved: 'Sintiéndose Amado', lonely: 'Sintiéndote Solx',
    hopeful: 'Sintiéndote Esperanzadx', grateful: 'Sintiéndote Agradecidx',
    stressed: 'Sintiéndote Estresadx', excited: 'Sintiéndote Emocionadx',
    tired: 'Sintiéndote Cansadx', confused: 'Sintiéndote Confusx',
    neutral: 'Compartiendo Pensamientos',
  },
};

module.exports = { analyzeSentiment, sentimentEmojis, sentimentLabels };
