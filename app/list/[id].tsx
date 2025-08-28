import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { TODO_TABLE, TodoRecord } from "@/powersync/AppSchema";
import { useSystem } from "@/powersync/system";
import { useQuery } from "@/powersync/hooks";
import { useState } from "react";

export default function ListDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const system = useSystem();
    const router = useRouter();

    const { data: todos } = useQuery<TodoRecord>(
        `
    SELECT * FROM ${TODO_TABLE}
    WHERE list_id = ?
    ORDER BY created_at DESC
    `,
        [id]
    );

    const [newTodo, setNewTodo] = useState("");

    const addTodo = async () => {
        if (!newTodo.trim()) return;
        await system.powersync.execute(
            `
      INSERT INTO ${TODO_TABLE} (id, list_id, description, completed)
      VALUES (uuid(), ?, ?, false)
      `,
            [id, newTodo]
        );
        setNewTodo("");
    };

    const toggleTodo = async (todoId: string, completed: boolean | null | undefined) => {
        const newStatus = completed ? false : true;
        await system.powersync.execute(
            `UPDATE ${TODO_TABLE} SET completed = ? WHERE id = ?`,
            [newStatus, todoId]
        );
    };

    const deleteTodo = async (todoId: string) => {
        await system.powersync.execute(`DELETE FROM ${TODO_TABLE} WHERE id = ?`, [todoId]);
    };

    return (
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: "transparent" }}>

            <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Todos</Text>

            <View style={{ flexDirection: "row", marginBottom: 16 }}>
                <TextInput
                    placeholder="New todo..."
                    placeholderTextColor="#888"
                    value={newTodo}
                    onChangeText={setNewTodo}
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "#888",
                        borderRadius: 8,
                        paddingHorizontal: 12,
                        paddingVertical: Platform.OS === "ios" ? 12 : 8,
                        fontSize: 16,
                        marginRight: 8,
                        color: "#000",
                        backgroundColor: "#fff",
                    }}
                />
                <TouchableOpacity
                    onPress={addTodo}
                    style={{
                        backgroundColor: "#007AFF",
                        paddingHorizontal: 16,
                        justifyContent: "center",
                        borderRadius: 8,
                    }}
                >
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Add</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={todos}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={{ color: "#888", fontStyle: "italic" }}>No todos yet</Text>
                }
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 12,
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 8,
                            marginBottom: 10,
                            backgroundColor: "#fff",
                        }}
                    >
                        <TouchableOpacity onPress={() => toggleTodo(item.id, !!item.completed)}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    textDecorationLine: item.completed ? "line-through" : "none",
                                    color: item.completed ? "#888" : "#000",
                                }}
                            >
                                {item.description}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                            <Text style={{ color: "red", fontWeight: "bold" }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
