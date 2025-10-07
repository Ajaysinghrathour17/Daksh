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
  SafeAreaView,
} from 'react-native';
import Colors from '../Constants/Color';
import { square } from '../Assets';

// --- Configuration ---
const API_URL = 'https://loadcrm.com/plantingnewapis/api/Gram/GetSamparkVyaktiDataV1';
const ITEMS_PER_PAGE = 20; 


// --- Reusable Row Item Component ---
const TableRow = ({ item }) => (
  <View style={styles.row}>
    <View style={[styles.cell, { width: 80 }]}>
        <TouchableOpacity style={styles.iconButton}>
            <Image source={ square|| 'edit' } style={styles.icon} />
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
const SamparkVyaktiTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // web-preview-fix: Mock user data in localStorage for demonstration.
    // In your actual app, you would log in and save this data. 
    // const token = await AsyncStorage.getItem('token');

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get user data.
      // web-preview-fix: Using localStorage for web compatibility.
      // For a pure React Native project, use AsyncStorage as in the previous version.
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('User data not found in local storage.');
      }
      
      const userData = JSON.parse(userDataString);
            console.log(userData);

      const accessToken = userData?.token; // Adjust if the key is different

      if (!accessToken || accessToken === "your_mock_api_token_here") {
        console.warn('Using a mock or missing access token. API calls may fail.');
      }

      // 2. Make API request
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
      console.log(result);
      
      
      // Assuming the API returns an object with a 'list' property which is the array
      if (result && Array.isArray(result.Data)) {
        setData(result.Data);
        setTotalCount(result.Data.length);
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
  console.log(totalPages);
  
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
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerText, { width: 80 }]}>अधिक जानकारी</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 80 }]}>एडिट</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 140 }]}>नाम</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 100 }]}>नंबर</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 120 }]}>श्रेणी वर्गीकरण</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 200 }]}>संपर्क सूची का स्तर</Text>
      <View style={styles.divider} />
      <Text style={[styles.headerText, { width: 120 }]}>संपर्क की अंतिम दिनांक</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FF5722" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.errorText]}>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.title}>संपर्क सूची (कुल - {totalCount})</Text>
        </View>
        <View style={styles.card}>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    {renderHeader()}
                    <FlatList
                        data={paginatedData}
                        keyExtractor={(item, index) => item.Id?.toString() || index.toString()}
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
    backgroundColor:Colors.bg_safron,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    overflow: 'hidden', // clips the ScrollView
  },
  header: {
    flexDirection: 'row',
    backgroundColor: Colors.grey_40, // Orange color from screenshot
  },
  headerText: {
    padding: 15,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  rowSeparator: {
      height: 1,
      backgroundColor: '#E0E0E0',
  },
  cell: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 12,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.gray, // Light grey for dividers
    padding:1
  },
  icon: {
    width: 24,
    height: 24,
  },
  iconButton: {
    padding: 5,
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10,
  },
  pageButton: {
    padding: 8,
  },
  pageButtonText: {
    fontSize: 16,
    color: '#FF5722',
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

