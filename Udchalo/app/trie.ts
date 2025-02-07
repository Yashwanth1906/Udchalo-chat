class TrieNode {
    children: Record<string, TrieNode>;
    isEndOfWord: boolean;
  
    constructor() {
      this.children = {};
      this.isEndOfWord = false;
    }
  }
  
  class Trie {
    root: TrieNode;
  
    constructor() {
      this.root = new TrieNode();
    }
  
    insert(word: string) {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      node.isEndOfWord = true;
    }
  
    search(text: string): boolean {
      const words = text.toLowerCase().split(/\s+/);
      for (const word of words) {
        if (this.startsWith(word) || this.fuzzyMatch(word)) return true;
      }
      return false;
    }
  
    private startsWith(prefix: string): boolean {
      let node = this.root;
      for (const char of prefix) {
        if (!node.children[char]) return false;
        node = node.children[char];
        if (node.isEndOfWord) return true; // Detects partial matches
      }
      return false;
    }
  
    private fuzzyMatch(word: string): boolean {
      for (const abusiveWord of abusiveWords) {
        if (this.levenshteinDistance(word, abusiveWord) <= 1) return true;
      }
      return false;
    }
  
    private levenshteinDistance(a: string, b: string): number {
      const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
      );
  
      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          matrix[i][j] =
            a[i - 1] === b[j - 1]
              ? matrix[i - 1][j - 1]
              : Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + 1);
        }
      }
      return matrix[a.length][b.length];
    }
  }
  

const trie = new Trie();
const abusiveWords = [
    "fuck", "fck", "f*ck", "fucc", "fu*k", "fuk", "fukin", "fucker", "motherfucker", 
    "shit", "sh*t", "sht", "bullshit", "bitch", "b*tch", "btch", "biatch", 
    "asshole", "a**hole", "dumbass", "jackass", "bastard", "dick", "d*ck", "prick", "cock", 
    "whore", "slut", "cunt", "douchebag", "retard", "loser", "moron", "jerk", "trash", 
    "useless", "garbage", "suck", "wanker", "pussy", "twat", "scumbag", "shithead",
    "dumbfuck", "dipshit", "piss off", "motherfking", "cumdumpster", "cumslut", "pissed", 
    "ballsack", "shitstorm", "arsehole", "bugger", "tosser", "bollocks", "twatwaffle", "fuckwad",
    "chutiya", "chuttiya", "chootiya", "chutya", "bhosdike", "bhosdika", "madarchod", 
    "maderchod", "behenchod", "bhenchod", "bhenke", "lund", "lawda", "gaandu", 
    "gandu", "gaand", "kutta", "kuttiya", "randi", "randy", "saala", "kamina", "haraam", 
    "haramzada", "harami", "chakka", "chod", "suar", "randi", "tatti", "bhangi", "bhadwa",
    "gandmasti", "chodu", "terimaki", "gand", "choda", "loda", "lawde", 
    "thevidiya", "thevidiyapaya", "mayiru", "keelambatti", "punda", "pundamavane", "pundaichi", 
    "mokkai", "seththu", "sootha", "thoo", "vaayan", "mairu", "pombala", "aambala", "nayea", 
    "lanjodka", "pukodaka", "kukka", "vedhava", "nayala", "munda", "bokka", "donga", "sule", 
    "thelu", "bontha", "lokam", "gandipeta", "balla", "nela", 
    "lavda", "lavde", "gaand", "chutiya", "bhosdya", "ghanta", "bavlat", "gaandmasti", 
    "halkat", "salyat", "kadak", "jhad", "gadha", "bhadvya", 
    "gandu", "chodu", "bhosdiwala", "pataka", "bakwaas", "fuddu", "ullu", "kutte", "saale", 
    "tera maa", "tera baap", "teri behan", "behanchod", "madarchod", 
    "gandu", "chodna", "boka", "chagol", "banchod", "mago", "kutta", "tui chagol", 
    "bokachoda", "mair", "shala", "shali", "bon", 
    "soole", "soolegella", "gondu", "nannmagane", "kothi", "kirika", "mukall", "saale", 
    "gandu", "magu", "ooru", 
    "patti", "thendi", "thendi patti", "mone", "monuse", "thendi", "pattika", "pattiya", 
    "fuk", "fck", "fuxk", "fuq", "fuhk", "shyt", "sht", "d1ck", "dikk", "pussay", "phuck",
    "biatch", "beyotch", "a55", "a$s", "a$$", "c0ck", "wh0re", "tw@t", "sl00t", "b@stard"
];

  
abusiveWords.forEach(word => trie.insert(word));

export default trie;