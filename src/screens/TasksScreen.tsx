import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdBy: 'me' | 'partner';
  createdAt: string;
  assignedTo: 'me' | 'partner' | 'both';
}

const TasksScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Faire les courses',
      description: 'Lait, pain, fruits, légumes',
      completed: false,
      priority: 'high',
      createdBy: 'me',
      createdAt: '2024-01-15',
      assignedTo: 'both',
    },
    {
      id: '2',
      title: 'Nettoyer la maison',
      description: 'Aspirateur et poussière',
      completed: true,
      priority: 'medium',
      createdBy: 'partner',
      createdAt: '2024-01-14',
      assignedTo: 'me',
    },
    {
      id: '3',
      title: 'Réserver restaurant',
      description: 'Pour l\'anniversaire de Marie',
      completed: false,
      priority: 'high',
      createdBy: 'me',
      createdAt: '2024-01-13',
      assignedTo: 'me',
    },
    {
      id: '4',
      title: 'Payer les factures',
      description: 'Électricité et internet',
      completed: false,
      priority: 'medium',
      createdBy: 'partner',
      createdAt: '2024-01-12',
      assignedTo: 'both',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignedTo: 'both' as Task['assignedTo'],
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    Alert.alert(
      'Supprimer la tâche',
      'Êtes-vous sûr de vouloir supprimer cette tâche ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setTasks(tasks.filter(task => task.id !== id)),
        },
      ]
    );
  };

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        priority: newTask.priority,
        createdBy: 'me',
        createdAt: new Date().toISOString().split('T')[0],
        assignedTo: newTask.assignedTo,
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', description: '', priority: 'medium', assignedTo: 'both' });
      setShowAddModal(false);
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFD93D';
      case 'low': return '#6BCF7F';
      default: return '#7F8C8D';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Haute';
      case 'medium': return 'Moyenne';
      case 'low': return 'Basse';
      default: return 'Normale';
    }
  };

  const renderTask = ({ item }: { item: Task }) => (
    <View style={[styles.taskCard, item.completed && styles.completedTask]}>
      <TouchableOpacity
        style={styles.taskContent}
        onPress={() => toggleTask(item.id)}
      >
        <View style={styles.taskHeader}>
          <View style={styles.checkboxContainer}>
            <View style={[
              styles.checkbox,
              item.completed && styles.checkedBox
            ]}>
              {item.completed && (
                <Ionicons name="checkmark" size={16} color="white" />
              )}
            </View>
          </View>
          <View style={styles.taskInfo}>
            <Text style={[
              styles.taskTitle,
              item.completed && styles.completedText
            ]}>
              {item.title}
            </Text>
            {item.description && (
              <Text style={[
                styles.taskDescription,
                item.completed && styles.completedText
              ]}>
                {item.description}
              </Text>
            )}
            <View style={styles.taskMeta}>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) }
              ]}>
                <Text style={styles.priorityText}>
                  {getPriorityText(item.priority)}
                </Text>
              </View>
              <Text style={styles.taskDate}>{item.createdAt}</Text>
            </View>
          </View>
        </View>
        <View style={styles.taskActions}>
          <View style={styles.assignedTo}>
            <Ionicons
              name={item.assignedTo === 'both' ? 'people' : 'person'}
              size={16}
              color="#7F8C8D"
            />
            <Text style={styles.assignedText}>
              {item.assignedTo === 'both' ? 'Nous deux' : 
               item.assignedTo === 'me' ? 'Moi' : 'Partenaire'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteTask(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
      </View>

      {/* Filtres */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            Toutes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.activeFilter]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterText, filter === 'pending' && styles.activeFilterText]}>
            En cours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.activeFilter]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Terminées
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste des tâches */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        style={styles.tasksList}
        showsVerticalScrollIndicator={false}
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
            <Text style={styles.modalTitle}>Nouvelle tâche</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChangeText={(text) => setNewTask({...newTask, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description (optionnel)"
              value={newTask.description}
              onChangeText={(text) => setNewTask({...newTask, description: text})}
              multiline
            />

            <View style={styles.priorityContainer}>
              <Text style={styles.label}>Priorité :</Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map(priority => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newTask.priority === priority && styles.selectedPriority,
                      { borderColor: getPriorityColor(priority) }
                    ]}
                    onPress={() => setNewTask({...newTask, priority})}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newTask.priority === priority && styles.selectedPriorityText,
                      { color: getPriorityColor(priority) }
                    ]}>
                      {getPriorityText(priority)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.assignedContainer}>
              <Text style={styles.label}>Assignée à :</Text>
              <View style={styles.assignedButtons}>
                {(['me', 'partner', 'both'] as const).map(assigned => (
                  <TouchableOpacity
                    key={assigned}
                    style={[
                      styles.assignedButton,
                      newTask.assignedTo === assigned && styles.selectedAssigned
                    ]}
                    onPress={() => setNewTask({...newTask, assignedTo: assigned})}
                  >
                    <Text style={[
                      styles.assignedButtonText,
                      newTask.assignedTo === assigned && styles.selectedAssignedText
                    ]}>
                      {assigned === 'both' ? 'Nous deux' : 
                       assigned === 'me' ? 'Moi' : 'Partenaire'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTask}
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statCard: {
    flex: 1,
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#FF6B9D',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  activeFilterText: {
    color: 'white',
  },
  tasksList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  completedTask: {
    opacity: 0.7,
  },
  taskContent: {
    padding: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#7F8C8D',
  },
  taskDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  taskDate: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  taskActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  assignedTo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignedText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 4,
  },
  deleteButton: {
    padding: 5,
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  priorityContainer: {
    marginBottom: 15,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPriority: {
    backgroundColor: '#F8F9FA',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedPriorityText: {
    fontWeight: 'bold',
  },
  assignedContainer: {
    marginBottom: 20,
  },
  assignedButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assignedButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedAssigned: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  assignedButtonText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  selectedAssignedText: {
    color: 'white',
    fontWeight: '600',
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

export default TasksScreen; 