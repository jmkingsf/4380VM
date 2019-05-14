class iTree {
    //private int LUE = 42;
    private iNode root;
    private bool first;

 private  int mod(int i, int j) { // k = i mod j
		int k = i / j;
		k = i - j * k;
		return k;
	}
	
	public int gcd(int a, int b) { 
		if (b == 0) return;
		return gcd(b, mod(a, b));
	}

    iTree() {
	root = null;
    }

    public int fib(int root) {
	if (root == 0) return 0;
	else if (root == 1) return 1;
	else return (fib(root - 1) + fib(root - 2));
    }

    public bool add(char key) {
	if (root == null) {
	    root = new iNode(key);
	    return true;
	}
	else
	    return insert(key, root)				;
    }

    private bool insert(char key, iNode node) {
		if (key < node.root)
			if (node.left == null) {
			node.left = new iNode(key);
			return true;
			}
			else 
			return insert(key, node.left);
		else if (key > node.root)
			if (node.right == null) {
			node.right = new iNode(key);
			return true;
			}
			else
			return insert(key, node.right);
		else { // key == node.root
			node.inc();
			return false;
		}
	}


    public void print() {
	first = true;
	inorder(root);
	cout <<'\n';
    }
    
    private void inorder(iNode node) {
	if (node == null) return;

	inorder(node.left);
	visit(node);
	inorder(node.right);
    }

    private void visit(iNode node) {
	if (first) {
	    first = false;
	    cout << ' ';
	}
	else cout << ',';
	

	cout << node.root;
	cout << '(';
	cout << node.cnt;
	cout << ',';
	cout << fib(node.cnt);
	cout << ')';
    }
}
class dog{
    public int x;
}

class iNode {
    public char root;
    public int cnt = 0;
    public iNode left = null;
    public iNode right = null;

    iNode(char key) {
	root = key;
	cnt = 1;
    }

    public void inc() { cnt = cnt + 1; }
}

class cat{
    public bool x = true;
    public int i;
    public int t = 10;
    public char msg[];

    public void print(int i, int end) {
        while (i <= end) {
            cout << msg[i];
            i = i + 1;
        }
    }

    cat(){
        msg = new char[100];
	msg[0] = 'A';
	msg[1] = 'd';
	msg[2] = 'd';
	msg[3] = 'e';
	msg[4] = 'd';
	msg[5] = ' ';
	msg[6] = 'E';
	msg[7] = 'l';
	msg[8] = 'e';
	msg[9] = 'm';
	msg[10] = 'e';
	msg[11] = 'n';
	msg[12] = 't';
	msg[13] = ':';
	i = 14;
	msg[i] = 'D';
	msg[i+1] = 'u';
	msg[i+2] = 'p';
	msg[i+3] = 'l';
	msg[i+4] = 'i';
	msg[i+5] = 'c';
	msg[i+6] = 'a';
	msg[i+7] = 't';
	msg[i+8] = 'e';
	msg[i+9] = ' ';

	msg[24] = 'E';
	msg[25] = 'n';
	msg[26] = 't';
	msg[27] = 'e';
    msg[28] = 'r';
    }

    public int msg3() {
        print(24, 28);
        i = 5;
        print(i, i);
        print(6, 13);
    }
}

void kxi2019 main()
{
    cat hi = new cat();
    cat fast = new cat();
    fast.msg[24] = 'f';


    hi.msg3();
    cout << '\n';
    cout << fast.msg[24];
    cout << '\n';
    return;
}