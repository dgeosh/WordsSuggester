/**
 * @Author dgeosh
 * @description Represents Node class in Ternary Search Trie.
 * @see TST
 */
class Node {
    //character contained in node (Character)
    c;
    //left, middle, right child (Node)
    left;
    mid;
    right;
    //whether this node is the last node in a trie-entry (Boolean)
    end;
    //number of sub-tries under this node (Number)
    size;
    /**
     * Construct a new node with a given character.
     * @param {Character} value - character of string contained in node
     */
    constructor(value) {
        this.c = value;
        this.size = 0;
    }
}

/**
 * @Author dgeosh
 * @description A basic implementation of Ternary Search Trie. Also recursively generates possible completed paths given a partially traversed path.
 * @see Node
 */
class TST {

    //root node of Trie
    root;

    /**
     * Insert a new item into the TST.
     * @param {String} str - string to insert
     */
    put(str) {
        this.root = this.#put_helper(this.root, str, 0);
    }

    /**
     * Helper method for `put`.
     * @param {Node} x - node to recurse upon
     * @param {String} str - string being inserted
     * @param {Number} i - number 
     * @returns new `Node`
     */
    #put_helper(x, str, i) {
        let c = str.charAt(i);
        if (x == undefined) {
            x = new Node(c);
        }
        if (c < x.c) {
            x.left = this.#put_helper(x.left, str, i);
        } else if (c > x.c) {
            x.right = this.#put_helper(x.right, str, i);
        } else if (i < str.length) {
            if (i < str.length - 1) {
                x.mid = this.#put_helper(x.mid, str, i + 1);
            } else {
                x.end = true;
            }
            x.size++;
        }
        return x;
    }

    /**
     * Get the number of paths (sub-tries?) of a query string.
     * @param {String} str 
     * @returns 
     */
    size(str) {
        let x = this.get(this.root, str, 0);
        if (x == undefined) {
            return 0;
        }
        return x.size;
    }

    /**
     * Recursively retrieve the last node in a trie-entry.
     * @param {Node} x - node to recurse upon
     * @param {String} str - string to search for
     * @param {Number} i - current index in current string
     * @returns last `Node` of a trie entry
     */
    get(x, str, i) {
        if (x == undefined) {
            return undefined;
        }
        let c = str.charAt(i);
        if (c < x.c) {
            return this.get(x.left, str, i);
        } else if (c > x.c) {
            return this.get(x.right, str, i);
        } else if (i < str.length - 1) {
            return this.get(x.mid, str, i + 1);
        } else {
            return x;
        }
    }

    /**
     * Generate a string containing all the possible sub-tries under a trie.
     * @param {String} prompt - common prefix of suggestions
     * @returns a `String` with some useful stuff, i guess
     */
    suggest(prompt) {
        let str = [];
        let find = this.get(this.root, prompt, 0);
        if (find != undefined) {
            if (find.end) {
                str.push(prompt);
            }
            if (find.mid != null) {
                this.#generate(find.mid, prompt, str);
            }
        }
        return str.join("");
    }

    /**
     * Helper method for `suggest()`.
     * @param {Node} x 
     * @param {String} chain 
     * @param {String[]} list 
     * @returns 
     */
    #generate(x, chain, list) {
        if (x == undefined) {
            if (list.length > 0) {
                list.push("\n");
            }
            list.push(chain);
            return;
        }
        if (x.left != undefined) {
            this.#generate(x.left, chain, list);
        }
        if (x.right != null) {
            this.#generate(x.right, chain, list);
        }
        chain += x.c;
        if (x.end && x.mid != undefined) {
            if (list.length > 0) {
                list.push("\n");
            }
            list.push(chain);
        }
        this.#generate(x.mid, chain, list);
    }
}
