import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../Constants/Color';
// Make sure you have these assets in the specified path
import { back_arrow, refresh, setting, add, eye, edit, square, logout } from '../Assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

// --- Configuration ---
const API_URL = 'https://loadcrm.com/plantingnewapis/api/Gram/GetSamparkVyaktiDataV1';
const ITEMS_PER_PAGE = 20; //number of list per page

function formatDate(dateString) {
  // Safer check for empty, null, or undefined dates
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
// --- Reusable Row Item Component ---
const TableRow = ({ item }) => {
  // Safer way to combine names to avoid extra spaces
  const fullName = [item.FirstName, item.MiddleName, item.LastName].filter(Boolean).join(' ');
  const fullAddress = [item.SamparkSuchiSthar, item.AddressKhand, item.shakhaname, item.subCategory, item.Category].filter(Boolean).join(' - ');

  return (
    <View style={styles.row}>
      <View style={[styles.cell, { width: 80 }]}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="remove-red-eye" color={Colors.bg_safron} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <View style={[styles.cell, { width: 60 }]}>
        <TouchableOpacity style={styles.iconButton}>
          <Image source={square} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider} />
      <Text style={[styles.cell, styles.cellText, { width: 140 }]}>{fullName || 'N/A'}</Text>
      <View style={styles.divider} />
      <Text style={[styles.cell, styles.cellText, { width: 100 }]}>{item.number || ''}</Text>
      <View style={styles.divider} />
      <Text style={[styles.cell, styles.cellText, { width: 120 }]}>{item.ShrediVargikaran || ''}</Text>
      <View style={styles.divider} />
      <Text style={[styles.cell, styles.cellText, { width: 200 }]}>{fullAddress || 'N/A'}</Text>
      <View style={styles.divider} />
      <Text style={[styles.cell, styles.cellText, { width: 120 }]}>{formatDate(item.lastDate)}</Text>
    </View>
  );
};


// --- Main Table Component ---
const SamparkVyaktiTable = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('User data not found in local storage.');
      }

      const userData = JSON.parse(userDataString);
      const accessToken = userData?.token;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          Sthan: '',
          LoginUserPositionName: '',
          Shredi: '',
          LoginUserPosition: '',
          Sthar: 'All',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const listData = Array.isArray(result) ? result : result.Data;

      if (listData && Array.isArray(listData)) {
        setData(listData.reverse());
        setTotalCount(listData.length);
        setCurrentPage(1); // Reset to first page on refresh
      } else {
        throw new Error('Invalid data format received from API.');
      }

    } catch (e) {
      setError(e.message);
      console.error("Failed to fetch data:", e);
    } finally {
      setLoading(false);
    }
  };

  // --- Pagination Logic ---
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const paginatedData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // --- Render Functions ---
  const renderTableHeader = () => (
    <View style={styles.headerRow}>
      <View style={styles.headerCellContainerDark}>
           <Text style={[styles.headerText, { width: 40 }]}>No</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 80 }]}>अधिक जानकारी</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 60, }]}>एडिट</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 140 }]}>नाम</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 100 }]}>नंबर</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 120 }]}>श्रेणी वर्गीकरण</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 200 }]}>संपर्क सूची का स्तर</Text>
        <View style={styles.verticalDivider} />
        <Text style={[styles.headerText, { width: 120 }]}>संपर्क की अंतिम दिनांक</Text>
      </View>
    </View>
  );

  // --- Renders content inside the card based on loading/error state ---
  const renderCardContent = () => {
    if (loading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.bg_safron} />
          <Text style={styles.loadingText}>कृपया प्रतीक्षा करें...</Text>
        </View>
      );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }
    
    return (
      <>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {renderTableHeader()}
            <FlatList
              data={paginatedData}
              keyExtractor={(item, index) => item.Id?.toString() || index.toString()}
              renderItem={({ item }) => <TableRow item={item} />}
              ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
              ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
            />
          </View>
        </ScrollView>
        {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1} style={styles.pageButton}>
            <Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledText]}>{'< पीछे'}</Text>
          </TouchableOpacity>

          <Text style={styles.pageInfoText}>
            {`${totalPages} में से पेज ${currentPage}`}
          </Text>

          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages} style={styles.pageButton}>
            <Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledText]}>{'आगे >'}</Text>
          </TouchableOpacity>
        </View>
      )}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <View style={styles.topHeaderIconsRight}>
          {/* Refresh button is now connected to fetchData */}
          <TouchableOpacity onPress={fetchData}>
            <MaterialIcons name="refresh" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity styles={{ backgroundColor: Colors.white }} >
            <MaterialIcons name="filter-list" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={add} style={[styles.topHeaderIcon, styles.addIcon]} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text style={styles.title}>संपर्क सूची (कुल - {totalCount})</Text>
      </View>

      <View style={styles.card}>
        {/* The content here changes based on the state */}
        {renderCardContent()}
      </View>

    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg_safron,
    paddingBottom: 6
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  topHeaderIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginHorizontal: 8,
    // borderWidth: 2
  },
  addIcon: {
    borderRadius: 5,
    padding: 2,
  },
  filterIcon: {
    borderRadius: 5,
    padding: 2,
  },
  topHeaderIconsRight: {
    flexDirection: 'row',
    backgroundColor: Colors.bg_safron,
    alignItems: 'center', // Align icons vertically
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    paddingBottom: 4,
  },
  card: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerCellContainerDark: {
    flexDirection: 'row',
    backgroundColor: '#616161', // Dark grey from screenshot
  },
  headerText: {
    paddingVertical: 20,
    paddingHorizontal: 5,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#FFF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.grey2, // very light orange for rows
  },
  rowSeparator: {
    height: 1,
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  cellText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: '#D5D8DC',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  iconButton: {
    padding: 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // New style for the loading text
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'grey'
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    padding: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'grey',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12,
    margin: 6,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  pageButton: {
    padding: 8,
  },
  pageButtonText: {
    fontSize: 18,
    color: Colors.bg_safron,
    fontWeight: 'bold',
  },
  pageInfoText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  disabledText: {
    color: 'grey',
  },
});

export default SamparkVyaktiTable;