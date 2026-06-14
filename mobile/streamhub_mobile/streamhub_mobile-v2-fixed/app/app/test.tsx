// app/test.tsx
import { View, TextInput, StyleSheet } from 'react-native';

export default function Test() {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite aqui"
                placeholderTextColor="#999"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0E1A',
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        backgroundColor: '#1a1f2e',
        color: '#fff',
        padding: 16,
        borderRadius: 8,
        fontSize: 16,
    },
});