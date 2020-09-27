import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import React, { useContext } from 'react';
import { AuthContext } from '../context';

export const CustomDrawerContent = (props) => {
    const { authMethods } = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props}>
            {props.user
                && (
                    <DrawerItem
                        label={`user: ${props.user.email}`}
                    />
                )}
            <DrawerItemList {...props} />
            <DrawerItem
                label="Log out"
                onPress={() => {
                    authMethods.logOut();
                    props.navigation.closeDrawer();
                    // props.navigation.navigate('Login');
                }}
            />
        </DrawerContentScrollView>

    );
};
