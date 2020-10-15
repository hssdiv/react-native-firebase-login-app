import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../context';

export const DrawerContent = (props) => {
    const { authMethods } = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props}>
            <View
                style={{
                    height: 120,
                    backgroundColor: 'rgb(100, 107, 110)',
                    marginTop: -4,
                }}

            >
                <View
                    style={styles.sideMenuProfileIcon}
                >
                    <Icon
                        name="face"
                        size={80}
                    />
                </View>
            </View>
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
                }}
                icon={() => (
                    <Icon
                        name="logout"
                        size={20}
                    />
                )}
            />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        width: 80,
        height: 80,
        margin: 20,
        borderRadius: 10,
        backgroundColor: 'white',
    },
});
