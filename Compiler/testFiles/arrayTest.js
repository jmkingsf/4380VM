class cat{
    public int x = 3;
    cat(){}
}

void kxi2019 main()
{
    cat x[] = new cat[5];
    x[1] = new cat();

    cout << x[1].x;
    cout << '\n';

    return;
}