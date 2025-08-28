import { useStatus } from '@powersync/react';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const PowerSyncStatus = () => {
  const status = useStatus();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>PowerSync Status</Text>

      {status ? (
        <View style={styles.contentContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Connected</Text>
            <View
              style={[
                styles.statusBadge,
                status.connected ? styles.successBadge : styles.errorBadge,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  status.connected ? styles.successText : styles.errorText,
                ]}
              >
                {status.connected ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Connecting</Text>
            <Text style={styles.value}>{status.connecting ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Uploading</Text>
            <Text style={styles.value}>
              {status.dataFlowStatus?.uploading ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Downloading</Text>
            <Text style={styles.value}>
              {status.dataFlowStatus?.downloading ? 'Yes' : 'No'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Progress</Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        status.downloadProgress?.downloadedFraction
                          ? status.downloadProgress.downloadedFraction * 100
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {status.downloadProgress?.downloadedFraction != null
                  ? `${(status.downloadProgress.downloadedFraction * 100).toFixed(1)}%`
                  : '0%'}
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Has Synced</Text>
            <Text style={styles.value}>{status.hasSynced ? 'Yes' : 'No'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Last Sync</Text>
            <Text style={styles.value}>
              {status.lastSyncedAt?.toLocaleString() ?? 'Never'}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.noStatusContainer}>
          <Text style={styles.noStatusText}>No status available</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'left',
  },
  contentContainer: {
    flexDirection: 'column',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#555',
    textAlign: 'right',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  successBadge: {
    backgroundColor: '#e8f5e8',
  },
  errorBadge: {
    backgroundColor: '#fdeaea',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  successText: {
    color: '#2d7d2d',
  },
  errorText: {
    color: '#d73a49',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  noStatusContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noStatusText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default PowerSyncStatus;
