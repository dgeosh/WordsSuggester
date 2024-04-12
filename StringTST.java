package Suggester.WordsSuggester;
/**
 * <p>
 * An implementation of Ternary Search Trie.
 * </p>
 * <p>
 * Modified to generate all trie-entries with a certain prefix with
 * {@code suggest(prefix)}.
 * </p>
 * <p>
 * Does not implement Symbol Table.
 * </p>
 * <p>
 * Also can generate string representation of trie with toString()
 * </p>
 * 
 * @author Joshua Tittiranonda
 * @date 03/30/24
 * @see SpellHelper
 */
public class StringTST {
    private Node root; // TST root

    /**
     * Node sub-class.
     */
    private class Node {
        char c;
        Node left, mid, right;
        int size;
        boolean end;

        /**
         * Creates a new node with character c.
         * 
         * @param c
         */
        Node(char c) {
            this.c = c;
            this.size = 0;
        }
    }

    /**
     * Insert string into trie.
     * 
     * @param str - string to insert
     */
    public void put(String str) {
        root = put(root, str, 0);
    }

    /**
     * Get number of entries prefixed by {@code key}, including entries consisting
     * of prefix only.
     * 
     * @param key - prefix
     * @return (int) number of entries
     */
    public int size(String key) {
        Node x = get(root, key, 0);
        if (x == null)
            return 0;
        return x.size;
    }

    /**
     * Helper method. Recursively retrieves ending node of entry {@code key}.
     * 
     * @param x   - node to recurse on
     * @param key - key to search
     * @param i   - current index of the key
     * @return (Node) ending node
     */
    private Node get(Node x, String key, int i) {
        if (x == null)
            return null; // return null if not found
        char c = key.charAt(i);
        if (c < x.c)
            return get(x.left, key, i); // if string character < current character, recurse in left subtrie
        else if (c > x.c)
            return get(x.right, key, i); // if string character > current character, recurse in right subtrie
        else if (i < key.length() - 1)
            return get(x.mid, key, i + 1); // if string character == current character, recurse in middle subtrie
        else
            return x; // return the found final node
    }

    /**
     * Get a string containing "suggestions", given a prompt (prefix).
     * 
     * @param prompt - the prefix for which to search the trie
     * @return (String) a String containing all relevant suggestions
     * @see SpellHelper
     */
    public String suggest(String prompt) {
        StringBuilder s = new StringBuilder();

        Node find = get(root, prompt, 0);

        if (find != null) {
            if (find.end) // if the prefix is an entry, add it to the StringBuilder.
                s.append(prompt);
            if (find.mid != null) // recursively generate sub-trie entries and add to StringBuilder.
                generate(find.mid, prompt, s);
        }

        return s.toString();
    }

    /**
     * Helper class for {@code suggest()}. Recursively finds entries with a given
     * prefix, and appends them to a passed StringBuilder.
     * 
     * @param x     - current node in recursion
     * @param chain - chain of letters built up by recursion
     * @param list  - StringBuilder to add final chain (suffix) to.
     */
    public void generate(Node x, String chain, StringBuilder list) {
        // add to SB and return if ended recursive line.
        if (x == null) {
            if (!list.isEmpty())
                list.append("\n");
            list.append(chain);
            if (x == null)
                return;
        }
        // recurse upon left, right subtries
        if (x.left != null)
            generate(x.left, chain, list);
        if (x.right != null)
            generate(x.right, chain, list);
        // add current node to the suffix-chain
        chain = chain + x.c;
        // add to SB if reached the end of a word in the trie, but not done recursing
        // (e.g. current suffix is part of prefix of another word)
        if (x.end && x.mid != null) {
            if (!list.isEmpty())
                list.append("\n");
            list.append(chain);
        }
        //recurse upon mid subtrie
        generate(x.mid, chain, list);
    }

    /**
     * Helper class for {@code put()}. Inserts a string into the trie.
     * @param x - current node
     * @param str - string to insert
     * @param i - current index in string
     */
    private Node put(Node x, String str, int i) {
        char c = str.charAt(i);
        if (x == null) {
            x = new Node(c);
        }
        if (c < x.c)
            x.left = put(x.left, str, i);
        else if (c > x.c)
            x.right = put(x.right, str, i);
        else if (i < str.length()) {
            if (i < str.length() - 1)
                x.mid = put(x.mid, str, i + 1);
            else
                x.end = true;
            x.size++;
        }
        return x;
    }

    public String toString() {
        StringBuilder s = new StringBuilder();
        s.append(toString(root, 0));
        return s.toString();
    }

    /**
     * Helper class for {@code toString()}. Recursively generates String representation of trie.
     * @param x - current node
     * @param tab - number of tabs to prepend
     * @return (String) representation of the generated sub-trie
     */
    private String toString(Node x, int tab) {
        if (x == null)
            return null;

        StringBuilder s = new StringBuilder();

        for (int i = 0; i < tab; i++)
            s.append("\t");
        s.append(x.c + ": " + x.size);

        String left = toString(x.left, tab);
        String mid = toString(x.mid, tab + 1);
        String right = toString(x.right, tab);
        if (right != null) {
            s.append("\n" + right);
        }
        if (mid != null) {
            s.append("\n" + mid);
        }
        if (left != null) {
            s.append("\n" + left);
        }

        return s.toString();
    }

    //Testing code
    public static void main(String[] args) {
        StringTST tst = new StringTST();
        tst.put("salted");
        tst.put("saltine");
        tst.put("sally");
        tst.put("salary");
        tst.put("random");
        System.out.print(tst);
        System.out.print(tst.suggest("sal"));
    }
}
