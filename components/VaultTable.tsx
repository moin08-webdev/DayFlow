import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { VaultRow } from '../constants/types';
import { useAppTheme } from '../hooks/useThemeContext';
import { PressableCard3D } from './PressableCard3D';

interface VaultTableProps {
  rows: VaultRow[];
  onEditRow: (row: VaultRow) => void;
  onDeleteRow: (row: VaultRow) => void;
  onToast: (msg: string) => void;
}

export function VaultTable({
  rows,
  onEditRow,
  onDeleteRow,
  onToast,
}: VaultTableProps) {
  const { theme, isDark } = useAppTheme();
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = async (val: string, label: string) => {
    try {
      await Clipboard.setStringAsync(val);
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}
      onToast(`Copied "${label}" to clipboard!`);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleOpenLink = async (url: string) => {
    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }
    const supported = await Linking.canOpenURL(target);
    if (supported) {
      await Linking.openURL(target);
    } else {
      Alert.alert('Cannot Open URL', `The link "${url}" could not be opened.`);
    }
  };

  const isUrlLike = (val: string) => {
    return val.startsWith('http://') || val.startsWith('https://') || val.includes('.com') || val.includes('.dev') || val.includes('.io');
  };

  return (
    <View style={styles.container}>
      {/* Table Column Headers */}
      <View
        style={[
          styles.tableHeader,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(0, 0, 0, 0.04)',
            borderColor: theme.borderSubtle,
          },
        ]}
      >
        <Text style={[styles.headerColText, { color: theme.textSecondary, flex: 1.2 }]}>
          ITEM / TOOL
        </Text>
        <Text style={[styles.headerColText, { color: theme.textSecondary, flex: 1.4 }]}>
          VALUE / LINK
        </Text>
        <Text style={[styles.headerColText, { color: theme.textSecondary, flex: 1.4 }]}>
          WHAT IT DOES
        </Text>
        <Text style={[styles.headerColText, { color: theme.textSecondary, width: 48, textAlign: 'right' }]}>
          ACT
        </Text>
      </View>

      {/* Table Rows */}
      {rows.map((row, index) => {
        const isSecret = !!row.isSecret;
        const isRevealed = !!revealedSecrets[row.id];
        const displayValue = isSecret && !isRevealed ? '••••••••••••••••' : row.value;
        const isUrl = isUrlLike(row.value) && !isSecret;

        return (
          <PressableCard3D
            key={row.id}
            variant={index % 2 === 0 ? 'surface' : 'subtle'}
            style={styles.cardRow}
          >
            <View style={styles.rowContent}>
              {/* Column 1: Item Name & Tag */}
              <View style={[styles.cell, { flex: 1.2 }]}>
                <Text style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
                  {row.name}
                </Text>
                {row.tag ? (
                  <View
                    style={[
                      styles.tagBadge,
                      {
                        backgroundColor: isDark
                          ? 'rgba(99, 102, 241, 0.15)'
                          : 'rgba(99, 102, 241, 0.08)',
                      },
                    ]}
                  >
                    <Text style={[styles.tagBadgeText, { color: theme.primary }]}>
                      {row.tag}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Column 2: Value / Link / Secret */}
              <View style={[styles.cell, { flex: 1.4 }]}>
                <View style={styles.valueRow}>
                  <Text
                    style={[
                      styles.valueText,
                      {
                        color: isUrl ? theme.secondary : theme.text,
                        fontFamily: isSecret ? undefined : Platform.OS === 'ios' ? 'Courier' : 'monospace',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {displayValue}
                  </Text>
                </View>

                {/* Quick Value Actions (Eye for secret, Open for Link, Copy) */}
                <View style={styles.valueActionsRow}>
                  {isSecret && (
                    <TouchableOpacity
                      onPress={() => toggleReveal(row.id)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.miniBtn}
                    >
                      <Ionicons
                        name={isRevealed ? 'eye-off-outline' : 'eye-outline'}
                        size={14}
                        color={theme.primary}
                      />
                    </TouchableOpacity>
                  )}

                  {isUrl && (
                    <TouchableOpacity
                      onPress={() => handleOpenLink(row.value)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.miniBtn}
                    >
                      <Ionicons name="open-outline" size={14} color="#06B6D4" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => handleCopy(row.value, row.name)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.miniBtn}
                  >
                    <Ionicons name="copy-outline" size={13} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Column 3: What It Does */}
              <View style={[styles.cell, { flex: 1.4 }]}>
                <Text
                  style={[styles.descText, { color: theme.textSecondary }]}
                  numberOfLines={2}
                >
                  {row.description || '—'}
                </Text>
              </View>

              {/* Column 4: Edit & Delete */}
              <View style={[styles.actionsCell, { width: 48 }]}>
                <TouchableOpacity
                  onPress={() => onEditRow(row)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.actionIcon}
                >
                  <Ionicons name="pencil-outline" size={15} color={theme.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDeleteRow(row)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.actionIcon}
                >
                  <Ionicons name="trash-outline" size={15} color="#F43F5E" />
                </TouchableOpacity>
              </View>
            </View>
          </PressableCard3D>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  headerColText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  cardRow: {
    marginVertical: 3,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cell: {
    paddingRight: 8,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  tagBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 3,
  },
  tagBadgeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 11,
  },
  valueActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  miniBtn: {
    padding: 2,
  },
  descText: {
    fontSize: 11,
    lineHeight: 15,
  },
  actionsCell: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  actionIcon: {
    padding: 2,
  },
});
