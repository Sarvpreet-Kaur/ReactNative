import { useLocalSearchParams, useRouter } from "expo-router";
import {View, Text, StyleSheet, Pressable, TextInput} from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {ThemeContext} from '@/context/ThemeContext'
import { StatusBar } from 'expo-status-bar';
import Octicons from '@expo/vector-icons/Octicons'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditScreen(){
    const {id} = useLocalSearchParams()
    const [todo, setTodo] = useState({})
    const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
    const router = useRouter()

    useEffect(()=>{
        const fetchData = async(id)=>{
            try{
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storageTodos = jsonValue != null? JSON.parse(jsonValue): null

                if(storageTodos && storageTodos.length){
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id)
                    setTodo(myTodo)
                }
            }catch(e){
                console.error(e)
            }
        }
        fetchData(id)
    }, [id])

    const handleSave = async()=>{
        try{
            const savedTodo = {...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem('TodoApp')
            const storageTodos = jsonValue != null? JSON.parse(jsonValue): null

            if(storageTodos && storageTodos.length){
                const otherTodo = storageTodos.filter(todo => todo.id !== savedTodo.id)
                const allTodos = [...otherTodo, savedTodo]
                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos))
            }
            else{
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo]))
            }

            router.push('/')

        }catch(e){
            console.error(e)
        }
    }
    const styles = createStyles(theme, colorScheme)
    return(
        <SafeAreaView style={styles.container}>            
            <View style={styles.inputContainer}>
                <TextInput 
                    style = {styles.input}
                    maxLength={30}
                    placeholder="Edit Todo"
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text)=>setTodo({...todo, title: text})}/>

                <Pressable 
                    onPress={()=>setColorScheme(colorScheme==='light'? 'dark': 'light')}
                    style = {{marginLeft: 10}}>

                        {colorScheme === 'dark'? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{width: 36}}></Octicons>:
                                        <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{width: 36}}></Octicons>}
                        {console.log(colorScheme)}
                </Pressable>
            </View>

            <View style={styles.inputContainer}>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>
                        Save
                    </Text>
                </Pressable>
                <Pressable onPress={()=>router.push('/')} style={[styles.saveButton, {backgroundColor: 'red'}]}>
                    <Text style={[styles.saveButtonText, {color: 'white'}]}>
                        Cancel
                    </Text>
                </Pressable>
            </View>
            <StatusBar style={colorScheme==='dark'?'light':'dark'} backgroundColor={theme.background} translucent={false}></StatusBar>
        </SafeAreaView>
    )
}

function createStyles(theme, colorScheme){
    return StyleSheet.create({
        container:{
            flex: 1,
            width: '100%',
            backgroundColor: theme.background,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            padding: 10, 
            width: '100%',
            maxWidth: 500,
            marginHorizontal: 'auto',
            pointerEvents: 'auto'
        },
        input:{
            flex: 1,
            borderColor: 'gray',
            borderRadius: 10,
            borderWidth: 1,
            marginRight: 10,
            fontSize: 18,
            minWidth: 0,
            color: theme.text,
            flexWrap: 'wrap'
        },
        saveButton:{
            backgroundColor: theme.button,
            borderRadius: 5,
            padding: 10
        },
        saveButtonText:{
            fontSize: 18,
            color: colorScheme==='dark'?'black':'white'
        }
    })
    }