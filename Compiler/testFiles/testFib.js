class cat{
    public int fib(int num)
    {
        if(num < 1)
        {
            return 1;
        }else {
            return fib(num - 1) + fib(num - 2);
        }
    }

    public int fib1(int root) {
        if (root == 0) return 0;
        else if (root == 1) return 1;
        else return (fib1(root - 1) + fib1(root - 2));
    }
}

void kxi2019 main()
{
    int x;
    int y = 10;
    cat c;
    cout << y;

    x = c.fib1(y);
    cout << '=';
    cout << x;
    cout << '\n';
    return;
}