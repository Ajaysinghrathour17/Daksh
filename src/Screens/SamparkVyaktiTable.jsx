import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet, Text, View, ScrollView, FlatList, ActivityIndicator,
    TouchableOpacity, Image, Alert
} from 'react-native';
import Colors from '../Constants/Color';
import { refresh, setting, add, eye, edit, square, logout } from '../Assets';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { showInfoToast, showErrorToast, showSuccessToast } from '../utils/ToastUtil.js';

// --- Import the new modal components ---
import ViewDetailsModal from '../Components/ViewDetailsModal';
import FilterModal from '../Components/FilterModal';
import AddSamparkitModal from '../Components/AddSamparkitModal';
import { DAKSH_API } from '../config';
import UserProfileCard from '../Components/UserProfileCard.jsx';

// --- Configuration ---
const API_URL = `${DAKSH_API}/api/Gram/GetSamparkVyaktiDataV1`;
const ITEMS_PER_PAGE = 20;

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

// --- Reusable Row Item Component ---
// We pass `onView` and `onEdit` props to make it interactive
const TableRow = ({ item, onView, onEdit }) => {
    const fullName = [item.FirstName, item.MiddleName, item.LastName].filter(Boolean).join(' ');
    const fullAddress = [item.SamparkSuchiSthar, item.AddressKhand, item.shakhaname, item.subCategory, item.Category].filter(Boolean).join(' - ');

    return (
        <View style={styles.row}>
            <View style={[styles.cell, { width: 80 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={onView}>
                    <MaterialIcons name="remove-red-eye" color={Colors.bg_safron} size={24} />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={[styles.cell, { width: 60 }]}>
                <TouchableOpacity style={styles.iconButton} onPress={onEdit}>
                    <MaterialIcons name="edit" color={Colors.bg_safron} size={24} />
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
    const [accessToken, setAccessToken] = useState(null);

    // --- NEW STATE FOR FEATURES ---
    const [filters, setFilters] = useState({ Sthar: 'All', Sthan: '', Shredi: '' });
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [isViewModalVisible, setViewModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // To store item for viewing/editing
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    // --- Updated fetchData to be dynamic and wrapped in useCallback ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) {
                throw new Error('User data not found in local storage.');
            }

            const userData = JSON.parse(userDataString);
            const accessToken = userData?.token;
             setAccessToken(userData?.token)
             console.log(userData.user);
             
            // Also get user's position details for the API body if available
            const loginUserPosition = userData?.user?.Position || '';
            const loginUserPositionName = userData?.user?.PositionName || '';

            console.log(loginUserPosition, loginUserPositionName);

            const requestBody = {
                ...filters, // Use the filters from state
                LoginUserPosition: loginUserPosition,
                LoginUserPositionName: loginUserPositionName,
            };

            // 2. Log the object to see its contents
            console.log("Sending API Request Body:", JSON.stringify(requestBody, null, 2));

            console.log(accessToken);
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },

                
                body: JSON.stringify(requestBody),

            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(response);
            console.log(result);

            const listData = Array.isArray(result) ? result : result.Data;

            if (listData && Array.isArray(listData)) {
                setData(listData.reverse()); // Note: Sorting should ideally be an API parameter
                setTotalCount(listData.length);
                setCurrentPage(1);
            } else {
                throw new Error('Invalid data format received from API.');
            }

        } catch (e) {
            setError(e.message);
            console.error("Failed to fetch data:", e);
        } finally {
            setLoading(false);
        }
    }, [filters]); // Dependency: refetch whenever filters change

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- HANDLER FUNCTIONS FOR MODALS AND ACTIONS ---
    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setFilterModalVisible(false);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setViewModalVisible(true);
    };

    const handleEdit = (item) => {
        // This would open an Edit modal, which is often the same as an Add modal but pre-filled
        // Alert.alert("Edit Person", `This will open a form to edit ${item.FirstName}.`);
        // setSelectedItem(item);
        // setEditModalVisible(true);
        showInfoToast("edit ")
    };

    const handleAdd = () => {
        setAddModalVisible(true); // Open the modal
    };
    // --- NEW: Handler to save the data from the modal ---
    const handleSaveSamparkit = async (formData) => {
        // console.log("Saving new contact:", formData);
        // 1. Show a loading indicator
        // 2. Make your API call to save the data
        // For example: await api.addSamparkit(formData);
        // 3. On success:
        setAddModalVisible(false); // Close the modal
        // Alert.alert("Success", "New contact has been added.");
        fetchData(); // Refresh the list
        // 4. On failure: show an error message
    };


    // --- Pagination Logic (no changes needed) ---
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    // --- Render Functions (minor changes) ---
    const renderTableHeader = () => (
        <View style={styles.headerRow}>
            <View style={styles.headerCellContainerDark}>
                {/* Updated headers for clarity */}
                <Text style={[styles.headerText, { width: 80 }]}>देखें</Text>
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

    const renderCardContent = () => {
        if (loading) { return (<View style={styles.centered}><ActivityIndicator size="large" color={Colors.bg_safron} /><Text style={styles.loadingText}>कृपया प्रतीक्षा करें...</Text></View>); }
        if (error) { return (<View style={styles.centered}><Text style={styles.errorText}>Error: {error}</Text></View>); }

        return (
            <>
                <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                    <View>
                        {renderTableHeader()}
                        <FlatList
                            data={paginatedData}
                            keyExtractor={(item, index) => item.Id?.toString() || index.toString()}
                            // Pass handlers to each row
                            renderItem={({ item }) => (
                                <TableRow
                                    item={item}
                                    onView={() => handleViewDetails(item)}
                                    onEdit={() => handleEdit(item)}
                                />
                            )}
                            ItemSeparatorComponent={() => <View style={styles.rowSeparator} />}
                            ListEmptyComponent={<Text style={styles.emptyText}>No data found</Text>}
                        />
                    </View>
                </ScrollView>
                {totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                        <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1} style={styles.pageButton}><Text style={[styles.pageButtonText, currentPage === 1 && styles.disabledText]}>{'< पीछे'}</Text></TouchableOpacity>
                        <Text style={styles.pageInfoText}>{`${totalPages} में से पेज ${currentPage}`}</Text>
                        <TouchableOpacity onPress={handleNextPage} disabled={currentPage === totalPages} style={styles.pageButton}><Text style={[styles.pageButtonText, currentPage === totalPages && styles.disabledText]}>{'आगे >'}</Text></TouchableOpacity>
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
                    <TouchableOpacity onPress={fetchData}>
                        <MaterialIcons name="refresh" size={30} color="white" style={{ marginHorizontal: 8 }} />
                    </TouchableOpacity>
                    {/* Connect filter button to open modal */}
                    <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
                        <MaterialIcons name="filter-list" size={30} color="white" style={{ marginHorizontal: 8 }} />
                    </TouchableOpacity>
                    {/* Connect add button to handler */}
                    <TouchableOpacity onPress={handleAdd}>
                        <View style={{justifyContent:'center', textAlign:'center'}}>
                            <MaterialIcons name="add-circle" size={30} color="white" style={{ marginHorizontal: 8 }} />
                        <Text style={{color:"white", width:50, textAlign:'center', fontSize:8 , fontWeight:800}} >सम्पर्कित व्यक्ति जोड़े</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View>
                <Text style={styles.title}>संपर्क सूची (कुल - {totalCount})</Text>
            </View>

            <View style={styles.card}>
                {renderCardContent()}
            </View>

            {/* --- RENDER MODALS --- */}
            <FilterModal
                visible={isFilterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApplyFilters={handleApplyFilters}
            />
            <ViewDetailsModal
                visible={isViewModalVisible}
                onClose={() => setViewModalVisible(false)}
                item={selectedItem}
            />
            {/* <UserProfileCard user={existingUserData}
            
            /> */}

            <AddSamparkitModal
                visible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSave={handleSaveSamparkit}
                token={accessToken}
            />

        </SafeAreaView>
    );
};

// --- Styles (mostly unchanged, add these new styles at the end) ---
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
    },
    topHeaderIconsRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        paddingBottom: 4,
        fontWeight:800
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
        backgroundColor: Colors.grey_40, //'#616161',
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
        backgroundColor: Colors.black,//Colors.grey2, 
    },
    rowSeparator: {
        height: 2,
        backgroundColor: Colors.white,
    },
    cell: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        // backgroundColor:Colors.grey,
        // borderWidth:1,
        // borderBlockColor:Colors.white
    },
    cellText: {
        color: '#333',
        textAlign: 'center',
        fontSize: 12,
    },
    divider: {
        width: 2,
        backgroundColor: Colors.white,
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