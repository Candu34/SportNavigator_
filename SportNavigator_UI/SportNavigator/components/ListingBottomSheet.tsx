import {View, Text} from 'react-native';
import React, {useRef, useMemo} from 'react'
import BottomSheet from '@gorhom/bottom-sheet';
import Listings from './Listings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useReducedMotion } from 'react-native-reanimated';



interface Props{
    category: string;
}


const ListingBottomSheet = ({category} : Props) => {
    const reducedMotion = useReducedMotion();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['20%', '100%'], []);

    return (
        <GestureHandlerRootView>
        <BottomSheet ref={bottomSheetRef} 
        snapPoints={snapPoints}
        animateOnMount={!reducedMotion}>
                <View style={{flex: 1}}>
                    <Listings category={category}/>
                </View>
            </BottomSheet>
        </GestureHandlerRootView>
    )
}

export default ListingBottomSheet;
