import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AddVaultFileModal } from '../../components/AddVaultFileModal';
import { AddVaultRowModal } from '../../components/AddVaultRowModal';
import { Header3D } from '../../components/Header3D';
import { VaultTable } from '../../components/VaultTable';
import { VaultFile, VaultRow } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { vaultService } from '../../services/storage/vaultService';

export default function VaultScreen() {
  const { theme, isDark } = useAppTheme();
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>('');
  const [rows, setRows] = useState<VaultRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [addFileVisible, setAddFileVisible] = useState(false);
  const [addRowVisible, setAddRowVisible] = useState(false);
  const [editingRow, setEditingRow] = useState<VaultRow | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(20);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    toastOpacity.value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(1, { duration: 1800 }),
      withTiming(0, { duration: 250 })
    );
    toastTranslateY.value = withSequence(
      withSpring(0, { damping: 12 }),
      withTiming(0, { duration: 1800 }),
      withTiming(20, { duration: 250 })
    );
  };

  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  const loadData = useCallback(async () => {
    try {
      const allFiles = await vaultService.getFiles();
      setFiles(allFiles);

      const activeId = selectedFileId || (allFiles.length > 0 ? allFiles[0].id : '');
      setSelectedFileId(activeId);

      if (activeId) {
        const fileRows = await vaultService.getRowsByFile(activeId);
        setRows(fileRows);
      }
    } catch (err) {
      console.error('Failed to load vault data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFileId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSelectFile = async (fId: string) => {
    setSelectedFileId(fId);
    const fileRows = await vaultService.getRowsByFile(fId);
    setRows(fileRows);
    setSearchQuery('');
  };

  const handleCreateFile = async (data: { name: string; icon: string; description?: string }) => {
    const updated = await vaultService.addFile(data);
    setFiles(updated);
    const newlyAdded = updated[updated.length - 1];
    if (newlyAdded) {
      handleSelectFile(newlyAdded.id);
    }
    showToast(`Created file "${data.name}"`);
  };

  const handleDeleteFile = (f: VaultFile) => {
    if (files.length <= 1) {
      Alert.alert('Cannot Delete', 'You must have at least one vault file.');
      return;
    }

    Alert.alert(
      'Delete Vault File',
      `Delete "${f.name}" and all records stored in it?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const updated = await vaultService.deleteFile(f.id);
            setFiles(updated);
            if (updated.length > 0) {
              handleSelectFile(updated[0].id);
            }
            showToast(`Deleted file "${f.name}"`);
          },
        },
      ]
    );
  };

  const handleSaveRow = async (rowData: {
    fileId: string;
    name: string;
    value: string;
    description: string;
    tag?: string;
    isSecret?: boolean;
  }) => {
    if (editingRow) {
      const updated = await vaultService.updateRow(editingRow.id, rowData);
      setRows(updated.filter((r) => r.fileId === selectedFileId));
      setEditingRow(null);
      showToast(`Updated record "${rowData.name}"`);
    } else {
      const updated = await vaultService.addRow(rowData);
      setRows(updated.filter((r) => r.fileId === selectedFileId));
      showToast(`Added "${rowData.name}" to vault`);
    }
  };

  const handleDeleteRow = (row: VaultRow) => {
    Alert.alert(
      'Delete Record',
      `Delete "${row.name}" from this file?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await vaultService.deleteRow(row.id);
            setRows(updated.filter((r) => r.fileId === selectedFileId));
            showToast(`Deleted "${row.name}"`);
          },
        },
      ]
    );
  };

  const activeFile = files.find((f) => f.id === selectedFileId);

  const filteredRows = rows.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (r.tag && r.tag.toLowerCase().includes(q)) ||
      r.value.toLowerCase().includes(q)
    );
  });

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* File Selector Horizontal Strip */}
      <View style={styles.filesSection}>
        <Text style={[styles.sectionMicro, { color: theme.textMuted }]}>
          VAULT FILES / COLLECTIONS
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={files}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filesList}
          renderItem={({ item }) => {
            const isSelected = item.id === selectedFileId;
            return (
              <TouchableOpacity
                onPress={() => handleSelectFile(item.id)}
                onLongPress={() => handleDeleteFile(item)}
                style={[
                  styles.filePill,
                  {
                    backgroundColor: isSelected
                      ? theme.primary
                      : theme.surfaceSubtle,
                    borderColor: isSelected ? theme.primary : theme.borderSubtle,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.filePillText,
                    {
                      color: isSelected ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            <TouchableOpacity
              onPress={() => setAddFileVisible(true)}
              style={[
                styles.addFileBtn,
                {
                  backgroundColor: theme.surfaceSubtle,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Ionicons name="add" size={15} color={theme.primary} />
              <Text style={[styles.addFileText, { color: theme.primary }]}>
                New File
              </Text>
            </TouchableOpacity>
          }
        />
      </View>

      {/* Search Input Bar */}
      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: theme.surfaceSubtle,
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <Ionicons name="search" size={17} color={theme.textMuted} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={`Search ${activeFile ? activeFile.name : 'records'}...`}
          placeholderTextColor={theme.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={17} color={theme.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Active File Title & Add Row Button */}
      <View style={styles.fileBar}>
        <View>
          <View style={styles.fileNameRow}>
            <Ionicons
              name={(activeFile?.icon || 'document-text-outline') as keyof typeof Ionicons.glyphMap}
              size={18}
              color={theme.primary}
            />
            <Text style={[styles.activeFileName, { color: theme.text }]}>
              {activeFile?.name || 'Vault Records'}
            </Text>
          </View>
          <Text style={[styles.activeFileDesc, { color: theme.textSecondary }]}>
            {filteredRows.length} record{filteredRows.length === 1 ? '' : 's'} in this file
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditingRow(null);
            setAddRowVisible(true);
          }}
          activeOpacity={0.8}
          style={styles.addBtn}
        >
          <LinearGradient
            colors={['#06B6D4', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Row</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D title="Personal Vault" subtitle="Tools • Credentials • Records" />

      <FlatList
        data={[1]} // single item to render VaultTable
        keyExtractor={() => 'vault-table'}
        renderItem={() => (
          filteredRows.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="cube-outline" size={44} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                {searchQuery ? 'No matching records' : 'No records in this file'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "+ Add Row" above to store a tool, link, or secret key.
              </Text>
            </View>
          ) : (
            <VaultTable
              rows={filteredRows}
              onEditRow={(row) => {
                setEditingRow(row);
                setAddRowVisible(true);
              }}
              onDeleteRow={handleDeleteRow}
              onToast={showToast}
            />
          )
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
      />

      {/* Floating Animated Toast Banner */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.toastContainer,
          toastStyle,
          {
            backgroundColor: isDark ? '#1E293B' : '#0F172A',
            borderColor: theme.borderHighlight,
          },
        ]}
      >
        <Ionicons name="checkmark-circle" size={17} color="#10B981" />
        <Text style={styles.toastText}>{toastMessage}</Text>
      </Animated.View>

      {/* Add / Edit Row Modal */}
      <AddVaultRowModal
        visible={addRowVisible}
        fileId={selectedFileId}
        fileName={activeFile?.name || 'File'}
        onClose={() => {
          setAddRowVisible(false);
          setEditingRow(null);
        }}
        onSave={handleSaveRow}
        initialRow={editingRow}
      />

      {/* Add File Modal */}
      <AddVaultFileModal
        visible={addFileVisible}
        onClose={() => setAddFileVisible(false)}
        onSave={handleCreateFile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerComponent: {
    paddingTop: 10,
    marginBottom: 8,
  },
  filesSection: {
    marginBottom: 12,
  },
  sectionMicro: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  filesList: {
    gap: 8,
    alignItems: 'center',
  },
  filePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  filePillText: {
    fontSize: 12,
  },
  addFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
  },
  addFileText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  fileBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeFileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  activeFileDesc: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  addBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
