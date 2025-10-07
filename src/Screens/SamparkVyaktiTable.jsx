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
import { back_arrow, refresh, setting, add, eye, edit, square } from '../Assets';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Configuration ---
const API_URL = 'https://loadcrm.com/plantingnewapis/api/Gram/GetSamparkVyaktiDataV1';
const ITEMS_PER_PAGE = 20; // Matched to the screenshot


// --- Reusable Row Item Component ---
const TableRow = ({ item }) => (
  <View style={styles.row}>
    <View style={[styles.cell, { width: 80 }]}>
        <TouchableOpacity style={styles.iconButton}>
            <Image source={eye} style={styles.icon} />
        </TouchableOpacity>
    </View>
    <View style={styles.divider} />
    <View style={[styles.cell, { width: 80 }]}>
        <TouchableOpacity style={styles.iconButton}>
            <Image source={square} style={styles.icon} />
        </TouchableOpacity>
    </View>
     <View style={styles.divider} />
        <Text style={[styles.cell, styles.cellText, { width: 140 }]}>{item.FirstName + " " + item.LastName || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={[styles.cell, styles.cellText, { width: 100 }]}>{item.number || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={[styles.cell, styles.cellText, { width: 120 }]}>{item.ShrediVargikaran || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={[styles.cell, styles.cellText, { width: 200 }]}>{item.PositionName || 'N/A'}</Text>
        <View style={styles.divider} />
        <Text style={[styles.cell, styles.cellText, { width: 120 }]}>{item.lastDate || 'N/A'}</Text>
      </View>
);

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
        setData(listData);
        setTotalCount(listData.length);
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
        <View style={styles.headerCellContainer}>
            <Text style={[styles.headerText, { width: 80, color: '#000' }]}>अधिक जानकारी</Text>
            <View style={styles.verticalDivider} />
            <Text style={[styles.headerText, { width: 80, color: '#000' }]}>एडिट</Text>
        </View>
        <View style={styles.headerCellContainerDark}>
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

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.bg_safron} style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.errorText]}>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image source={back_arrow} style={styles.topHeaderIcon} />
            </TouchableOpacity>
            <View style={styles.topHeaderIconsRight}>
                <TouchableOpacity>
                    <Image source={refresh} style={styles.topHeaderIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={setting} style={styles.topHeaderIcon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image source={add} style={[styles.topHeaderIcon, styles.addIcon]} />
                </TouchableOpacity>
            </View>
        </View>
        
        <View style={styles.card}>
                      <Text style={styles.title}>संपर्क सूची (कुल - {totalCount})</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    {renderTableHeader()}
                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item) => item.Id?.toString()}
                        renderItem={({ item }) => <TableRow item={item} />}
                        ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
                        ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
                    />
                </View>
            </ScrollView>
        </View>

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
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg_safron,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,

  },
  topHeaderIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginHorizontal: 8,
    backgroundColor:'red'

  },
  addIcon: {
    // backgroundColor: 'green',
    borderRadius: 5,
    padding: 2, // to make it look like the screenshot
  },
  topHeaderIconsRight: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
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
  headerCellContainer: {
      flexDirection: 'row',
      backgroundColor: '#E0E0E0', // Light grey from screenshot
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
    backgroundColor: '#FEF5E7', // very light orange for rows
  },
  rowSeparator: {
      height: 1,
      backgroundColor: '#E0E0E0',
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
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  iconButton: {
    padding: 5,
    backgroundColor: Colors.white,

  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  pageButton: {
    padding: 8,
  },
  pageButtonText: {
    fontSize: 16,
    color: Colors.safron,
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


