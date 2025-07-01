import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Memory {
  id: string;
  type: 'photo' | 'note' | 'moment';
  title: string;
  content: string;
  date: string;
  createdBy: 'me' | 'partner';
  imageUrl?: string;
  tags: string[];
}

const MemoriesScreen = () => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      type: 'photo',
      title: 'Notre premier voyage',
      content: 'Un weekend magique à Paris',
      date: '2024-01-10',
      createdBy: 'me',
      imageUrl: 'https://via.placeholder.com/300x200/FF6B9D/FFFFFF?text=Paris',
      tags: ['voyage', 'paris', 'weekend'],
    },
    {
      id: '2',
      type: 'note',
      title: 'Recette de gâteau',
      content: 'Le gâteau au chocolat que tu adores : 200g chocolat, 150g beurre, 4 œufs...',
      date: '2024-01-08',
      createdBy: 'partner',
      tags: ['recette', 'cuisine', 'chocolat'],
    },
    {
      id: '3',
      type: 'moment',
      title: 'Promenade au parc',
      content: 'Une belle journée ensoleillée, on s\'est promenés pendant 2h',
      date: '2024-01-05',
      createdBy: 'me',
      tags: ['promenade', 'parc', 'soleil'],
    },
    {
      id: '4',
      type: 'photo',
      title: 'Dîner romantique',
      content: 'Notre anniversaire de rencontre',
      date: '2024-01-01',
      createdBy: 'partner',
      imageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Dinner',
      tags: ['anniversaire', 'romantique', 'dîner'],
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'photo' | 'note' | 'moment'>('all');
  const [newMemory, setNewMemory] = useState({
    type: 'note' as Memory['type'],
    title: '',
    content: '',
    tags: '',
  });

  const filteredMemories = memories.filter(memory => {
    if (selectedFilter === 'all') return true;
    return memory.type === selectedFilter;
  });

  const addMemory = () => {
    if (newMemory.title.trim() && newMemory.content.trim()) {
      const memory: Memory = {
        id: Date.now().toString(),
        type: newMemory.type,
        title: newMemory.title,
        content: newMemory.content,
        date: new Date().toISOString().split('T')[0],
        createdBy: 'me',
        tags: newMemory.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };
      setMemories([memory, ...memories]);
      setNewMemory({ type: 'note', title: '', content: '', tags: '' });
      setShowAddModal(false);
    }
  };

  const getTypeIcon = (type: Memory['type']) => {
    switch (type) {
      case 'photo': return 'camera';
      case 'note': return 'document-text';
      case 'moment': return 'heart';
      default: return 'bookmark';
    }
  };

  const getTypeColor = (type: Memory['type']) => {
    switch (type) {
      case 'photo': return '#FF6B9D';
      case 'note': return '#4ECDC4';
      case 'moment': return '#FFD93D';
      default: return '#96CEB4';
    }
  };

  const renderMemory = ({ item }: { item: Memory }) => (
    <View style={styles.memoryCard}>
      <View style={styles.memoryHeader}>
        <View style={styles.memoryType}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) }]}>
            <Ionicons name={getTypeIcon(item.type) as any} size={20} color="white" />
          </View>
          <Text style={styles.memoryTitle}>{item.title}</Text>
        </View>
        <View style={styles.memoryMeta}>
          <Text style={styles.memoryDate}>{item.date}</Text>
          <Ionicons
            name={item.createdBy === 'me' ? 'person' : 'heart'}
            size={16}
            color={item.createdBy === 'me' ? '#FF6B9D' : '#4ECDC4'}
          />
        </View>
      </View>

      {item.type === 'photo' && item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.memoryImage} />
      )}

      <Text style={styles.memoryContent}>{item.content}</Text>

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header avec statistiques */}
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{memories.length}</Text>
            <Text style={styles.statLabel}>Souvenirs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {memories.filter(m => m.type === 'photo').length}
            </Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {memories.filter(m => m.type === 'note').length}
            </Text>
            <Text style={styles.statLabel}>Notes</Text>
          </View>
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
              Tout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'photo' && styles.activeFilter]}
            onPress={() => setSelectedFilter('photo')}
          >
            <Ionicons name="camera" size={16} color={selectedFilter === 'photo' ? 'white' : '#7F8C8D'} />
            <Text style={[styles.filterText, selectedFilter === 'photo' && styles.activeFilterText]}>
              Photos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'note' && styles.activeFilter]}
            onPress={() => setSelectedFilter('note')}
          >
            <Ionicons name="document-text" size={16} color={selectedFilter === 'note' ? 'white' : '#7F8C8D'} />
            <Text style={[styles.filterText, selectedFilter === 'note' && styles.activeFilterText]}>
              Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'moment' && styles.activeFilter]}
            onPress={() => setSelectedFilter('moment')}
          >
            <Ionicons name="heart" size={16} color={selectedFilter === 'moment' ? 'white' : '#7F8C8D'} />
            <Text style={[styles.filterText, selectedFilter === 'moment' && styles.activeFilterText]}>
              Moments
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Liste des souvenirs */}
      <FlatList
        data={filteredMemories}
        renderItem={renderMemory}
        keyExtractor={(item) => item.id}
        style={styles.memoriesList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.memoriesContent}
      />

      {/* Bouton d'ajout */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal d'ajout */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau souvenir</Text>
            
            <View style={styles.typeSelector}>
              <Text style={styles.label}>Type :</Text>
              <View style={styles.typeButtons}>
                {(['note', 'moment', 'photo'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      newMemory.type === type && styles.selectedType,
                      { borderColor: getTypeColor(type) }
                    ]}
                    onPress={() => setNewMemory({...newMemory, type})}
                  >
                    <Ionicons
                      name={getTypeIcon(type) as any}
                      size={20}
                      color={newMemory.type === type ? 'white' : getTypeColor(type)}
                    />
                    <Text style={[
                      styles.typeButtonText,
                      newMemory.type === type && styles.selectedTypeText,
                      { color: newMemory.type === type ? 'white' : getTypeColor(type) }
                    ]}>
                      {type === 'note' ? 'Note' : type === 'moment' ? 'Moment' : 'Photo'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Titre du souvenir"
              value={newMemory.title}
              onChangeText={(text) => setNewMemory({...newMemory, title: text})}
            />
            
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Description..."
              value={newMemory.content}
              onChangeText={(text) => setNewMemory({...newMemory, content: text})}
              multiline
              numberOfLines={4}
            />

            <TextInput
              style={styles.input}
              placeholder="Tags (séparés par des virgules)"
              value={newMemory.tags}
              onChangeText={(text) => setNewMemory({...newMemory, tags: text})}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addMemory}
              >
                <Text style={styles.saveButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 5,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: '#FF6B9D',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
    marginLeft: 5,
  },
  activeFilterText: {
    color: 'white',
  },
  memoriesList: {
    flex: 1,
  },
  memoriesContent: {
    padding: 15,
  },
  memoryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  memoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  memoryType: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  memoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  memoryMeta: {
    alignItems: 'flex-end',
  },
  memoryDate: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  memoryContent: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B9D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
  },
  selectedType: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  selectedTypeText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
  },
  cancelButtonText: {
    color: '#7F8C8D',
    textAlign: 'center',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MemoriesScreen; 