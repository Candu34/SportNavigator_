import { View, Text, StyleSheet, Platform, StatusBar, TouchableOpacity, ScrollView} from "react-native";
import React, { useRef, useState } from 'react';;
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from '@/constants/Colors';
import { MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const categories = [
    {
        name: 'Basketball',
        icon: 'basketball',
    },
    {
        name: 'Football',
        icon: 'soccer',
    },
    {
        name: 'Tennis',
        icon: 'tennis',
    },
    {
        name: 'Volleyball',
        icon: 'volleyball'
    },
    {
        name: 'Table tennis',
        icon: 'table-tennis',
    }
]



interface Props {
    onCategoryChanged: (category: string) => void;
}

const ExploreHeader = ({onCategoryChanged} : Props) => {
const scrollRef = useRef<ScrollView>(null);
const itemsRef = useRef<Array<TouchableOpacity | null>>([])
const [activeIndex, setActiveIndex] = useState(0);

const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);

    selected?.measure((x) => {
        scrollRef.current?.scrollTo({x: x -16, y: 0, animated: true})
    })

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onCategoryChanged(categories[index].name);
};
    return (
      
        <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <View style={styles.actionRow}>
                        <Link href={'/(modals)/court'} asChild>
                            <TouchableOpacity style={styles.searchBtn}>
                                <Ionicons name='search' size={24}/>
                                <View>
                                    <Text style={{fontFamily: 'pop-sb'}}>Where to?</Text>
                                    <Text style={{fontFamily: 'pop', color: Colors.grey }}>Make today count</Text>
                                </View>
                            </TouchableOpacity>
                        </Link>

                        <TouchableOpacity style={styles.filterBtn}>
                            <Ionicons name='options-outline' size={24}/>
                        </TouchableOpacity>
                    </View>
                            <ScrollView nestedScrollEnabled={true}
                            
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}

                                contentContainerStyle={{
                                    alignItems: 'center',
                                    gap: 20,
                                    paddingHorizontal: 16,
                                    flexGrow: 1,
                                }}> 
                                {categories.map((item, index) => (
                                    <TouchableOpacity
                                    ref={(el) => (itemsRef.current[index] = el)}
                                    key={index}
                                    style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
                                    onPress={() => selectCategory(index)}>
                                    <MaterialCommunityIcons
                                        name={item.icon as any}
                                        size={24}
                                        color={activeIndex === index ? '#000' : Colors.grey}
                                    />
                                    <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
                                        {item.name}
                                    </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                    </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    container: {
        backgroundColor: '#fff',
        height: 140,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 20,
    },
    filterBtn: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 24,
    },
    searchBtn: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        gap: 10,
        borderColor: '#c2c2c2',
        borderWidth: StyleSheet.hairlineWidth,
        padding: 10,
        borderRadius: 30,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1, 
            height: 1,
        },
    },
    categoryText: {
        fontSize: 14,
        fontFamily: 'pop-sb',
        color: Colors.grey,
    },
    categoryTextActive: {
        fontSize: 14,
        fontFamily: 'pop-sb',
        color: '#000',
    },
    categoriesBtn: {
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
    },
    categoriesBtnActive: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 8,
        borderBottomColor: '#000',
        borderBottomWidth: 2,
    }
})

export default ExploreHeader