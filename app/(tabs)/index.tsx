import { FlatList, SafeAreaView, TouchableOpacity, View, Text, TextInput, Alert, Platform } from 'react-native';
import { LIST_TABLE, ListRecord, TODO_TABLE } from '@/powersync/AppSchema';
import { useSystem } from '@/powersync/system';
import { useQuery } from '@/powersync/hooks';
import { useEffect, useState } from 'react';
import PowerSyncStatus from '@/components/PowerSyncStatus';
import { useRouter } from 'expo-router';

const description = (total: number, completed: number = 0) => {
  return `${total - completed} pending, ${completed} completed`;
};

export default function HomeScreen() {
  const system = useSystem();
  const router = useRouter();
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    system.init();
  }, []);

  const { data: listRecords } = useQuery<ListRecord & { total_tasks: number; completed_tasks: number }>(`
    SELECT
      ${LIST_TABLE}.*, 
      COUNT(${TODO_TABLE}.id) AS total_tasks, 
      SUM(CASE WHEN ${TODO_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
    FROM
      ${LIST_TABLE}
    LEFT JOIN ${TODO_TABLE}
      ON  ${LIST_TABLE}.id = ${TODO_TABLE}.list_id
    GROUP BY
      ${LIST_TABLE}.id
    ORDER BY ${LIST_TABLE}.created_at DESC;
  `);

  const insertList = async () => {
    if (!newListName.trim()) return; // don't insert empty names
    await system.powersync.execute(`
      INSERT INTO ${LIST_TABLE} (id, name, owner_id)
      VALUES (uuid(), ?, ?);
    `, [newListName, await system.connector.userId()]);
    setNewListName(""); // clear input after inserting
  };

  const deleteList = async (listId: string) => {
    await system.powersync.execute(`DELETE FROM ${LIST_TABLE} WHERE id = ?`, [listId]);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <PowerSyncStatus />

      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Todo Lists
      </Text>

      {/* Input for new list */}
      <TextInput
        placeholder="Enter new list name"
        value={newListName}
        onChangeText={setNewListName}
        placeholderTextColor="#888"
        style={{
          borderWidth: 1,
          borderColor: "#888",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: Platform.OS === "ios" ? 12 : 8,
          fontSize: 16,
          marginBottom: 10,
          color: "#000",
          backgroundColor: "#fff",
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
        onPress={insertList}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Insert List</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          await system.powersync.disconnectAndClear();
        }}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 20
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Disconnect and Clear</Text>
      </TouchableOpacity>

      <FlatList
        data={listRecords}
        keyExtractor={(item) => item.id}
        renderItem={({ item: list }) => (
          <View
            style={{
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 8,
              padding: 15,
              backgroundColor: "#f9f9f9"
            }}
          >
            <TouchableOpacity
              onPress={() => router.push({ pathname: '../list/[id]', params: { id: list.id } })}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                {list.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                {description(list.total_tasks ?? 0, list.completed_tasks ?? 0)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteList(list.id)}
              style={{
                marginTop: 10,
                padding: 8,
                borderRadius: 6,
                backgroundColor: '#ff3b30',
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Delete List</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
