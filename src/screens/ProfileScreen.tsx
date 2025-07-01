import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  const profileInfo = {
    name: 'Marie & Thomas',
    relationshipStart: '15 Mars 2023',
    daysTogether: 127,
    sharedEvents: 23,
    sharedPhotos: 156,
  };

  const settingsOptions = [
    {
      title: 'Notifications',
      subtitle: 'Recevoir des notifications',
      icon: 'notifications',
      type: 'switch',
      value: notifications,
      onValueChange: setNotifications,
    },
    {
      title: 'Mode sombre',
      subtitle: 'Activer le thème sombre',
      icon: 'moon',
      type: 'switch',
      value: darkMode,
      onValueChange: setDarkMode,
    },
    {
      title: 'Partage de localisation',
      subtitle: 'Partager ma position',
      icon: 'location',
      type: 'switch',
      value: locationSharing,
      onValueChange: setLocationSharing,
    },
    {
      title: 'Confidentialité',
      subtitle: 'Gérer les paramètres de confidentialité',
      icon: 'shield-checkmark',
      type: 'navigate',
      onPress: () => Alert.alert('Confidentialité', 'Paramètres de confidentialité'),
    },
    {
      title: 'Sauvegarde',
      subtitle: 'Sauvegarder les données',
      icon: 'cloud-upload',
      type: 'navigate',
      onPress: () => Alert.alert('Sauvegarde', 'Sauvegarde en cours...'),
    },
    {
      title: 'Aide & Support',
      subtitle: 'Centre d\'aide et contact',
      icon: 'help-circle',
      type: 'navigate',
      onPress: () => Alert.alert('Aide', 'Centre d\'aide'),
    },
    {
      title: 'À propos',
      subtitle: 'Version 1.0.0',
      icon: 'information-circle',
      type: 'navigate',
      onPress: () => Alert.alert('À propos', 'CouPle App v1.0.0\nDéveloppé avec ❤️'),
    },
  ];

  const renderSettingItem = (item: any) => (
    <TouchableOpacity
      key={item.title}
      style={styles.settingItem}
      onPress={item.type === 'navigate' ? item.onPress : undefined}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={item.icon as any} size={24} color="#FF6B9D" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: '#E0E0E0', true: '#FF6B9D' }}
          thumbColor={item.value ? '#fff' : '#f4f3f4'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#7F8C8D" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header du profil */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImage}>
            <Ionicons name="heart" size={40} color="#FF6B9D" />
          </View>
          <Text style={styles.profileName}>{profileInfo.name}</Text>
          <Text style={styles.relationshipInfo}>
            Ensemble depuis le {profileInfo.relationshipStart}
          </Text>
        </View>

        {/* Statistiques du couple */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profileInfo.daysTogether}</Text>
            <Text style={styles.statLabel}>Jours ensemble</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profileInfo.sharedEvents}</Text>
            <Text style={styles.statLabel}>Événements</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profileInfo.sharedPhotos}</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FF6B9D' }]}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>Nouvelle photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#4ECDC4' }]}>
                <Ionicons name="calendar" size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>Nouvel événement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFD93D' }]}>
                <Ionicons name="gift" size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>Cadeau surprise</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#96CEB4' }]}>
                <Ionicons name="heart" size={24} color="white" />
              </View>
              <Text style={styles.actionTitle}>Message d'amour</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Paramètres */}
        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          <View style={styles.settingsList}>
            {settingsOptions.map(renderSettingItem)}
          </View>
        </View>

        {/* Bouton de déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Déconnexion', style: 'destructive' },
            ]
          )}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#FF6B9D',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  relationshipInfo: {
    fontSize: 16,
    color: '#7F8C8D',
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
    textAlign: 'center',
  },
  actionsContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    textAlign: 'center',
  },
  settingsContainer: {
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
  settingsList: {
    marginTop: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 10,
  },
});

export default ProfileScreen; 