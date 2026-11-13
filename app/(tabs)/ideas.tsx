import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AddIdeaModal } from '../../components/AddIdeaModal';
import { AddRoadmapStepModal } from '../../components/AddRoadmapStepModal';
import { Header3D } from '../../components/Header3D';
import { IdeaCard } from '../../components/IdeaCard';
import { RoadmapDetailModal } from '../../components/RoadmapDetailModal';
import { Idea, IdeaStatus, RoadmapStep } from '../../constants/types';
import { useAppTheme } from '../../hooks/useThemeContext';
import { ideaService } from '../../services/storage/ideaService';

export default function IdeasScreen() {
  const { theme, isDark } = useAppTheme();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | IdeaStatus>('All');
  
  // Modals state
  const [addIdeaVisible, setAddIdeaVisible] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  
  // Roadmap detail view
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [addStepVisible, setAddStepVisible] = useState(false);
  const [editingStep, setEditingStep] = useState<RoadmapStep | null>(null);

  const loadIdeas = useCallback(async () => {
    try {
      const data = await ideaService.getIdeas();
      setIdeas(data);
    } catch (err) {
      console.error('Failed to load ideas:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const onRefresh = () => {
    setRefreshing(true);
    loadIdeas();
  };

  const handleSaveIdea = async (data: {
    title: string;
    tag: string;
    description?: string;
    status: IdeaStatus;
    targetDate?: string;
    initialSteps?: string[];
  }) => {
    if (editingIdea) {
      const updated = await ideaService.updateIdea(editingIdea.id, data);
      setIdeas(updated);
      if (selectedIdea && selectedIdea.id === editingIdea.id) {
        setSelectedIdea(updated.find((i) => i.id === editingIdea.id) || null);
      }
      setEditingIdea(null);
    } else {
      const updated = await ideaService.addIdea(data);
      setIdeas(updated);
    }
  };

  const handleDeleteIdea = (idea: Idea) => {
    Alert.alert(
      'Delete Idea',
      `Delete "${idea.title}" and its complete roadmap?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await ideaService.deleteIdea(idea.id);
            setIdeas(updated);
            if (selectedIdea && selectedIdea.id === idea.id) {
              setSelectedIdea(null);
            }
          },
        },
      ]
    );
  };

  const handleUpdateIdeaFromRoadmap = (updatedIdea: Idea) => {
    setSelectedIdea(updatedIdea);
    setIdeas((prev) => prev.map((i) => (i.id === updatedIdea.id ? updatedIdea : i)));
  };

  const handleSaveRoadmapStep = async (stepData: {
    title: string;
    description?: string;
    targetDate?: string;
  }) => {
    if (!selectedIdea) return;

    if (editingStep) {
      const updated = await ideaService.updateRoadmapStep(selectedIdea.id, editingStep.id, stepData);
      if (updated) handleUpdateIdeaFromRoadmap(updated);
      setEditingStep(null);
    } else {
      const updated = await ideaService.addRoadmapStep(selectedIdea.id, stepData);
      if (updated) handleUpdateIdeaFromRoadmap(updated);
    }
    setAddStepVisible(false);
  };

  const filteredIdeas = ideas.filter((item) => {
    if (statusFilter === 'All') return true;
    return item.status === statusFilter;
  });

  const renderHeader = () => (
    <View style={styles.headerComponent}>
      {/* Status Filter Chips */}
      <View style={styles.filterScroll}>
        {(['All', 'In Progress', 'Brainstorming', 'Shipped', 'Paused'] as const).map((filter) => {
          const isSelected = statusFilter === filter;
          const count = filter === 'All' ? ideas.length : ideas.filter((i) => i.status === filter).length;

          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setStatusFilter(filter)}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isSelected ? theme.primary : theme.surfaceSubtle,
                  borderColor: isSelected ? theme.primary : theme.borderSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                {filter}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255, 255, 255, 0.25)'
                      : theme.isDark
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.06)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    { color: isSelected ? '#FFFFFF' : theme.textMuted },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Projects & Visions
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textSecondary }]}>
            Tap any idea to open its execution roadmap
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setEditingIdea(null);
            setAddIdeaVisible(true);
          }}
          activeOpacity={0.8}
          style={styles.addBtn}
        >
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addBtnGradient}
          >
            <Ionicons name="add" size={17} color="#FFFFFF" />
            <Text style={styles.addBtnText}>New Idea</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header3D title="Ideas & Roadmaps" subtitle="Dream • Plan • Execute" />

      <FlatList
        data={filteredIdeas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <IdeaCard
            idea={item}
            onPress={() => setSelectedIdea(item)}
            onEdit={() => {
              setEditingIdea(item);
              setAddIdeaVisible(true);
            }}
            onDelete={() => handleDeleteIdea(item)}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="bulb-outline" size={48} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No ideas found
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                Tap "New Idea" to capture your next big project or vision.
              </Text>
            </View>
          ) : undefined
        }
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

      {/* Add / Edit Idea Modal */}
      <AddIdeaModal
        visible={addIdeaVisible}
        onClose={() => {
          setAddIdeaVisible(false);
          setEditingIdea(null);
        }}
        onSave={handleSaveIdea}
        initialIdea={editingIdea}
      />

      {/* Roadmap Detail Modal */}
      <RoadmapDetailModal
        visible={!!selectedIdea}
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
        onUpdateIdea={handleUpdateIdeaFromRoadmap}
        onOpenAddStep={() => {
          setEditingStep(null);
          setAddStepVisible(true);
        }}
        onEditStep={(step) => {
          setEditingStep(step);
          setAddStepVisible(true);
        }}
      />

      {/* Add / Edit Roadmap Step Modal */}
      <AddRoadmapStepModal
        visible={addStepVisible}
        onClose={() => {
          setAddStepVisible(false);
          setEditingStep(null);
        }}
        onSave={handleSaveRoadmapStep}
        initialStep={editingStep}
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
  filterScroll: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 5,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionSub: {
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
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
