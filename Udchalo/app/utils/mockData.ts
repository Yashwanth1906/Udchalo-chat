const MOCK_FLIGHTS = [
  {
    id: 'FL001',
    from: 'DEL',
    to: 'BOM',
    flightNumber: 'AI101',
    departureTime: '2024-03-20T10:00:00',
    arrivalTime: '2024-03-20T12:00:00',
    status: 'On Time',
    gate: 'A12',
  },
  // Add more flights...
];

const MOCK_USERS = [
  {
    id: 'U1',
    nickname: 'TravelBuff',
    flightId: 'FL001',
    seatNumber: '12A',
    isBlocked: false,
  },
  // Add more users...
];

const MOCK_MESSAGES = [
  {
    id: 'M1',
    flightId: 'FL001',
    userId: 'U1',
    nickname: 'TravelBuff',
    text: 'Hey everyone! Looking forward to the flight!',
    timestamp: new Date().toISOString(),
    status: 'sent',
    isOffline: false,
  },
  // Add more messages...
];

// Banned words list for message moderation
const BANNED_WORDS = [
  'hate',
  'spam',
  // Add more banned words...
];

// Message moderation function
const moderateMessage = (text: string): { isValid: boolean; reason?: string } => {
  const containsBannedWord = BANNED_WORDS.some(word => 
    text.toLowerCase().includes(word.toLowerCase())
  );
  
  if (containsBannedWord) {
    return { isValid: false, reason: 'Message contains inappropriate content' };
  }
  
  return { isValid: true };
};

const MOCK_DATA = { MOCK_FLIGHTS, MOCK_USERS, MOCK_MESSAGES, BANNED_WORDS, moderateMessage };

export default MOCK_DATA;
