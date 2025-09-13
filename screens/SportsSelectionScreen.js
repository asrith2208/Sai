// screens/SportsSelectionScreen.js - Enhanced Sports Selection with Categories
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SAI_COLORS, SAI_SPORTS } from '../constants/theme';

const { width } = Dimensions.get('window');

const SportsSelectionScreen = ({ navigation, route }) => {
  const [selectedSport, setSelectedSport] = useState(route.params?.selectedSport || null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSportSelection = (sportKey) => {
    setSelectedSport(sportKey);
    setSelectedSubcategory(null);
    setShowSubcategoryModal(true);
  };

  const handleSubcategorySelection = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowSubcategoryModal(false);
  };

  const handleContinue = () => {
    if (!selectedSport || !selectedSubcategory) {
      Alert.alert('Selection Required', 'Please select both sport and subcategory to continue');
      return;
    }

    navigation.navigate('VideoRecording', {
      sport: selectedSport,
      subcategory: selectedSubcategory,
      sportData: SAI_SPORTS[selectedSport]
    });
  };

  const filteredSports = Object.entries(SAI_SPORTS).filter(([key, sport]) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSportCard = (sportKey, sport) => (
    <TouchableOpacity
      key={sportKey}
      style={[
        styles.sportCard,
        selectedSport === sportKey && styles.selectedSportCard
      ]}
      onPress={() => handleSportSelection(sportKey)}
    >
      <LinearGradient
        colors={selectedSport === sportKey ? [sport.color, SAI_COLORS.white] : [SAI_COLORS.white, SAI_COLORS.white]}
        style={styles.sportCardGradient}
      >
        <View style={[styles.sportIconContainer, { backgroundColor: sport.color }]}>
          <Ionicons name={sport.icon} size={32} color={SAI_COLORS.white} />
        </View>
        
        <View style={styles.sportInfo}>
          <Text style={[
            styles.sportName,
            selectedSport === sportKey && styles.selectedSportName
          ]}>
            {sport.name}
          </Text>
          <Text style={[
            styles.subcategoryCount,
            selectedSport === sportKey && styles.selectedSubcategoryCount
          ]}>
            {sport.subcategories.length} categories
          </Text>
        </View>
        
        {selectedSport === sportKey && (
          <Ionicons name="checkmark-circle" size={24} color={sport.color} />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSubcategoryModal = () => (
    <Modal
      visible={showSubcategoryModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowSubcategoryModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select {selectedSport ? SAI_SPORTS[selectedSport].name : ''} Category
            </Text>
            <TouchableOpacity onPress={() => setShowSubcategoryModal(false)}>
              <Ionicons name="close" size={24} color={SAI_COLORS.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.subcategoryList}>
            {selectedSport && SAI_SPORTS[selectedSport].subcategories.map((subcategory, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.subcategoryItem,
                  selectedSubcategory === subcategory && styles.selectedSubcategoryItem
                ]}
                onPress={() => handleSubcategorySelection(subcategory)}
              >
                <View style={styles.subcategoryContent}>
                  <Ionicons 
                    name="trophy" 
                    size={20} 
                    color={selectedSubcategory === subcategory ? SAI_COLORS.white : SAI_SPORTS[selectedSport].color} 
                  />
                  <Text style={[
                    styles.subcategoryText,
                    selectedSubcategory === subcategory && styles.selectedSubcategoryText
                  ]}>
                    {subcategory}
                  </Text>
                </View>
                {selectedSubcategory === subcategory && (
                  <Ionicons name="checkmark" size={20} color={SAI_COLORS.white} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={[
              styles.modalSelectButton,
              { backgroundColor: selectedSport ? SAI_SPORTS[selectedSport].color : SAI_COLORS.gray }
            ]}
            onPress={() => setShowSubcategoryModal(false)}
            disabled={!selectedSubcategory}
          >
            <Text style={styles.modalSelectButtonText}>Select Category</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Sport</Text>
        <Text style={styles.subtitle}>Select the sport you want to be evaluated for</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={SAI_COLORS.gray} />
        <Text style={styles.searchInput}>Search sports...</Text>
      </View>

      {/* Selected Sport Display */}
      {selectedSport && selectedSubcategory && (
        <View style={styles.selectionDisplay}>
          <LinearGradient
            colors={[SAI_SPORTS[selectedSport].color, SAI_COLORS.white]}
            style={styles.selectionGradient}
          >
            <Ionicons name={SAI_SPORTS[selectedSport].icon} size={24} color={SAI_COLORS.white} />
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionSport}>{SAI_SPORTS[selectedSport].name}</Text>
              <Text style={styles.selectionCategory}>{selectedSubcategory}</Text>
            </View>
            <TouchableOpacity onPress={() => {
              setSelectedSport(null);
              setSelectedSubcategory(null);
            }}>
              <Ionicons name="close-circle" size={24} color={SAI_COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}

      {/* Sports Grid */}
      <ScrollView style={styles.sportsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sportsGrid}>
          {filteredSports.map(([key, sport]) => renderSportCard(key, sport))}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedSport || !selectedSubcategory) && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedSport || !selectedSubcategory}
        >
          <Text style={[
            styles.continueButtonText,
            (!selectedSport || !selectedSubcategory) && styles.disabledButtonText
          ]}>
            Continue to Recording
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={(!selectedSport || !selectedSubcategory) ? SAI_COLORS.gray : SAI_COLORS.white} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => Alert.alert('Help', 'Select the sport you want to be evaluated for. Each sport has specific categories to choose from.')}
        >
          <Ionicons name="help-circle-outline" size={16} color={SAI_COLORS.gray} />
          <Text style={styles.helpText}>Need help choosing?</Text>
        </TouchableOpacity>
      </View>

      {renderSubcategoryModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SAI_COLORS.lightGray,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: SAI_COLORS.dark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: SAI_COLORS.gray,
    lineHeight: 22,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SAI_COLORS.white,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: SAI_COLORS.gray,
    marginLeft: 12,
  },
  selectionDisplay: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  selectionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  selectionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  selectionSport: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginBottom: 2,
  },
  selectionCategory: {
    fontSize: 14,
    color: SAI_COLORS.white,
    opacity: 0.9,
  },
  sportsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sportsGrid: {
    paddingBottom: 20,
  },
  sportCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedSportCard: {
    elevation: 4,
    shadowOpacity: 0.2,
  },
  sportCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sportIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sportInfo: {
    flex: 1,
  },
  sportName: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    marginBottom: 4,
  },
  selectedSportName: {
    color: SAI_COLORS.dark,
  },
  subcategoryCount: {
    fontSize: 14,
    color: SAI_COLORS.gray,
  },
  selectedSubcategoryCount: {
    color: SAI_COLORS.dark,
    opacity: 0.8,
  },
  bottomSection: {
    padding: 20,
    paddingBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SAI_COLORS.orange,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: SAI_COLORS.border,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.white,
    marginRight: 8,
  },
  disabledButtonText: {
    color: SAI_COLORS.gray,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  helpText: {
    fontSize: 14,
    color: SAI_COLORS.gray,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: SAI_COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: SAI_COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: SAI_COLORS.dark,
    flex: 1,
  },
  subcategoryList: {
    padding: 20,
    maxHeight: 300,
  },
  subcategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: SAI_COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedSubcategoryItem: {
    backgroundColor: SAI_COLORS.orange,
  },
  subcategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subcategoryText: {
    fontSize: 16,
    fontWeight: '500',
    color: SAI_COLORS.dark,
    marginLeft: 12,
  },
  selectedSubcategoryText: {
    color: SAI_COLORS.white,
  },
  modalSelectButton: {
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: SAI_COLORS.white,
  },
});

export default SportsSelectionScreen;