class Node {
    c;
    left;
    mid;
    right;
    end;
    size;
    constructor(value) {
        this.c = value;
        this.size = 0;
    }
}

class TST {
    root;
    put(str) {
        this.root = this.#put_helper(this.root, str, 0);
    }
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
    size(key) {
        let x = this.get(this.root, key, 0);
        if (x == undefined) {
            return 0;
        }
        return x.size;
    }
    get(x, key, i) {
        if (x == undefined) {
            return undefined;
        }
        let c = key.charAt(i);
        if (c < x.c) {
            return this.get(x.left, key, i);
        } else if (c > x.c) {
            return this.get(x.right, key, i);
        } else if (i < key.length - 1) {
            return this.get(x.mid, key, i + 1);
        } else {
            return x;
        }
    }
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
