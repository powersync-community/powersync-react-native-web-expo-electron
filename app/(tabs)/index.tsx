import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { LIST_TABLE, ListRecord, TODO_TABLE } from '@/powersync/AppSchema';
import { useSystem } from '@/powersync/system';
import { useQuery, useStatus } from '@/powersync/hooks';
import { useEffect } from 'react';
import PowerSyncStatus from '@/components/PowerSyncStatus';

const description = (total: number, completed: number = 0) => {
  return `${total - completed} pending, ${completed} completed`;
};

export default function HomeScreen() {
  const system = useSystem();
  const status = useStatus();

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
    await system.powersync.execute(`
      INSERT INTO ${LIST_TABLE} (id, name, owner_id)
      VALUES (uuid(), 'New List', ?);
    `, [await system.connector.userId()]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PowerSyncStatus />
      <View style={{ flex: 1}}>
        <Text style={{ fontSize: 24, fontWeight: 'bold'}}>
          Todo Counts Per List
        </Text>

        <View>
          <TouchableOpacity style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            alignItems: 'center'
          }} onPress={insertList}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Insert List</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await system.powersync.disconnectAndClear();
          }}
          style={{
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 8,
            marginBottom: 20,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Disconnect and Clear</Text>
        </TouchableOpacity>

        <FlatList
          data={listRecords}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ color: '#999', fontStyle: 'italic' }}>No lists found</Text>
          }
          renderItem={({ item: list }) => (
            <View style={{
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 8,
              padding: 15,
              backgroundColor: '#f9f9f9'
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>
                {list.name}
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                {description(list.total_tasks ?? 0, list.completed_tasks ?? 0)}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
