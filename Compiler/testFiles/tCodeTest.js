class cat {
    public int d = 1;

    // public bool test()
    // {
    //     int high = 10;
    //     int low = 10 ;
    //     if(high > low)
    //         if(high == 10){
    //             cout << 10;
    //             return true;
    //         }
    //         else
    //             return false;
    //     else if(low > high)
    //         if(low == 13) {
    //             cout << 13;
    //             return false;
    //         }
    //         else
    //             return false;
    //     else
    //     {
    //         cout << 13241;
    //     }
    // }

    // public bool test2()
    // {
    //     int high = 10;
    //     int low = 11 ;
    //     while(low > high && low > high)
    //     {
    //         cout<< low;
    //         cout << '\n';
    //         low = low - 1;
    //     }
    //     while(high == low)
    //     {
    //         cout << high;
    //         cout << '\n';
    //         high = high + 1;
    //     }
    // }

    // public bool test3()
    // {
    //     int high = 10;
    //     int low = 11 ;
    //     if(low > high && low > high)
    //     {
    //         cout<< low;
    //         cout << '\n';
    //         low = low - 1;
    //     }
    //     if(high == low)
    //     {
    //         cout << high;
    //         cout << '\n';
    //         high = high + 1;
    //     }
    // }

    public bool test4()
    {
        int high = 1;
        int low = 0;
        
        if(high == 0)
            if(high == 0){
                cout << 1;
                cout << '\n';
                return true;
            }
            else
                return true;
        else if(high == 1)
            if(low == 0){
                cout << 2;
                cout << '\n';
                return true;
            }
            else
                return false;
        else {
            cout << 3;
            cout << '\n';
            return false;
        }
    }

    public bool test5()
    {
        int high = 2;
        if(high == 2)
        {
            cout << 1;
        }
        else if(high > 0){
            cout << 2;
        }
        cout << 8;
    }
    
    cat(){}
}

void kxi2019 main()
{
    char key;
    //char nl;


    cat c;
    c.test4();



    // cin >> key;
    // cin >> nl;

    // while(key != '!')
    // {
    //     cout << key;
    //     cin >> key;
    //     cin >> nl;
    // }

    
    return;
}