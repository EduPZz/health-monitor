import React, {useCallback, useMemo, useRef} from "react";
import { View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'; 

const BottomSheetTest = () => {
    const BottomSheetRef = useRef(null);

    const handleSheetChanges = useCallback((index) => {
        console.log("handleSheetChanges", index);
    }, []);

    const handleOpenSheet = () => {
        BottomSheetRef.current?.expand();
    }

    return(
        <GestureHandlerRootView style={styles.container}>
            <BottomSheet
                ref={BottomSheetRef}
                enablePanDownToClose={true}
                onChange={handleSheetChanges}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text>Awesome</Text>
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey',
    },
    contentContainer: {
        flex: 1,
        padding: 36,
        alignItems: 'center',
    },
})

export default BottomSheetTest;