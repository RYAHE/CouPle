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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'date' | 'anniversary' | 'meeting' | 'other';
  createdBy: 'me' | 'partner';
}

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    type: 'other' as Event['type'],
  });

  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Dîner romantique',
      date: '2024-01-15',
      time: '19:00',
      description: 'Restaurant Le Petit Bistrot',
      type: 'date',
      createdBy: 'me',
    },
    {
      id: '2',
      title: 'Anniversaire de Marie',
      date: '2024-01-20',
      time: '00:00',
      description: 'Préparer un cadeau surprise',
      type: 'anniversary',
      createdBy: 'partner',
    },
    {
      id: '3',
      title: 'Rendez-vous médecin',
      date: '2024-01-18',
      time: '14:30',
      description: 'Consultation de routine',
      type: 'meeting',
      createdBy: 'me',
    },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getEventsForDate = (date: string) => {
    return events.filter(event => event.date === date);
  };

  const addEvent = () => {
    if (newEvent.title.trim()) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: selectedDate.toISOString().split('T')[0],
        time: newEvent.time,
        description: newEvent.description,
        type: newEvent.type,
        createdBy: 'me',
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', description: '', time: '', type: 'other' });
      setShowAddModal(false);
    }
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(selectedDate);
    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < startingDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = getEventsForDate(dateString);
      const isToday = new Date().toDateString() === new Date(dateString).toDateString();
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[styles.calendarDay, isToday && styles.today]}
          onPress={() => setSelectedDate(new Date(dateString))}
        >
          <Text style={[styles.dayText, isToday && styles.todayText]}>{day}</Text>
          {dayEvents.length > 0 && (
            <View style={styles.eventIndicator}>
              <Text style={styles.eventCount}>{dayEvents.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  const renderEvents = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const dayEvents = getEventsForDate(dateString);
    
    if (dayEvents.length === 0) {
      return (
        <View style={styles.noEvents}>
          <Ionicons name="calendar-outline" size={48} color="#7F8C8D" />
          <Text style={styles.noEventsText}>Aucun événement ce jour</Text>
        </View>
      );
    }
    
    return dayEvents.map(event => (
      <View key={event.id} style={styles.eventCard}>
        <View style={[styles.eventTypeIndicator, { backgroundColor: getEventColor(event.type) }]} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventTime}>{event.time}</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
        <View style={styles.eventCreator}>
          <Ionicons
            name={event.createdBy === 'me' ? 'person' : 'heart'}
            size={16}
            color={event.createdBy === 'me' ? '#FF6B9D' : '#4ECDC4'}
          />
        </View>
      </View>
    ));
  };

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'date': return '#FF6B9D';
      case 'anniversary': return '#FFD93D';
      case 'meeting': return '#4ECDC4';
      default: return '#96CEB4';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header du calendrier */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            const prevMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1);
            setSelectedDate(prevMonth);
          }}>
            <Ionicons name="chevron-back" size={24} color="#FF6B9D" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => {
            const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1);
            setSelectedDate(nextMonth);
          }}>
            <Ionicons name="chevron-forward" size={24} color="#FF6B9D" />
          </TouchableOpacity>
        </View>

        {/* Grille du calendrier */}
        <View style={styles.calendarContainer}>
          <View style={styles.weekDays}>
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>
        </View>

        {/* Événements du jour sélectionné */}
        <View style={styles.eventsSection}>
          <View style={styles.eventsHeader}>
            <Text style={styles.eventsTitle}>
              Événements du {selectedDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
          {renderEvents()}
        </View>
      </ScrollView>

      {/* Modal pour ajouter un événement */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel événement</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Titre de l'événement"
              value={newEvent.title}
              onChangeText={(text) => setNewEvent({...newEvent, title: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description (optionnel)"
              value={newEvent.description}
              onChangeText={(text) => setNewEvent({...newEvent, description: text})}
              multiline
            />
            
            <TextInput
              style={styles.input}
              placeholder="Heure (ex: 19:00)"
              value={newEvent.time}
              onChangeText={(text) => setNewEvent({...newEvent, time: text})}
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
                onPress={addEvent}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    textTransform: 'capitalize',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  today: {
    backgroundColor: '#FF6B9D',
    borderRadius: 20,
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  eventsSection: {
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
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  addButton: {
    backgroundColor: '#FF6B9D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEvents: {
    alignItems: 'center',
    padding: 40,
  },
  noEventsText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginTop: 10,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  eventTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  eventCreator: {
    marginLeft: 10,
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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

export default CalendarScreen; 