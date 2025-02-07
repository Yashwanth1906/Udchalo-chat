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
    "fuck", "fck", "f*ck", "fucc", "fu*k", "fuk", "fukin", "fucker", "motherfucker", "fucking",  
"shit", "sh*t", "sht", "bullshit", "bitch", "b*tch", "btch", "biatch",  
"asshole", "a**hole", "dumbass", "jackass", "bastard", "dick", "d*ck", "prick", "cock",  
"whore", "slut", "cunt", "douchebag", "retard", "loser", "moron", "jerk", "trash",  
"useless", "garbage", "suck", "wanker", "pussy", "twat", "scumbag", "shithead",  
"dumbfuck", "dipshit", "piss off", "motherfking", "cumdumpster", "cumslut", "pissed",  
"ballsack", "shitstorm", "arsehole", "bugger", "tosser", "bollocks", "twatwaffle", "fuckwad",  
"fuk", "fck", "fuxk", "fuq", "fuhk", "shyt", "sht", "d1ck", "dikk", "pussay", "phuck",  
"biatch", "beyotch", "a55", "a$s", "a$$", "c0ck", "wh0re", "tw@t", "sl00t", "b@stard",  
"motherfucking", "shitfaced", "bitchass", "dickhead", "cockhead", "pissbrain",  
"fuckhead", "assclown", "asswipe", "dumbshit", "shitbag", "fuckbag", "scumbucket",  
"cockwaffle", "twatsucker", "cumguzzler", "cocksucker", "douchelord", "fucknugget",  
"pissbaby", "pissbrain", "shitnugget", "bitchface", "cumbucket", "asshat",  
"fuckstick", "shitstick", "wankstain", "cuntmuffin", "cumstain", "pissstain", "turdbrain",  
"shitlord", "assmunch", "cockstain", "fucktard", "dumbtard", "twatface", "shitforbrains",  
"assbender", "fuckmonkey", "shitlicker", "fucklicker", "pisslicker", "scumlord",  
"shittalker", "dicknose", "twatnugget", "fuckhole", "arsewipe", "bitchwad",  
"fartknocker", "shitweasel", "fuckweasel", "cockgobbler", "dickbag", "dickweasel",  
"fuckbucket", "dickstain", "shitgobbler", "wankbucket", "fuckstain", "shitbrain",  
"bastardface", "bitchmonkey", "fucknob", "cockmongler", "shitmonger",  
"pissgargler", "assrocket", "fuckbucket", "assdrip", "dickdrip", "fuckrag",  
"cumrag", "shitdipper", "wankrag", "cumflap", "pissflap", "cuntflap",  
"fuckwaffle", "cuntwaffle", "fuckstick", "cockwhisperer", "assburger",  
"fucktrumpet", "dicktrumpet", "shitpipe", "cockmuncher", "cuntmuncher",  
"cockholster", "fuckcluster", "asscluster", "bitchcluster", "shitcluster",  
"cocknugget", "fuckwicket", "twatpaddle", "bastardstick", "bitchrocket",  
"shitbiscuit", "fuckbiscuit", "cockbiscuit", "twatbiscuit", "asspickle",  
"fuckpickle", "dickpickle", "shitsmear", "fucksmear", "bitchsmear",  
"wankmaggot", "cumgobbler", "dumbdick", "fucktool", "shittool", "fuckbag",  
"twatsniffer", "cuntlicker", "dickwad", "shitwad", "fuckwad", "twatwad",  
"asswart", "fuckwart", "cockwart", "twatwart", "shitwart", "fuckcrumpet",  
"shitcrumpet", "cockcrumpet", "bitchcrumpet", "wankknob", "fuckknob",  
"shitknob", "cockknob", "bitchknob", "pissknob", "wankknuckle", "fuckknuckle",  
"shitknuckle", "cockknuckle", "bitchknuckle", "douchepickle", "wankpickle",  
"fuckpickle", "shitpickle", "cockpickle", "twatpickle", "cumknob",  
"fuckblister", "shitblister", "bitchblister", "assblister", "twatblister",  
"fuckwart", "shitwart", "bitchwart", "asswart", "twatwart"
];

  
abusiveWords.forEach(word => trie.insert(word));

export default trie;