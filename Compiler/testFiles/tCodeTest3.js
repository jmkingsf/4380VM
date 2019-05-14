class cat{
    public char msg[];

    cat(){
        msg = new char[100];
	    msg[1] = 'h';
    }
}

void kxi2019 main()
{
    cat hi = new cat();

    cout << hi.msg[1];
    cout << '\n';

    return;
}