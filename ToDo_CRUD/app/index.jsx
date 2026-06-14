import {Text, View, TextInput, Pressable, StyleSheet, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useContext, useEffect } from 'react';
import {data} from '@/data/todo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '@/context/ThemeContext'
import Octicons from '@expo/vector-icons/Octicons'
import Animated, {LinearTransition} from 'react-native-reanimated';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

export default function Index(){
  const [todos, setTodos] = useState([])
  const [text, setText] = useState('')
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext)
  const router = useRouter()

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")

        const storageTodo = jsonValue!= null? JSON.parse(jsonValue): null
        if(storageTodo && storageTodo.length){
          setTodos([...storageTodo].sort((a, b)=> b.id-a.id))
        }
        else{
          setTodos([])
        }
      }catch(e){
        console.error(e)
      }
    }

    fetchData()
  }, [data])


  useEffect(()=>{
    const storeData = async()=>{
      try{
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      }catch(e){
        console.error(e)
      }
    }

    storeData()
  }, [todos])

  const addTodo = () =>{
    if(text.trim()){
      const newId = todos.length>0 ? todos[0].id+1: 0;
      setTodos([{id: newId, title: text, completed: false}, ...todos])
      setText('')
    }
  }

  const toggleTodo = (id) =>{
    setTodos(todos.map(todo=> todo.id===id? {...todo, completed: !todo.completed}: todo))
  }

  const removeTodo = (id) =>{
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handlePress = (id)=>{
    router.push(`/todos/${id}`)
  }

  const styles = createStyles(theme, colorScheme)

  const renderItem = ({item}) => (
    <View style={styles.todoItem}>
      <Pressable 
        onPress = {()=>handlePress(item.id)}
        onLongPress={()=> toggleTodo(item.id)}>
        <Text 
          style = {[styles.todoText, item.completed && styles.completedText]}
        >{item.title}
        </Text>
      </Pressable>
      <Pressable onPress={()=>removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined}/>
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          maxLength={30}
          placeholder='Add to your list'
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>

        <Pressable 
          onPress={()=>setColorScheme(colorScheme==='light'? 'dark': 'light')}
          style = {{marginLeft: 10}}>

            {colorScheme === 'dark'? <Octicons name="moon" size={36} color={theme.text} selectable={undefined} style={{width: 36}}></Octicons>:
                              <Octicons name="sun" size={36} color={theme.text} selectable={undefined} style={{width: 36}}></Octicons>}
            {console.log(colorScheme)}
        </Pressable>
      </View>

      <Animated.FlatList 
        data={todos}
        keyExtractor={(todo)=>todo.id.toString()}
        contentContainerStyle = {{flexGrow: 1}}
        style={styles.todoText}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag'
        renderItem={renderItem}>
      </Animated.FlatList>

      <StatusBar style={colorScheme==='dark'?'light':'dark'} backgroundColor={theme.background} translucent={false}></StatusBar>
    </SafeAreaView>
  )
}
function createStyles(theme, colorScheme){
  return StyleSheet.create({
    container:{
      flex: 1,
      backgroundColor: theme.background,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10, 
      padding: 10, 
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
      borderColor: 'white'
    },
    input:{
      flex: 1,
      borderColor: 'gray',
      borderRadius: 10,
      marginRight: 10,
      fontSize: 18,
      minWidth: 0,
      color: theme.text
    },
    addButton:{
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },
    addButtonText:{
      fontSize: 18,
      color: colorScheme==='dark'?'black':'white'
    },
    todoItem:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto'
    },
    todoText: {
      flex: 1,
      fontSize: 18,
      color: theme.text
    },
    completedText:{
      textDecorationLine: 'line-through'
    }

  })
}