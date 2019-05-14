class cat{
    public int msg[] = new int[5];

    cat(){
        //msg = new int[100];
        null = this;
    }

    public int add(int x, int y)
    {
        return x + y;
    }
}

void kxi2019 main()
{
    cat cat = new cat();

    int i = cat.add(1,-3);
    cout << i;
    cout << '\n';

    return;
}