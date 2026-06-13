import { StyleSheet, Appearance, Platform, ScrollView, FlatList, View, Text, Image} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/theme";

import {MENU_ITEMS} from './../constants/menuItems';
import MENU_IMAGES from './../constants/menuImages'

export default function MenuScreen(){
    const colorScheme = Appearance.getColorScheme();
    const theme = colorScheme==='dark'? Colors.dark: Colors.light

    const styles = createStyles(theme, colorScheme)

    const Container = Platform.OS === 'web'? ScrollView: SafeAreaView
    const separatorComponent = ()=> (<View style={styles.separator}/>)
    const headerCompo = <Text style={{color: theme.text}}>Today&apos;s specials: </Text>
    const footerCompo = <Text style={{color: theme.text}}>That&apos;s all for Today </Text>

    return (
        <Container>
            <FlatList data={MENU_ITEMS} 
                keyExtractor={(item)=>item.id.toString()} 
                showsVerticalScrollIndicator = {false}
                contentContainerStyle= {styles.contentContainer}
                ItemSeparatorComponent={separatorComponent}
                ListHeaderComponent={headerCompo}
                ListFooterComponent={footerCompo}
                ListFooterComponentStyle={styles.footerComp}
                ListHeaderComponentStyle={styles.headerComp}
                ListEmptyComponent={<Text>Nothing for today</Text>}
                renderItem={ ({item})=>(
                    <View style={styles.row}>
                        <View style={styles.menuTextRow}>
                            <Text style={[styles.menuItemTitle, styles.menuItemText]}>{item.title}</Text>
                            <Text style={styles.menuItemText}>{item.description}</Text>
                        </View>
                        <Image source = {MENU_IMAGES[item.id - 1]}  style = {styles.menuImageStyle}></Image>
                    </View>
            )}>

            </FlatList>
        </Container>
    )
}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        contentContainer: {
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 12,
            backgroundColor: theme.background,
        },
        separator:{
            height: 1,
            backgroundColor: colorScheme=== 'dark'? 'papayawhip': '#000',
            width: '50%',
            maxWidth: 300,
            alignSelf: 'center',
            marginBottom: 10,
        },
        headerComp:{
            alignSelf: 'center',
            fontSize: 30,
            marginBottom: 10
        },
        footerComp:{
            alignSelf: 'center',
            fontSize: 30,
            marginBottom: 10
        },
        row:{
            flexDirection: 'row',
            width: '100%',
            maxWidth: 600,
            height: 100,
            marginBottom: 10,
            borderStyle: 'solid',
            borderColor: colorScheme=== 'dark'? 'papayawhip': '#000',
            borderWidth: 1,
            borderRadius: 20,
            overflow: 'hidden',
            alignSelf: 'center'
        },
        menuTextRow: {
            width: '65%',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 5,
            flexGrow: 1,
        },
        menuItemTitle:{
            fontSize: 18,
            textDecorationLine: 'underline'
        },
        menuItemText:{
            color: theme.text,
        },
        menuImageStyle: {
            height: 100,
            width: 100
        }

    })
}